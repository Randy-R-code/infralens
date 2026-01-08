import { Recommendation } from "@/lib/checks/types";

export function securityHeadersRecommendation(
  missing: string[]
): Recommendation {
  return {
    id: "missing-security-headers",
    title: "Missing security headers",
    description:
      "Some important HTTP security headers are not present in the response.",
    impact:
      "Missing headers may expose users to attacks like XSS, clickjacking, or data injection.",
    howTo: missing.map(
      (h) => `Add the "${h}" header with an appropriate value on the server.`
    ),
    severity: missing.includes("Content-Security-Policy")
      ? "critical"
      : "warning",
    references: [
      {
        label: "OWASP Secure Headers Project",
        url: "https://owasp.org/www-project-secure-headers/",
      },
    ],
  };
}

export function httpsRecommendation(): Recommendation {
  return {
    id: "https-not-enforced",
    title: "HTTPS is not enforced",
    description:
      "The website does not consistently redirect HTTP traffic to HTTPS.",
    impact: "Unencrypted traffic can be intercepted or modified by attackers.",
    howTo: [
      "Enable HTTPS on the server.",
      "Redirect all HTTP requests to HTTPS.",
      "Enable HSTS once HTTPS is stable.",
    ],
    severity: "critical",
    references: [
      {
        label: "MDN – HTTPS",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
      },
    ],
  };
}

export function hstsRecommendation(): Recommendation {
  return {
    id: "missing-hsts",
    title: "HSTS is not enabled",
    description: "The Strict-Transport-Security header is not present.",
    impact: "Users may be vulnerable to downgrade attacks or SSL stripping.",
    howTo: [
      "Add the Strict-Transport-Security header.",
      "Start with a low max-age value (e.g., 300 seconds).",
      "Increase max-age once validated.",
    ],
    severity: "warning",
    references: [
      {
        label: "MDN – Strict-Transport-Security",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security",
      },
    ],
  };
}

export function redirectLoopRecommendation(): Recommendation {
  return {
    id: "redirect-loop",
    title: "Redirect loop detected",
    description: "The website has a redirect loop that prevents access.",
    impact:
      "Users cannot access the website, and search engines may de-index the site.",
    howTo: [
      "Review the redirect chain configuration.",
      "Remove circular redirects.",
      "Ensure each redirect has a clear final destination.",
    ],
    severity: "critical",
  };
}

export function excessiveRedirectsRecommendation(
  count: number
): Recommendation {
  return {
    id: "excessive-redirects",
    title: "Excessive redirects detected",
    description: `The website has ${count} redirects in the chain.`,
    impact:
      "Multiple redirects slow down page load times and degrade user experience and SEO.",
    howTo: [
      "Simplify the redirect chain.",
      "Use direct redirects to the final destination.",
      "Consider using a single redirect when possible.",
    ],
    severity: "warning",
  };
}

export function dnsSecurityRecommendation(missing: string[]): Recommendation {
  return {
    id: "missing-dns-security",
    title: "Missing DNS security records",
    description: `The following DNS security records are missing: ${missing.join(
      ", "
    )}.`,
    impact:
      "Missing DNS security records may expose the domain to email spoofing and delivery issues.",
    howTo: [
      missing.includes("SPF") &&
        'Add an SPF record (TXT record starting with "v=spf1") to your DNS.',
      missing.includes("DMARC") &&
        'Add a DMARC record (TXT record at "_dmarc.yourdomain.com" starting with "v=DMARC1").',
      missing.includes("DKIM") &&
        "Configure DKIM with your email provider and add the public key as a TXT record.",
    ].filter(Boolean) as string[],
    severity: missing.includes("DMARC") ? "critical" : "warning",
    references: [
      {
        label: "DMARC Guide",
        url: "https://dmarc.org/wiki/FAQ",
      },
    ],
  };
}
