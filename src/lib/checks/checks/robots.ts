import { CheckRunner } from "../types";

export const runRobotsCheck: CheckRunner<{
  present: boolean;
  status: number;
  isValid: boolean;
  content?: string;
}> = async ({ url, timeout }) => {
  const start = performance.now();

  try {
    const urlObj = new URL(url);
    const robotsUrl = `${urlObj.origin}/robots.txt`;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(robotsUrl, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(id);

      const status = response.status;
      const present = status === 200;
      let isValid = false;
      let content: string | undefined;

      if (present) {
        content = await response.text();
        // Basic validation: check for common robots.txt patterns
        isValid =
          content.includes("User-agent:") ||
          content.includes("Disallow:") ||
          content.includes("Allow:") ||
          content.includes("Sitemap:");
      }

      let checkStatus: "ok" | "warning" | "error" = "ok";
      let summary = "";

      if (!present) {
        checkStatus = "warning";
        summary = "robots.txt is not present.";
      } else if (!isValid) {
        checkStatus = "warning";
        summary = "robots.txt is present but may be invalid or empty.";
      } else {
        summary = "robots.txt is present and appears valid.";
      }

      return {
        id: "robots",
        label: "robots.txt",
        category: "website-structure",
        status: checkStatus,
        summary,
        data: {
          present,
          status,
          isValid,
          content: content?.substring(0, 500), // Limit content size
        },
        durationMs: Math.round(performance.now() - start),
      };
    } catch {
      clearTimeout(id);
      return {
        id: "robots",
        label: "robots.txt",
        category: "website-structure",
        status: "error",
        summary: "Unable to fetch robots.txt.",
        durationMs: Math.round(performance.now() - start),
      };
    }
  } catch {
    return {
      id: "robots",
      label: "robots.txt",
      category: "website-structure",
      status: "error",
      summary: "Unable to check robots.txt.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
