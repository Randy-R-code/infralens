import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { buildExport, downloadJson } from "@/lib/checks/export";
import { ChecksResponse } from "@/lib/checks/types";
import { Download, RefreshCw } from "lucide-react";
import { CategoryBreakdown } from "./category-breakdown";
import { CheckResultCard } from "./check-result-card";
import { RecommendationCard } from "./recommendation-card";
import { ScoreBadge } from "./score-badge";
import { WhyScoreDialog } from "./why-score-dialog";

export function ResultsSection({
  results,
  isLoading,
  onNewAnalysis,
}: {
  results?: ChecksResponse;
  isLoading: boolean;
  onNewAnalysis?: () => void;
}) {
  if (!isLoading && !results) {
    return null;
  }

  const handleExport = () => {
    if (!results) return;
    const exportData = buildExport(results);
    const filename = `infralens-${results.hostname}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    downloadJson(exportData, filename);
  };

  return (
    <section
      id="results"
      className="py-8 md:py-12 lg:py-16 px-6 sm:px-8 md:px-12 scroll-mt-8"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Results
          </h2>
          {!isLoading && results && onNewAnalysis && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="border-zinc-800 text-zinc-400 hover:text-zinc-300"
              >
                <Download className="size-4 mr-2" />
                Export JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onNewAnalysis}
                className="border-zinc-800 text-zinc-400 hover:text-zinc-300"
              >
                <RefreshCw className="size-4 mr-2" />
                New Analysis
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1].map((i) => (
              <Card key={i} className="border-zinc-800 bg-zinc-900/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <div className="space-y-2 pt-2">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="h-3.5 w-48" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          results && (
            <div className="space-y-6">
              {/* Score Section */}
              <Card className="border-zinc-800 bg-zinc-900/50">
                <CardHeader>
                  <CardTitle>Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <ScoreBadge score={results.score} />
                    <div className="flex-1 space-y-4">
                      <div>
                        <WhyScoreDialog />
                      </div>
                      <Separator className="bg-zinc-800" />
                      <CategoryBreakdown
                        categories={results.score.categories}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations Section */}
              {results.checks.some((check) => check.recommendation) && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Recommendations</h3>
                  {results.checks
                    .filter((check) => check.recommendation)
                    .map((check) => (
                      <RecommendationCard
                        key={`rec-${check.id}`}
                        recommendation={check.recommendation!}
                      />
                    ))}
                </div>
              )}

              {/* Checks Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Checks</h3>
                {results.checks.map((result) => (
                  <CheckResultCard key={result.id} result={result} />
                ))}
              </div>

              {/* Summary */}
              <div className="text-xs text-zinc-500 text-center">
                Analysis completed in {results.totalDurationMs}ms
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
