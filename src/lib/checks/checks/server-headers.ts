import { CheckRunner } from "../types";

export const runServerHeadersCheck: CheckRunner<{
  server?: string;
  poweredBy?: string;
  hasInfoLeak: boolean;
  detected: string[];
}> = async ({ url, timeout }) => {
  const start = performance.now();

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(id);

    const server = response.headers.get("server") || undefined;
    const poweredBy = response.headers.get("x-powered-by") || undefined;
    const detected: string[] = [];

    if (server) detected.push(`Server: ${server}`);
    if (poweredBy) detected.push(`X-Powered-By: ${poweredBy}`);

    // Check for other information leakage headers
    const suspiciousHeaders = [
      "x-aspnet-version",
      "x-runtime",
      "x-version",
      "server",
    ];

    const hasInfoLeak =
      !!poweredBy ||
      suspiciousHeaders.some((header) => response.headers.has(header));

    let status: "ok" | "warning" | "error" = "ok";
    let summary = "";

    if (poweredBy) {
      status = "warning";
      summary = "X-Powered-By header exposes server information.";
    } else if (hasInfoLeak) {
      status = "warning";
      summary = "Server headers may expose unnecessary information.";
    } else if (server) {
      summary = `Server: ${server}`;
    } else {
      summary = "No server information exposed in headers.";
    }

    return {
      id: "server-headers",
      label: "Server Headers",
      category: "metadata-stack",
      status,
      summary,
      data: {
        server,
        poweredBy,
        hasInfoLeak,
        detected,
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    clearTimeout(id);
    return {
      id: "server-headers",
      label: "Server Headers",
      category: "metadata-stack",
      status: "error",
      summary: "Unable to analyze server headers.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
