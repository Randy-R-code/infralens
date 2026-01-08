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

  const handleCtaAnalyze = (url: string) => {
    setIsLoading(true);
    setResults(undefined);
    // Scroll to hero first
    setTimeout(() => {
      document.getElementById("hero")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Then trigger analysis
      setTimeout(() => {
        const heroInput = document
          .getElementById("hero")
          ?.querySelector('input[type="url"]') as HTMLInputElement;
        if (heroInput) {
          heroInput.value = url;
          heroInput.dispatchEvent(new Event("input", { bubbles: true }));
          const heroForm = document
            .getElementById("hero")
            ?.querySelector("form");
          if (heroForm) {
            heroForm.requestSubmit();
          }
        }
      }, 300);
    }, 100);
  };

  const hasResults = !isLoading && !!results;

  return (
    <main className="min-h-screen flex flex-col bg-zinc-900 text-zinc-100">
      <Hero onResults={handleResults} onAnalysisStart={handleAnalysisStart} />
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
          <CTA onAnalyze={handleCtaAnalyze} />
        </>
      )}
      <Footer />
    </main>
  );
}
