export type CheckStatus = "ok" | "warning" | "error";

export type CheckResult<T = unknown> = {
  id: string;
  label: string;
  status: CheckStatus;
  summary?: string;
  data?: T;
  durationMs: number;
};

export type ChecksResponse = {
  url: string;
  hostname: string;
  checks: CheckResult[];
  totalDurationMs: number;
};

export type CheckContext = {
  url: string;
  hostname: string;
  timeout: number;
};

export type CheckRunner<T = unknown> = (
  context: CheckContext
) => Promise<CheckResult<T>>;
