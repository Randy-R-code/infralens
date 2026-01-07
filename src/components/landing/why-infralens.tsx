import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const points = [
  "No account required",
  "No tracking",
  "Fast, server-side checks",
  "Built for developers",
];

export function WhyInfraLens() {
  return (
    <section className="py-8 md:py-12 lg:py-16 px-6 sm:px-8 md:px-12 bg-zinc-900/50">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Why InfraLens
          </h2>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-6 md:p-8">
            <ul className="space-y-3 md:space-y-4">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <Check className="size-4 text-blue-400" />
                  </div>
                  <span className="text-zinc-300">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
