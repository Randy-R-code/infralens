"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function WhyScoreDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-zinc-400 underline-offset-4 hover:underline hover:text-zinc-300"
        >
          Why this score?
        </Button>
      </DialogTrigger>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle>How the Score is Calculated</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Understanding InfraLens scoring system
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm text-zinc-300">
          <p>
            The score is calculated based on a weighted set of infrastructure
            checks.
          </p>
          <p>
            Each check belongs to a category (Security, Performance, Headers,
            Network…). Each category contributes differently to the final score.
          </p>
          <div className="space-y-2">
            <p className="font-semibold text-zinc-200">Category Weights:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>HTTP & Security: 25 points</li>
              <li>Network & DNS: 20 points</li>
              <li>Infrastructure: 20 points</li>
              <li>Website Structure: 15 points</li>
              <li>Metadata & Stack: 10 points</li>
              <li>Performance: 10 points</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-zinc-200">Status Points:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>OK: 100% of category weight</li>
              <li>Warning: 60% of category weight</li>
              <li>Error: 0% of category weight</li>
            </ul>
          </div>
          <p className="pt-2 text-zinc-400">
            The final score represents an overall infrastructure health
            indicator, not a security certification.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
