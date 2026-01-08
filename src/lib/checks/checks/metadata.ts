import { CheckRunner } from "../types";

export const runMetadataCheck: CheckRunner<{
  title?: string;
  description?: string;
  charset?: string;
  viewport?: string;
  hasAll: boolean;
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

    // Extract metadata using regex (simple approach)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : undefined;

    const descMatch = html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i
    );
    const description = descMatch ? descMatch[1].trim() : undefined;

    const charsetMatch = html.match(/<meta[^>]+charset=["']([^"']+)["']/i);
    const charset = charsetMatch ? charsetMatch[1].trim() : undefined;

    const viewportMatch = html.match(
      /<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)["']/i
    );
    const viewport = viewportMatch ? viewportMatch[1].trim() : undefined;

    const hasAll = !!(title && description && charset && viewport);

    let status: "ok" | "warning" | "error" = "ok";
    const missing: string[] = [];
    if (!title) missing.push("title");
    if (!description) missing.push("description");
    if (!charset) missing.push("charset");
    if (!viewport) missing.push("viewport");

    if (missing.length === 0) {
      status = "ok";
    } else if (missing.length <= 2) {
      status = "warning";
    } else {
      status = "error";
    }

    const summary = hasAll
      ? "All essential metadata is present."
      : `Missing metadata: ${missing.join(", ")}.`;

    return {
      id: "metadata",
      label: "HTML Metadata",
      category: "metadata-stack",
      status,
      summary,
      data: {
        title,
        description,
        charset,
        viewport,
        hasAll,
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    clearTimeout(id);
    return {
      id: "metadata",
      label: "HTML Metadata",
      category: "metadata-stack",
      status: "error",
      summary: "Unable to fetch and analyze HTML metadata.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
