"use client";

import { HistorySection } from "@/components/history/history-section";
import { CTA } from "@/components/landing/cta";
import { Hero } from "@/components/landing/hero";
import { ResultsSection } from "@/components/results/results-section";
import { useAnalysisHistory } from "@/hooks/use-analysis-history";
import { parseAnalysisError } from "@/lib/checks/parse-error";
import { ChecksResponse } from "@/lib/checks/types";
import { HistoryEntry } from "@/lib/history/types";
import { ReactNode, useState } from "react";
import { runInfraChecks } from "../../app/actions/run-checks";

export function HomeClient({
  landingSections,
  footer,
}: {
  landingSections: ReactNode;
  footer: ReactNode;
}) {
  const [results, setResults] = useState<ChecksResponse | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { history, addEntry, removeEntry, clearHistory } = useAnalysisHistory();

  const handleResults = (newResults: ChecksResponse) => {
    setResults(newResults);
    setIsLoading(false);
    addEntry(newResults);
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setResults(entry.results);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleReset = () => {
    setResults(undefined);
    setIsLoading(false);
    setTimeout(() => {
      document.getElementById("hero")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Shared analysis runner used by the CTA form
  const runAnalysis = async (url: string) => {
    setIsLoading(true);
    setResults(undefined);
    try {
      const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
      const newResults = await runInfraChecks(
        new URL(normalizedUrl).toString(),
      );
      setResults(newResults);
      addEntry(newResults);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      setResults(parseAnalysisError(error, url));
    } finally {
      setIsLoading(false);
    }
  };

  const hasResults = !isLoading && !!results;

  return (
    <main className="min-h-screen flex flex-col bg-zinc-900 text-zinc-100">
      <Hero
        onResults={handleResults}
        onAnalysisStart={() => {
          setIsLoading(true);
          setResults(undefined);
        }}
        isLoading={isLoading}
      />

      {(isLoading || results) && (
        <ResultsSection
          results={results}
          isLoading={isLoading}
          onNewAnalysis={handleReset}
        />
      )}

      {!hasResults && (
        <>
          <HistorySection
            history={history}
            onSelect={handleHistorySelect}
            onRemove={removeEntry}
            onClear={clearHistory}
          />
          {landingSections}
          <CTA onAnalyze={runAnalysis} isLoading={isLoading} />
        </>
      )}

      {footer}
    </main>
  );
}
