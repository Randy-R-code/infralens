"use client";

import { ChecksResponse } from "@/lib/checks/types";
import {
  AnalysisHistory,
  HISTORY_STORAGE_KEY,
  HistoryEntry,
  MAX_HISTORY_ENTRIES,
} from "@/lib/history/types";
import { nanoid } from "nanoid";
import { useCallback, useSyncExternalStore } from "react";

function isValidEntry(entry: unknown): entry is HistoryEntry {
  if (!entry || typeof entry !== "object") return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.timestamp === "number" &&
    e.results !== null &&
    typeof e.results === "object" &&
    typeof (e.results as Record<string, unknown>).hostname === "string" &&
    typeof (e.results as Record<string, unknown>).url === "string" &&
    (e.results as Record<string, unknown>).score !== null &&
    typeof (e.results as Record<string, unknown>).score === "object"
  );
}

function loadFromStorage(): AnalysisHistory {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as unknown[];
    // Filter out invalid entries
    return parsed.filter(isValidEntry);
  } catch {
    return [];
  }
}

function saveToStorage(history: AnalysisHistory): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    // Dispatch event to notify other tabs/hooks
    window.dispatchEvent(
      new StorageEvent("storage", { key: HISTORY_STORAGE_KEY })
    );
  } catch (error) {
    console.error("Failed to save history to localStorage:", error);
  }
}

// Store for useSyncExternalStore
let listeners: Array<() => void> = [];
let cachedHistory: AnalysisHistory | null = null;

// Cached empty array for server snapshot (must be stable reference)
const EMPTY_HISTORY: AnalysisHistory = [];

function subscribe(callback: () => void) {
  listeners.push(callback);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === HISTORY_STORAGE_KEY || e.key === null) {
      cachedHistory = null; // Invalidate cache
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners = listeners.filter((l) => l !== callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getSnapshot(): AnalysisHistory {
  if (cachedHistory === null) {
    cachedHistory = loadFromStorage();
  }
  return cachedHistory;
}

function getServerSnapshot(): AnalysisHistory {
  return EMPTY_HISTORY; // Always return same reference on server
}

function notifyListeners() {
  cachedHistory = null; // Invalidate cache
  listeners.forEach((l) => l());
}

export function useAnalysisHistory() {
  const history = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Add a new entry (FIFO, max 10)
  const addEntry = useCallback((results: ChecksResponse) => {
    // Don't save error-only results
    if (results.checks.length === 1 && results.checks[0].id === "error") {
      return;
    }

    const currentHistory = loadFromStorage();
    const existingIndex = currentHistory.findIndex(
      (entry) => entry.results.url === results.url
    );

    let newHistory: AnalysisHistory;

    if (existingIndex !== -1) {
      // Update existing entry and move to top
      const newEntry: HistoryEntry = {
        id: currentHistory[existingIndex].id,
        timestamp: Date.now(),
        results,
      };
      newHistory = [
        newEntry,
        ...currentHistory.slice(0, existingIndex),
        ...currentHistory.slice(existingIndex + 1),
      ];
    } else {
      // Add new entry
      const newEntry: HistoryEntry = {
        id: nanoid(),
        timestamp: Date.now(),
        results,
      };
      newHistory = [newEntry, ...currentHistory].slice(0, MAX_HISTORY_ENTRIES);
    }

    saveToStorage(newHistory);
    notifyListeners();
  }, []);

  // Remove a single entry
  const removeEntry = useCallback((id: string) => {
    const currentHistory = loadFromStorage();
    const newHistory = currentHistory.filter((entry) => entry.id !== id);
    saveToStorage(newHistory);
    notifyListeners();
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    saveToStorage([]);
    notifyListeners();
  }, []);

  return {
    history,
    addEntry,
    removeEntry,
    clearHistory,
  };
}
