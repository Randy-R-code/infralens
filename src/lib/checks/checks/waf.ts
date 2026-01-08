import { CheckRunner } from "../types";

const WAF_INDICATORS: Record<string, string> = {
  "cf-ray": "Cloudflare",
  server: "Cloudflare",
  "x-sucuri-id": "Sucuri",
  "x-sucuri-cache": "Sucuri",
  "x-fastly-request-id": "Fastly",
  "x-akamai-request-id": "Akamai",
  "x-akamai-transformed": "Akamai",
  "x-aws-cf-id": "AWS CloudFront",
  "x-amz-cf-id": "AWS CloudFront",
  "x-amz-cf-pop": "AWS CloudFront",
};

export const runWafCheck: CheckRunner<{
  detected: string[];
  wafProvider?: string;
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

    const detected: string[] = [];
    let wafProvider: string | undefined;

    // Check headers for WAF indicators
    for (const [header, provider] of Object.entries(WAF_INDICATORS)) {
      if (response.headers.has(header)) {
        detected.push(header);
        if (!wafProvider) {
          wafProvider = provider;
        }
      }
    }

    // Check Server header for specific providers
    const server = response.headers.get("server")?.toLowerCase() || "";
    if (server.includes("cloudflare")) {
      wafProvider = "Cloudflare";
      detected.push("server: Cloudflare");
    } else if (server.includes("cloudfront")) {
      wafProvider = "AWS CloudFront";
      detected.push("server: CloudFront");
    }

    let status: "ok" | "warning" | "error" = "ok";
    let summary = "";

    if (wafProvider) {
      summary = `WAF/CDN detected: ${wafProvider}.`;
    } else {
      status = "warning";
      summary = "No WAF or CDN detected in headers.";
    }

    return {
      id: "waf",
      label: "Firewall / WAF Detection",
      category: "infrastructure",
      status,
      summary,
      data: {
        detected,
        wafProvider,
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    clearTimeout(id);
    return {
      id: "waf",
      label: "Firewall / WAF Detection",
      category: "infrastructure",
      status: "error",
      summary: "Unable to detect WAF/CDN.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
