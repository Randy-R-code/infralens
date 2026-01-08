import {
  compressionRecommendation,
  performanceRecommendation,
} from "@/lib/recommendations/performance";
import { CheckRunner } from "../types";

export const runPerformanceCheck: CheckRunner<{
  responseTime: number;
  responseSize: number;
  compression?: "gzip" | "br" | "none";
  statusCode: number;
}> = async ({ url, timeout }) => {
  const start = performance.now();

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const fetchStart = performance.now();
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });

    const responseTime = Math.round(performance.now() - fetchStart);
    clearTimeout(id);

    const contentEncoding = response.headers.get("content-encoding");
    const compression: "gzip" | "br" | "none" = contentEncoding?.includes("br")
      ? "br"
      : contentEncoding?.includes("gzip")
      ? "gzip"
      : "none";

    const contentLength = response.headers.get("content-length");
    const responseSize = contentLength ? parseInt(contentLength, 10) : 0;

    const statusCode = response.status;

    let status: "ok" | "warning" | "error" = "ok";
    let summary = "";
    const recommendations = [];

    if (responseTime > 2000) {
      status = "error";
      summary = `Slow response time: ${responseTime}ms.`;
      recommendations.push(performanceRecommendation(responseTime));
    } else if (responseTime > 1000) {
      status = "warning";
      summary = `Response time is high: ${responseTime}ms.`;
      recommendations.push(performanceRecommendation(responseTime));
    } else {
      summary = `Response time: ${responseTime}ms.`;
    }

    if (compression === "none" && responseSize > 10000) {
      if (status === "ok") status = "warning";
      summary += " Compression not enabled.";
      recommendations.push(compressionRecommendation());
    } else if (compression !== "none") {
      summary += ` Compression: ${compression}.`;
    }

    return {
      id: "performance",
      label: "Performance Signals",
      category: "performance",
      status,
      summary,
      recommendation: recommendations[0], // Use first recommendation if multiple
      data: {
        responseTime,
        responseSize,
        compression,
        statusCode,
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    clearTimeout(id);
    return {
      id: "performance",
      label: "Performance Signals",
      category: "performance",
      status: "error",
      summary: "Unable to measure performance metrics.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
