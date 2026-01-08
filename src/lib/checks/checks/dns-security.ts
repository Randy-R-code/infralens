import { resolveTXT } from "@/lib/dns/dns-client";
import { dnsSecurityRecommendation } from "@/lib/recommendations/security";
import { CheckRunner } from "../types";

export const runDnsSecurityCheck: CheckRunner<{
  spf: boolean;
  dmarc: boolean;
  dkim: boolean;
  spfRecord?: string;
  dmarcRecord?: string;
  dkimRecord?: string;
}> = async ({ hostname }) => {
  const start = performance.now();

  try {
    // Resolve SPF (TXT record at root domain)
    const txtResult = await resolveTXT(hostname);
    const txtRecords = txtResult.data || [];

    // Check for SPF
    const spfRecord = txtRecords.find((record) =>
      record.toLowerCase().startsWith("v=spf1")
    );
    const spf = !!spfRecord;

    // Check for DMARC (_dmarc subdomain)
    const dmarcHost = `_dmarc.${hostname}`;
    const dmarcResult = await resolveTXT(dmarcHost);
    const dmarcRecords = dmarcResult.data || [];
    const dmarcRecord = dmarcRecords.find((record) =>
      record.toLowerCase().startsWith("v=dmarc1")
    );
    const dmarc = !!dmarcRecord;

    // Check for DKIM (common selectors)
    const dkimSelectors = ["default", "google", "selector1", "selector2"];
    let dkim = false;
    let dkimRecord: string | undefined;

    for (const selector of dkimSelectors) {
      const dkimHost = `${selector}._domainkey.${hostname}`;
      const dkimResult = await resolveTXT(dkimHost);
      const dkimRecords = dkimResult.data || [];
      const found = dkimRecords.find((record) =>
        record.toLowerCase().includes("v=dkim1")
      );
      if (found) {
        dkim = true;
        dkimRecord = found;
        break;
      }
    }

    // DNSSEC check (simplified - check for RRSIG in response)
    // Note: Full DNSSEC validation requires more complex logic

    let status: "ok" | "warning" | "error" = "ok";
    const missing: string[] = [];

    if (!spf) missing.push("SPF");
    if (!dmarc) missing.push("DMARC");
    if (!dkim) missing.push("DKIM");

    let summary = "";
    if (missing.length === 0) {
      status = "ok";
      summary = "All DNS security records are present (SPF, DMARC, DKIM).";
    } else if (missing.length === 1) {
      status = "warning";
      summary = `Missing DNS security record: ${missing[0]}.`;
    } else {
      status = "warning";
      summary = `Missing DNS security records: ${missing.join(", ")}.`;
    }

    return {
      id: "dns-security",
      label: "DNS Security",
      category: "network-dns",
      status,
      summary,
      recommendation:
        missing.length > 0 ? dnsSecurityRecommendation(missing) : undefined,
      data: {
        spf,
        dmarc,
        dkim,
        spfRecord,
        dmarcRecord,
        dkimRecord,
      },
      durationMs: Math.round(performance.now() - start),
    };
  } catch {
    return {
      id: "dns-security",
      label: "DNS Security",
      category: "network-dns",
      status: "error",
      summary: "Unable to check DNS security records.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
