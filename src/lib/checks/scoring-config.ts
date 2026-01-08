import { CheckCategory } from "./types";

export const CATEGORY_WEIGHTS: Record<CheckCategory, number> = {
  "http-security": 25,
  "network-dns": 20,
  infrastructure: 20,
  "website-structure": 15,
  "metadata-stack": 10,
  performance: 10,
};

export const STATUS_MULTIPLIER = {
  ok: 1,
  warning: 0.6,
  error: 0,
} as const;
