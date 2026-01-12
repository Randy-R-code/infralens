"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChecksResponse } from "@/lib/checks/types";
import { Search } from "lucide-react";
import { useState, useTransition } from "react";
import { runInfraChecks } from "../../../app/actions/run-checks";

type HeroProps = {
  onResults?: (results: ChecksResponse) => void;
  onAnalysisStart?: () => void;
  isLoading?: boolean;
};

export function Hero({
  onResults,
  onAnalysisStart,
  isLoading: externalIsLoading,
}: HeroProps) {
  const [url, setUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  // Use external loading state if provided, otherwise use internal
  const isLoading = externalIsLoading ?? isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    onAnalysisStart?.();

    startTransition(async () => {
      const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
      let urlObj: URL;

      try {
        urlObj = new URL(normalizedUrl);
        const results = await runInfraChecks(urlObj.toString());
        onResults?.(results);

        // Scroll to results after a short delay
        setTimeout(() => {
          document.getElementById("results")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } catch (error) {
        console.error("Error running checks:", error);

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
          urlObj = new URL(normalizedUrl);
          hostname = urlObj.hostname;
        } catch {
          // Keep "unknown" if URL is invalid
        }

        onResults?.({
          url: normalizedUrl,
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
    });
  };

  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6 sm:px-8 md:px-12 py-8 md:py-12 lg:py-16"
    >
      <div className="w-full max-w-4xl space-y-6 md:space-y-8">
        {/* Branding */}
        <div className="text-center space-y-3 md:space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            infralens.dev
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 font-medium">
            Website inspection tool
          </p>
          <p className="text-xs sm:text-sm text-zinc-500">
            Built for developers · Open source
          </p>
        </div>

        {/* Search Form */}
        <Card className="border-2 border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4 sm:p-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col xs:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                <Input
                  id="url-input"
                  name="url"
                  placeholder="https://example.com"
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 h-12 text-base bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-blue-500 focus:ring-blue-500/30"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="h-12 xs:px-8 w-full xs:w-auto bg-blue-500 hover:bg-blue-500/90 text-white disabled:opacity-50"
              >
                {isLoading ? "Analyzing..." : "Analyze"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick info */}
        <p className="text-center text-sm text-zinc-500">
          Inspect DNS records, HTTP headers, TLS settings, and more
        </p>
      </div>
    </section>
  );
}
