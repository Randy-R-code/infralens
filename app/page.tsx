"use client";

import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowResults } from "@/components/landing/how-results";
import { WhatItChecks } from "@/components/landing/what-it-checks";
import { WhyInfraLens } from "@/components/landing/why-infralens";
import { ResultsSection } from "@/components/results/results-section";
import { ChecksResponse } from "@/lib/checks/types";
import { useState } from "react";
import { runInfraChecks } from "./actions/run-checks";

export default function Home() {
  const [results, setResults] = useState<ChecksResponse | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleResults = (newResults: ChecksResponse) => {
    setResults(newResults);
    setIsLoading(false);
  };

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setResults(undefined);
  };

  const handleReset = () => {
    setResults(undefined);
    setIsLoading(false);
    // Scroll back to hero
    setTimeout(() => {
      document.getElementById("hero")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleCtaAnalyze = async (url: string) => {
    setIsLoading(true);
    setResults(undefined);

    // Update hero input visually
    const heroInput = document
      .getElementById("hero")
      ?.querySelector('input[type="url"]') as HTMLInputElement;
    if (heroInput) {
      heroInput.value = url;
    }

    // Trigger analysis directly using the same logic as Hero
    try {
      const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
      const urlObj = new URL(normalizedUrl);
      const results = await runInfraChecks(urlObj.toString());
      setResults(results);
      setIsLoading(false);

      // Scroll to results after a short delay
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      console.error("Error running checks:", error);
      setIsLoading(false);

      // Improved error handling
      let errorMessage =
        "Failed to analyze the URL. Please check the URL and try again.";
      let hostname = "unknown";

      if (error instanceof Error) {
        // Rate limit error
        if (error.message.includes("Rate limit exceeded")) {
          errorMessage = error.message;
        }
        // URL validation error
        else if (
          error.message.includes("Invalid URL") ||
          error.name === "TypeError"
        ) {
          errorMessage =
            "Invalid URL format. Please enter a valid URL (e.g., https://example.com)";
        }
        // Network/timeout error
        else if (
          error.message.includes("timeout") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Request timed out or network error. Please check your connection and try again.";
        }
        // Generic error with message
        else if (error.message) {
          errorMessage = error.message;
        }
      }

      // Try to extract hostname
      try {
        const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
        const urlObj = new URL(normalizedUrl);
        hostname = urlObj.hostname;
      } catch {
        // Keep "unknown" if URL is invalid
      }

      setResults({
        url: url.startsWith("http") ? url : `https://${url}`,
        hostname,
        checks: [
          {
            id: "error",
            label: "Analysis Error",
            category: "http-security",
            status: "error",
            summary: errorMessage,
            durationMs: 0,
          },
        ],
        totalDurationMs: 0,
        score: {
          score: 0,
          grade: "E",
          categories: [],
        },
      });
    }
  };

  const hasResults = !isLoading && !!results;

  return (
    <main className="min-h-screen flex flex-col bg-zinc-900 text-zinc-100">
      <Hero
        onResults={handleResults}
        onAnalysisStart={handleAnalysisStart}
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
          <WhatItChecks />
          <HowResults />
          <WhyInfraLens />
          <CTA onAnalyze={handleCtaAnalyze} isLoading={isLoading} />
        </>
      )}
      <Footer />
    </main>
  );
}
