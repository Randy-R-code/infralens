export type DnsRecordType = "A" | "AAAA" | "MX" | "NS" | "TXT" | "CNAME";

export type DnsQueryResult<T = unknown> = {
  type: DnsRecordType;
  success: boolean;
  data?: T;
  error?: string;
  durationMs: number;
};
