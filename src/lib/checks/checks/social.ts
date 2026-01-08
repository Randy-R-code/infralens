import { CheckRunner } from "../types";

export const runSocialCheck: CheckRunner<{
  openGraph: boolean;
  twitterCard: boolean;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
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

    // Check for Open Graph tags
    const ogTitle = html.match(
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i
    )?.[1];
    const ogDescription = html.match(
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i
    )?.[1];
    const ogImage = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    )?.[1];

    const openGraph = !!(ogTitle || ogDescription || ogImage);

    // Check for Twitter Card tags
    const twitterCard =
      html.match(/<meta[^>]+name=["']twitter:card["']/i) !== null;
    const twitterTitle = html.match(
      /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i
    )?.[1];
    const twitterDescription = html.match(
      /<meta[^>]+name=["']twitter:description["'][^>]+content=["']([^"']+)["']/i
    )?.[1];

    let status: "ok" | "warning" | "error" = "ok";
    let summary = "";

    if (openGraph && twitterCard) {
      summary = "Open Graph and Twitter Card tags are present.";
    } else if (openGraph) {
      status = "warning";
      summary = "Open Graph tags present, but Twitter Card tags missing.";
    } else if (twitterCard) {
      status = "warning";
      summary = "Twitter Card tags present, but Open Graph tags missing.";
    } else {
      status = "warning";
      summary = "Social sharing tags (Open Graph, Twitter Card) are missing.";
    }

    return {
      id: "social",
      label: "Social Tags",
      category: "metadata-stack",
      status,
      summary,
      data: {
        openGraph,
        twitterCard,
        ogImage,
        ogTitle,
        ogDescription,
        twitterTitle,
        twitterDescription,
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    clearTimeout(id);
    return {
      id: "social",
      label: "Social Tags",
      category: "metadata-stack",
      status: "error",
      summary: "Unable to analyze social tags.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
