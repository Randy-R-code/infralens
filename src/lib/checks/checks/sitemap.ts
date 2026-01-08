import { CheckRunner } from "../types";

export const runSitemapCheck: CheckRunner<{
  present: boolean;
  format?: "xml" | "index";
  urlCount?: number;
  sitemapUrl?: string;
}> = async ({ url, timeout }) => {
  const start = performance.now();

  try {
    const urlObj = new URL(url);
    const sitemapUrl = `${urlObj.origin}/sitemap.xml`;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(sitemapUrl, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(id);

      const present = response.ok;
      let format: "xml" | "index" | undefined;
      let urlCount: number | undefined;

      if (present) {
        const text = await response.text();

        if (text.includes("<sitemapindex")) {
          format = "index";
          // Count sitemap entries
          urlCount = (text.match(/<sitemap>/g) || []).length;
        } else if (text.includes("<urlset")) {
          format = "xml";
          // Count URL entries
          urlCount = (text.match(/<url>/g) || []).length;
        }
      }

      let status: "ok" | "warning" | "error" = "ok";
      let summary = "";

      if (!present) {
        status = "warning";
        summary = "Sitemap not found at /sitemap.xml.";
      } else if (format) {
        summary = `Sitemap found (${format} format${
          urlCount ? `, ~${urlCount} URLs` : ""
        }).`;
      } else {
        status = "warning";
        summary = "Sitemap found but format is unclear.";
      }

      return {
        id: "sitemap",
        label: "Sitemap",
        category: "website-structure",
        status,
        summary,
        data: {
          present,
          format,
          urlCount,
          sitemapUrl,
        },
        durationMs: Math.round(performance.now() - start),
      };
    } catch {
      clearTimeout(id);
      return {
        id: "sitemap",
        label: "Sitemap",
        category: "website-structure",
        status: "warning",
        summary: "Unable to fetch sitemap.",
        durationMs: Math.round(performance.now() - start),
      };
    }
  } catch {
    return {
      id: "sitemap",
      label: "Sitemap",
      category: "website-structure",
      status: "warning",
      summary: "Unable to check sitemap.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
