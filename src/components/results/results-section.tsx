import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckResult } from "@/lib/checks/types";
import { RefreshCw } from "lucide-react";
import { CheckResultCard } from "./check-result-card";

export function ResultsSection({
  results,
  isLoading,
  onNewAnalysis,
}: {
  results?: CheckResult[];
  isLoading: boolean;
  onNewAnalysis?: () => void;
}) {
  if (!isLoading && !results) {
    return null;
  }

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
            <Button
              variant="outline"
              size="sm"
              onClick={onNewAnalysis}
              className="border-zinc-800 text-zinc-400 hover:text-zinc-300"
            >
              <RefreshCw className="size-4 mr-2" />
              New Analysis
            </Button>
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
            <div className="space-y-4">
              {results.map((result) => (
                <CheckResultCard key={result.id} result={result} />
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}
