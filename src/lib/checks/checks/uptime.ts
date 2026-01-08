import { CheckRunner } from "../types";

export const runUptimeCheck: CheckRunner<{
  reachable: boolean;
  statusCode: number;
  responseTime: number;
}> = async ({ url, timeout }) => {
  const start = performance.now();

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const fetchStart = performance.now();
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });

    const responseTime = Math.round(performance.now() - fetchStart);
    clearTimeout(id);

    const statusCode = response.status;
    const reachable = response.ok || (statusCode >= 200 && statusCode < 500);

    let status: "ok" | "warning" | "error" = "ok";
    let summary = "";

    if (!reachable) {
      status = "error";
      summary = `Site is not reachable (HTTP ${statusCode}).`;
    } else if (statusCode >= 400 && statusCode < 500) {
      status = "warning";
      summary = `Site returned client error (HTTP ${statusCode}).`;
    } else if (statusCode >= 500) {
      status = "error";
      summary = `Site returned server error (HTTP ${statusCode}).`;
    } else {
      summary = `Site is reachable (HTTP ${statusCode}, ${responseTime}ms).`;
    }

    return {
      id: "uptime",
      label: "Uptime Snapshot",
      category: "performance",
      status,
      summary,
      data: {
        reachable,
        statusCode,
        responseTime,
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    clearTimeout(id);
    return {
      id: "uptime",
      label: "Uptime Snapshot",
      category: "performance",
      status: "error",
      summary: "Site is not reachable or timed out.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
