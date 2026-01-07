import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckResult } from "@/lib/checks/types";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const statusConfig = {
  ok: {
    icon: CheckCircle2,
    label: "OK",
    className: "text-emerald-500 border-emerald-500/20 bg-emerald-500/10",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    className: "text-amber-500 border-amber-500/20 bg-amber-500/10",
  },
  error: {
    icon: XCircle,
    label: "Error",
    className: "text-red-500 border-red-500/20 bg-red-500/10",
  },
};

type HeadersData = {
  present: string[];
  missing: string[];
};

function isHeadersData(data: unknown): data is HeadersData {
  return (
    typeof data === "object" &&
    data !== null &&
    "present" in data &&
    "missing" in data &&
    Array.isArray((data as HeadersData).present) &&
    Array.isArray((data as HeadersData).missing)
  );
}

export function CheckResultCard({ result }: { result: CheckResult }) {
  const config = statusConfig[result.status];
  const Icon = config.icon;
  const headersData =
    result.data && isHeadersData(result.data) ? result.data : null;

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{result.label}</CardTitle>
          <Badge variant="outline" className={cn("border", config.className)}>
            <Icon className="size-3 mr-1.5" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {result.summary && (
          <p className="text-sm text-zinc-400 mb-3">{result.summary}</p>
        )}
        {headersData && (
          <div className="space-y-2">
            {headersData.present.length > 0 && (
              <div className="text-sm">
                <span className="text-zinc-500">Present headers:</span>{" "}
                <span className="text-zinc-300">
                  {headersData.present.length}
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {headersData.present.map((header: string) => (
                    <span
                      key={header}
                      className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono"
                    >
                      {header}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {headersData.missing.length > 0 && (
              <div className="text-sm">
                <span className="text-zinc-500">Missing headers:</span>{" "}
                <span className="text-zinc-300">
                  {headersData.missing.length}
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {headersData.missing.map((header: string) => (
                    <span
                      key={header}
                      className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-mono"
                    >
                      {header}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.durationMs && (
              <div className="text-xs text-zinc-500 pt-2">
                Completed in {result.durationMs}ms
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
