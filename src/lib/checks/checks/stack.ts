import { CheckRunner } from "../types";

// Technology detection patterns
const STACK_PATTERNS = {
  frameworks: [
    { name: "Next.js", pattern: /__next|_next\/static|next\.js/i },
    { name: "React", pattern: /react|react-dom/i },
    { name: "Vue.js", pattern: /vue|vue\.js/i },
    { name: "Angular", pattern: /angular|ng-/i },
    { name: "Svelte", pattern: /svelte/i },
    { name: "Gatsby", pattern: /gatsby/i },
  ],
  cms: [
    { name: "WordPress", pattern: /wp-content|wp-includes|wordpress/i },
    { name: "Drupal", pattern: /drupal|sites\/all/i },
    { name: "Joomla", pattern: /joomla|components\/com_/i },
    { name: "Ghost", pattern: /ghost/i },
    { name: "Strapi", pattern: /strapi/i },
  ],
  analytics: [
    { name: "Google Analytics", pattern: /google-analytics|ga\(|gtag/i },
    { name: "Google Tag Manager", pattern: /googletagmanager|GTM-/i },
    { name: "Adobe Analytics", pattern: /omniture|adobe.*analytics/i },
    { name: "Mixpanel", pattern: /mixpanel/i },
    { name: "Segment", pattern: /segment\.com|analytics\.js/i },
  ],
  cdn: [
    { name: "Cloudflare", pattern: /cloudflare|cf-ray/i },
    { name: "Fastly", pattern: /fastly/i },
    { name: "Akamai", pattern: /akamai/i },
    { name: "AWS CloudFront", pattern: /cloudfront|amazonaws/i },
    { name: "Vercel", pattern: /vercel|_vercel/i },
    { name: "Netlify", pattern: /netlify/i },
  ],
};

export const runStackCheck: CheckRunner<{
  frameworks: string[];
  cms: string[];
  analytics: string[];
  cdn: string[];
  detected: string[];
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
    const headers = response.headers;
    clearTimeout(id);

    const frameworks: string[] = [];
    const cms: string[] = [];
    const analytics: string[] = [];
    const cdn: string[] = [];

    // Check headers for CDN/server info
    const server = headers.get("server")?.toLowerCase() || "";
    const poweredBy = headers.get("x-powered-by")?.toLowerCase() || "";
    const allHeaders = `${server} ${poweredBy}`;

    // Check CDN in headers
    STACK_PATTERNS.cdn.forEach(({ name, pattern }) => {
      if (pattern.test(allHeaders)) {
        cdn.push(name);
      }
    });

    // Check HTML content
    const htmlLower = html.toLowerCase();

    // Check frameworks
    STACK_PATTERNS.frameworks.forEach(({ name, pattern }) => {
      if (pattern.test(htmlLower) || pattern.test(allHeaders)) {
        frameworks.push(name);
      }
    });

    // Check CMS
    STACK_PATTERNS.cms.forEach(({ name, pattern }) => {
      if (pattern.test(htmlLower) || pattern.test(allHeaders)) {
        cms.push(name);
      }
    });

    // Check analytics
    STACK_PATTERNS.analytics.forEach(({ name, pattern }) => {
      if (pattern.test(htmlLower)) {
        analytics.push(name);
      }
    });

    // Check CDN in HTML (if not already found in headers)
    if (cdn.length === 0) {
      STACK_PATTERNS.cdn.forEach(({ name, pattern }) => {
        if (pattern.test(htmlLower)) {
          cdn.push(name);
        }
      });
    }

    const detected = [...frameworks, ...cms, ...analytics, ...cdn].filter(
      (v, i, a) => a.indexOf(v) === i
    ); // Remove duplicates

    let status: "ok" | "warning" | "error" = "ok";
    let summary = "";

    if (detected.length === 0) {
      status = "warning";
      summary = "No technologies detected.";
    } else {
      const categories: string[] = [];
      if (frameworks.length > 0)
        categories.push(`${frameworks.length} framework(s)`);
      if (cms.length > 0) categories.push(`${cms.length} CMS`);
      if (analytics.length > 0)
        categories.push(`${analytics.length} analytics`);
      if (cdn.length > 0) categories.push(`${cdn.length} CDN`);

      summary = `Detected: ${categories.join(", ")}.`;
    }

    return {
      id: "stack",
      label: "Technology Stack",
      category: "metadata-stack",
      status,
      summary,
      data: {
        frameworks,
        cms,
        analytics,
        cdn,
        detected,
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    clearTimeout(id);
    return {
      id: "stack",
      label: "Technology Stack",
      category: "metadata-stack",
      status: "error",
      summary: "Unable to detect technology stack.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
