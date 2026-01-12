import { CheckRunner } from "../types";

export const runAccessibilityCheck: CheckRunner<{
  hasLang: boolean;
  lang?: string;
  hasSkipLink: boolean;
  hasH1: boolean;
  h1Count: number;
  imagesWithoutAlt: number;
  totalImages: number;
  ariaLandmarks: string[];
}> = async ({ url, timeout }) => {
  const start = performance.now();

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });

    const html = await response.text();
    clearTimeout(id);

    // Check for lang attribute on html tag
    const htmlLangMatch = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
    const hasLang = !!htmlLangMatch;
    const lang = htmlLangMatch ? htmlLangMatch[1] : undefined;

    // Check for skip link (common patterns)
    const skipLinkPatterns = [
      /href=["']#main/i,
      /href=["']#content/i,
      /href=["']#skip/i,
      /class=["'][^"']*skip[^"']*["']/i,
      /skip.{0,10}(to|link|nav)/i,
    ];
    const hasSkipLink = skipLinkPatterns.some((pattern) => pattern.test(html));

    // Check for h1
    const h1Matches = html.match(/<h1[^>]*>/gi) || [];
    const hasH1 = h1Matches.length > 0;
    const h1Count = h1Matches.length;

    // Check for images without alt
    const imgMatches = html.match(/<img[^>]*>/gi) || [];
    const totalImages = imgMatches.length;
    let imagesWithoutAlt = 0;
    for (const img of imgMatches) {
      if (!img.includes("alt=")) {
        imagesWithoutAlt++;
      }
    }

    // Check for ARIA landmarks
    const ariaLandmarks: string[] = [];
    const landmarkPatterns = [
      { pattern: /role=["']banner["']/i, name: "banner" },
      { pattern: /role=["']navigation["']/i, name: "navigation" },
      { pattern: /role=["']main["']/i, name: "main" },
      { pattern: /role=["']contentinfo["']/i, name: "contentinfo" },
      { pattern: /<header[^>]*>/i, name: "header" },
      { pattern: /<nav[^>]*>/i, name: "nav" },
      { pattern: /<main[^>]*>/i, name: "main" },
      { pattern: /<footer[^>]*>/i, name: "footer" },
    ];

    for (const { pattern, name } of landmarkPatterns) {
      if (pattern.test(html) && !ariaLandmarks.includes(name)) {
        ariaLandmarks.push(name);
      }
    }

    // Determine status
    const issues: string[] = [];
    if (!hasLang) issues.push("missing lang attribute");
    if (!hasH1) issues.push("no h1 heading");
    if (h1Count > 1) issues.push(`multiple h1 (${h1Count})`);
    if (imagesWithoutAlt > 0)
      issues.push(`${imagesWithoutAlt} images without alt`);
    if (ariaLandmarks.length < 2) issues.push("few landmarks");

    let status: "ok" | "warning" | "error" = "ok";
    let summary = "";

    if (issues.length === 0) {
      summary = "Good accessibility practices detected.";
    } else if (issues.length <= 2) {
      status = "warning";
      summary = `Minor issues: ${issues.join(", ")}.`;
    } else {
      status = "error";
      summary = `Issues found: ${issues.join(", ")}.`;
    }

    return {
      id: "accessibility",
      label: "Accessibility Hints",
      category: "metadata-stack",
      status,
      summary,
      data: {
        hasLang,
        lang,
        hasSkipLink,
        hasH1,
        h1Count,
        imagesWithoutAlt,
        totalImages,
        ariaLandmarks,
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    clearTimeout(id);
    return {
      id: "accessibility",
      label: "Accessibility Hints",
      category: "metadata-stack",
      status: "error",
      summary: "Unable to analyze accessibility hints.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
