import { resolveA } from "@/lib/dns/dns-client";
import { CheckRunner } from "../types";

type IpApiResponse = {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  country_name?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  asn?: string;
  org?: string;
  isp?: string;
  error?: boolean;
  reason?: string;
};

export const runIpHostingCheck: CheckRunner<{
  ip?: string;
  ipv6?: string;
  asn?: string;
  isp?: string;
  org?: string;
  country?: string;
  city?: string;
}> = async ({ hostname, timeout }) => {
  const start = performance.now();

  try {
    // Resolve IP address
    const aResult = await resolveA(hostname);
    const ip = aResult.data?.[0];

    if (!ip) {
      return {
        id: "ip-hosting",
        label: "IP & Hosting Information",
        category: "network-dns",
        status: "error",
        summary: "Unable to resolve IP address.",
        durationMs: Math.round(performance.now() - start),
      };
    }

    // Fetch IP information from ipapi.co
    const apiKey = process.env.IPAPI_KEY;
    const apiUrl = apiKey
      ? `https://ipapi.co/${ip}/json/?key=${apiKey}`
      : `https://ipapi.co/${ip}/json/`;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": "InfraLens/1.0",
        },
      });

      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = (await response.json()) as IpApiResponse;

      if (data.error) {
        throw new Error(data.reason || "API error");
      }

      let status: "ok" | "warning" | "error" = "ok";
      let summary = "";

      if (data.asn && data.isp) {
        summary = `IP: ${ip}, ASN: ${data.asn}, ISP: ${data.isp}`;
        if (data.country_name) {
          summary += `, Location: ${data.country_name}`;
        }
      } else if (data.asn) {
        summary = `IP: ${ip}, ASN: ${data.asn}`;
      } else {
        summary = `IP: ${ip}`;
        status = "warning";
      }

      return {
        id: "ip-hosting",
        label: "IP & Hosting Information",
        category: "network-dns",
        status,
        summary,
        data: {
          ip,
          asn: data.asn,
          isp: data.isp,
          org: data.org,
          country: data.country_name || data.country,
          city: data.city,
        },
        durationMs: Math.round(performance.now() - start),
      };
    } catch {
      clearTimeout(id);
      // Fallback: return just IP if API fails
      return {
        id: "ip-hosting",
        label: "IP & Hosting Information",
        category: "network-dns",
        status: "warning",
        summary: `IP: ${ip} (hosting details unavailable)`,
        data: {
          ip,
        },
        durationMs: Math.round(performance.now() - start),
      };
    }
  } catch {
    return {
      id: "ip-hosting",
      label: "IP & Hosting Information",
      category: "network-dns",
      status: "error",
      summary: "Unable to retrieve IP and hosting information.",
      durationMs: Math.round(performance.now() - start),
    };
  }
};
