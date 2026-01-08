import { ChecksResponse, GlobalScore } from "./types";

export type InfraLensExport = {
  url: string;
  scannedAt: string;
  score: number;
  grade: GlobalScore["grade"];
  categories: Array<{
    category: string;
    score: number;
    maxScore: number;
  }>;
  checks: Array<{
    id: string;
    label: string;
    category: string;
    status: string;
    summary?: string;
    durationMs: number;
  }>;
  version: string;
};

export function buildExport(response: ChecksResponse): InfraLensExport {
  return {
    url: response.url,
    scannedAt: new Date().toISOString(),
    score: response.score.score,
    grade: response.score.grade,
    categories: response.score.categories.map((c) => ({
      category: c.category,
      score: c.score,
      maxScore: c.maxScore,
    })),
    checks: response.checks.map((check) => ({
      id: check.id,
      label: check.label,
      category: check.category,
      status: check.status,
      summary: check.summary,
      durationMs: check.durationMs,
    })),
    version: "1.0.0",
  };
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
