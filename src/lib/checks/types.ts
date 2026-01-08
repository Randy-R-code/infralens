export type CheckStatus = "ok" | "warning" | "error";

export type CheckCategory =
  | "http-security"
  | "network-dns"
  | "infrastructure"
  | "website-structure"
  | "metadata-stack"
  | "performance";

export type RecommendationSeverity = "info" | "warning" | "critical";

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  impact: string;
  howTo?: string[];
  references?: {
    label: string;
    url: string;
  }[];
  severity: RecommendationSeverity;
};

export type CheckResult<T = unknown> = {
  id: string;
  label: string;
  category: CheckCategory;
  status: CheckStatus;
  summary?: string;
  data?: T;
  durationMs: number;
  recommendation?: Recommendation;
};

export type ChecksResponse = {
  url: string;
  hostname: string;
  checks: CheckResult[];
  totalDurationMs: number;
  score: GlobalScore;
};

export type CheckContext = {
  url: string;
  hostname: string;
  timeout: number;
};

export type CheckRunner<T = unknown> = (
  context: CheckContext
) => Promise<CheckResult<T>>;

// --------------------
// Scoring types
// --------------------

export type CategoryScore = {
  category: CheckCategory;
  score: number; // 0 - 100
  maxScore: number;
};

export type GlobalScore = {
  score: number; // 0 - 100
  grade: "A" | "B" | "C" | "D" | "E";
  categories: CategoryScore[];
};
