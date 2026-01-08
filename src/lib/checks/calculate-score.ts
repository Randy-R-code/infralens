import { CATEGORY_WEIGHTS, STATUS_MULTIPLIER } from "./scoring-config";
import {
  CategoryScore,
  CheckCategory,
  CheckResult,
  GlobalScore,
} from "./types";

// --------------------
// Category score
// --------------------

function calculateCategoryScore(
  category: CheckCategory,
  checks: CheckResult[]
): CategoryScore {
  const categoryChecks = checks.filter((check) => check.category === category);

  if (categoryChecks.length === 0) {
    return {
      category,
      score: 0,
      maxScore: CATEGORY_WEIGHTS[category],
    };
  }

  const total = categoryChecks.reduce((acc, check) => {
    return acc + STATUS_MULTIPLIER[check.status];
  }, 0);

  const average = total / categoryChecks.length;

  const weightedScore = Math.round(average * CATEGORY_WEIGHTS[category]);

  return {
    category,
    score: weightedScore,
    maxScore: CATEGORY_WEIGHTS[category],
  };
}

// --------------------
// Global score
// --------------------

export function calculateGlobalScore(checks: CheckResult[]): GlobalScore {
  const categories = Object.keys(CATEGORY_WEIGHTS) as CheckCategory[];

  const categoryScores = categories.map((category) =>
    calculateCategoryScore(category, checks)
  );

  const totalScore = categoryScores.reduce((acc, c) => acc + c.score, 0);

  return {
    score: totalScore,
    grade: scoreToGrade(totalScore),
    categories: categoryScores,
  };
}

// --------------------
// Grade mapping
// --------------------

function scoreToGrade(score: number): GlobalScore["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "E";
}
