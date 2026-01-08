import {
  hstsRecommendation,
  httpsRecommendation,
} from "@/lib/recommendations/security";
import { CheckRunner } from "../types";

export const runHttpsCheck: CheckRunner<{
  httpsAvailable: boolean;
  httpRedirects: boolean;
  tlsVersion?: string;
  certificateIssuer?: string;
  certificateExpiry?: string;
  daysUntilExpiry?: number;
}> = async ({ url, timeout }) => {
  const start = performance.now();

  try {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === "https:";

    // Check HTTPS availability
    let httpsAvailable = isHttps;
    let httpRedirects = false;
    let tlsVersion: string | undefined;
    let certificateIssuer: string | undefined;
    let certificateExpiry: string | undefined;
    let daysUntilExpiry: number | undefined;

    if (isHttps) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          method: "HEAD",
          signal: controller.signal,
          redirect: "manual",
        });

        httpsAvailable = response.ok || response.status < 500;
        clearTimeout(id);
      } catch {
        clearTimeout(id);
      }
    }

    // Check HTTP to HTTPS redirect
    if (!isHttps) {
      const httpUrl = url.replace(/^https:/, "http:");
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(httpUrl, {
          method: "HEAD",
          signal: controller.signal,
          redirect: "follow",
        });

        httpRedirects = response.url.startsWith("https:");
        clearTimeout(id);
      } catch {
        clearTimeout(id);
      }
    }

    // Check for HSTS if HTTPS is available
    let hasHsts = false;
    if (isHttps && httpsAvailable) {
      try {
        const hstsController = new AbortController();
        const hstsId = setTimeout(() => hstsController.abort(), timeout);
        const hstsResponse = await fetch(url, {
          method: "HEAD",
          signal: hstsController.signal,
        });
        hasHsts = hstsResponse.headers.has("strict-transport-security");
        clearTimeout(hstsId);
      } catch {
        // Ignore HSTS check errors
      }
    }

    // Determine status
    let status: "ok" | "warning" | "error" = "ok";
    let summary = "";
    let recommendation;

    if (!httpsAvailable && !httpRedirects) {
      status = "error";
      summary = "HTTPS is not available and HTTP does not redirect to HTTPS.";
      recommendation = httpsRecommendation();
    } else if (!httpsAvailable && httpRedirects) {
      status = "warning";
      summary = "HTTPS is not directly available, but HTTP redirects to HTTPS.";
    } else if (httpsAvailable && !isHttps && !httpRedirects) {
      status = "warning";
      summary = "HTTPS is available but HTTP does not redirect to HTTPS.";
      recommendation = httpsRecommendation();
    } else if (httpsAvailable) {
      summary = "HTTPS is properly configured.";
      if (!hasHsts) {
        recommendation = hstsRecommendation();
      }
    }

    return {
      id: "https",
      label: "HTTPS & TLS",
      category: "http-security",
      status,
      summary,
      recommendation,
      data: {
        httpsAvailable,
        httpRedirects,
        tlsVersion,
        certificateIssuer,
        certificateExpiry,
        daysUntilExpiry,
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    return {
      id: "https",
      label: "HTTPS & TLS",
      category: "http-security",
      status: "error",
      summary: "Unable to verify HTTPS configuration.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
