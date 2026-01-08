import { GlobalScore } from "@/lib/checks/types";
import { cn } from "@/lib/utils";

const SCORE_GRADES = [
  { min: 90, grade: "A", label: "Excellent", color: "text-emerald-400" },
  { min: 75, grade: "B", label: "Good", color: "text-lime-400" },
  { min: 60, grade: "C", label: "Average", color: "text-yellow-400" },
  { min: 40, grade: "D", label: "Poor", color: "text-orange-400" },
  { min: 0, grade: "E", label: "Critical", color: "text-red-400" },
] as const;

type ScoreBadgeProps = {
  score: GlobalScore;
};

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const gradeInfo =
    SCORE_GRADES.find((g) => score.score >= g.min) ??
    SCORE_GRADES[SCORE_GRADES.length - 1];

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-3xl font-bold",
          gradeInfo.color
        )}
      >
        {gradeInfo.grade}
      </div>
      <span className="text-sm text-zinc-400">
        {score.score}/100 · {gradeInfo.label}
      </span>
    </div>
  );
}
