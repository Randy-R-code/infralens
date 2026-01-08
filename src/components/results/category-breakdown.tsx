import { CategoryScore, CheckCategory } from "@/lib/checks/types";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<CheckCategory, string> = {
  "http-security": "HTTP & Security",
  "network-dns": "Network & DNS",
  infrastructure: "Infrastructure",
  "website-structure": "Website Structure",
  "metadata-stack": "Metadata & Stack",
  performance: "Performance",
};

type CategoryBreakdownProps = {
  categories: CategoryScore[];
};

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  return (
    <div className="space-y-3">
      {categories.map((category) => {
        const percentage =
          category.maxScore > 0
            ? Math.round((category.score / category.maxScore) * 100)
            : 0;

        return (
          <div key={category.category} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-300">
                {CATEGORY_LABELS[category.category]}
              </span>
              <span className="text-zinc-400">
                {category.score}/{category.maxScore}
              </span>
            </div>
            <div className="h-2 rounded bg-white/10">
              <div
                className={cn(
                  "h-2 rounded transition-all",
                  percentage >= 80
                    ? "bg-emerald-500"
                    : percentage >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
