import { ChecksResponse } from "@/lib/checks/types";

export type HistoryEntry = {
  id: string;
  timestamp: number;
  results: ChecksResponse;
};

export type AnalysisHistory = HistoryEntry[];

export const HISTORY_STORAGE_KEY = "infralens-history";
export const MAX_HISTORY_ENTRIES = 10;
