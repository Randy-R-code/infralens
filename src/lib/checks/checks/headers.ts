import { CheckRunner } from "../types";

const REQUIRED_HEADERS = [
  "content-security-policy",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "strict-transport-security",
];

export const runHeadersCheck: CheckRunner<{
  present: string[];
  missing: string[];
}> = async ({ url, timeout }) => {
  const start = performance.now();

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });

    const headers = response.headers;

    const present: string[] = [];
    const missing: string[] = [];

    for (const header of REQUIRED_HEADERS) {
      if (headers.has(header)) {
        present.push(header);
      } else {
        missing.push(header);
      }
    }

    const status =
      missing.length === 0 ? "ok" : present.length > 0 ? "warning" : "error";

    return {
      id: "headers",
      label: "HTTP Security Headers",
      status,
      summary:
        missing.length === 0
          ? "All recommended security headers are present."
          : `Missing ${missing.length} recommended security headers.`,
      data: {
        present,
        missing,
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    return {
      id: "headers",
      label: "HTTP Security Headers",
      status: "error",
      summary: "Unable to fetch headers.",
      durationMs: Math.round(performance.now() - start),
    };
  } finally {
    clearTimeout(id);
  }
};
