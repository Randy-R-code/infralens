import {
  resolveA,
  resolveAAAA,
  resolveCNAME,
  resolveMX,
  resolveNS,
  resolveTXT,
} from "@/lib/dns/dns-client";
import { CheckRunner } from "../types";

export const runDnsRecordsCheck: CheckRunner<{
  a: string[];
  aaaa: string[];
  mx: Array<{ exchange: string; priority: number }>;
  ns: string[];
  txt: string[];
  cname: string[];
}> = async ({ hostname }) => {
  const start = performance.now();

  try {
    const results = await Promise.allSettled([
      resolveA(hostname),
      resolveAAAA(hostname),
      resolveMX(hostname),
      resolveNS(hostname),
      resolveTXT(hostname),
      resolveCNAME(hostname),
    ]);

    const a: string[] = [];
    const aaaa: string[] = [];
    const mx: Array<{ exchange: string; priority: number }> = [];
    const ns: string[] = [];
    const txt: string[] = [];
    const cname: string[] = [];

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        const data = result.value;
        if (data.success && data.data) {
          switch (data.type) {
            case "A":
              a.push(...(data.data as string[]));
              break;
            case "AAAA":
              aaaa.push(...(data.data as string[]));
              break;
            case "MX":
              mx.push(
                ...(data.data as Array<{ exchange: string; priority: number }>)
              );
              break;
            case "NS":
              ns.push(...(data.data as string[]));
              break;
            case "TXT":
              txt.push(...(data.data as string[]));
              break;
            case "CNAME":
              cname.push(...(data.data as string[]));
              break;
          }
        }
      }
    });

    const hasRecords =
      a.length > 0 || aaaa.length > 0 || mx.length > 0 || ns.length > 0;

    let status: "ok" | "warning" | "error" = "ok";
    let summary = "";

    if (!hasRecords) {
      status = "error";
      summary = "No DNS records found.";
    } else {
      const recordCounts: string[] = [];
      if (a.length > 0) recordCounts.push(`${a.length} A`);
      if (aaaa.length > 0) recordCounts.push(`${aaaa.length} AAAA`);
      if (mx.length > 0) recordCounts.push(`${mx.length} MX`);
      if (ns.length > 0) recordCounts.push(`${ns.length} NS`);
      if (txt.length > 0) recordCounts.push(`${txt.length} TXT`);
      if (cname.length > 0) recordCounts.push(`${cname.length} CNAME`);

      summary = `Found: ${recordCounts.join(", ")}.`;
    }

    return {
      id: "dns-records",
      label: "DNS Records",
      category: "network-dns",
      status,
      summary,
      data: {
        a,
        aaaa,
        mx,
        ns,
        txt,
        cname,
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    return {
      id: "dns-records",
      label: "DNS Records",
      category: "network-dns",
      status: "error",
      summary: "Unable to resolve DNS records.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
