import {
  excessiveRedirectsRecommendation,
  redirectLoopRecommendation,
} from "@/lib/recommendations/security";
import { CheckRunner } from "../types";

const MAX_REDIRECTS = 10;

export const runRedirectsCheck: CheckRunner<{
  redirectCount: number;
  finalUrl: string;
  redirectChain: string[];
  hasLoop: boolean;
}> = async ({ url, timeout }) => {
  const start = performance.now();

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const redirectChain: string[] = [url];
    let currentUrl = url;
    let redirectCount = 0;
    let hasLoop = false;

    // Follow redirects manually to detect loops
    while (redirectCount < MAX_REDIRECTS) {
      const response = await fetch(currentUrl, {
        method: "HEAD",
        signal: controller.signal,
        redirect: "manual",
      });

      if (
        response.status === 301 ||
        response.status === 302 ||
        response.status === 307 ||
        response.status === 308
      ) {
        const location = response.headers.get("location");
        if (!location) break;

        const nextUrl = new URL(location, currentUrl).toString();

        // Check for loop
        if (redirectChain.includes(nextUrl)) {
          hasLoop = true;
          break;
        }

        redirectChain.push(nextUrl);
        currentUrl = nextUrl;
        redirectCount++;
      } else {
        break;
      }
    }

    clearTimeout(id);

    const finalUrl = redirectChain[redirectChain.length - 1] || url;

    let status: "ok" | "warning" | "error" = "ok";
    let summary = "";
    let recommendation;

    if (hasLoop) {
      status = "error";
      summary = "Redirect loop detected.";
      recommendation = redirectLoopRecommendation();
    } else if (redirectCount > 5) {
      status = "warning";
      summary = `Excessive redirects detected (${redirectCount} redirects).`;
      recommendation = excessiveRedirectsRecommendation(redirectCount);
    } else if (redirectCount > 0) {
      summary = `Redirect chain: ${redirectCount} redirect(s) to final URL.`;
    } else {
      summary = "No redirects detected.";
    }

    return {
      id: "redirects",
      label: "Redirect Behavior",
      category: "http-security",
      status,
      summary,
      recommendation,
      data: {
        redirectCount,
        finalUrl,
        redirectChain,
        hasLoop,
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    clearTimeout(id);
    return {
      id: "redirects",
      label: "Redirect Behavior",
      category: "http-security",
      status: "error",
      summary: "Unable to analyze redirect behavior.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
