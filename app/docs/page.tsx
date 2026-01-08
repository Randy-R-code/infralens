import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Documentation — InfraLens",
  description: "Learn how InfraLens checks work and what each result means",
};

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 py-8 md:py-12 lg:py-16">
        <div className="space-y-8 md:space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Documentation
              </h1>
              <p className="text-zinc-400">
                Comprehensive documentation for all InfraLens checks. Each check
                is executed server-side using Next.js server actions, designed
                to be fast, non-intrusive, read-only, and safe for production
                websites. All checks run in parallel for optimal performance.
              </p>
            </div>
          </div>

          {/* Overview */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Overview</CardTitle>
              <CardDescription className="text-zinc-400">
                InfraLens performs 16 independent checks across 6 categories to
                analyze the technical exposure and configuration of a website.
                Each check is modular, type-safe, and focuses on a specific
                aspect of infrastructure, security, or configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Check Status
                </h3>
                <div className="space-y-2 text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-700 text-emerald-400"
                    >
                      OK
                    </Badge>
                    <span>Check passed successfully</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-yellow-700 text-yellow-400"
                    >
                      Warning
                    </Badge>
                    <span>Check found issues that should be addressed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-red-700 text-red-400"
                    >
                      Error
                    </Badge>
                    <span>Check failed or found critical issues</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network & DNS */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Network & DNS</CardTitle>
              <CardDescription className="text-zinc-400">
                DNS records, security, and hosting information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  DNS Records
                </h3>
                <p className="text-sm text-zinc-400 mb-3">
                  InfraLens uses Node.js native DNS resolution to retrieve and
                  analyze common DNS records. Results are cached in-memory to
                  optimize performance. This provides visibility into hosting
                  setup, email configuration, and domain delegation.
                </p>
                <div className="space-y-2 text-sm text-zinc-400">
                  <p>
                    <strong>A / AAAA:</strong> Map domain names to IPv4/IPv6
                    addresses
                  </p>
                  <p>
                    <strong>CNAME:</strong> Canonical name records for aliases
                  </p>
                  <p>
                    <strong>MX:</strong> Mail Exchange records for email routing
                  </p>
                  <p>
                    <strong>TXT:</strong> Text records for various purposes
                  </p>
                  <p>
                    <strong>NS:</strong> Name Server records for domain
                    delegation
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  DNS Security
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  This check focuses on email and domain security signals:
                </p>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>
                    <strong>SPF:</strong> Sender Policy Framework for email
                    authentication
                  </li>
                  <li>
                    <strong>DKIM:</strong> DomainKeys Identified Mail signatures
                  </li>
                  <li>
                    <strong>DMARC:</strong> Domain-based Message Authentication
                  </li>
                  <li>
                    <strong>DNSSEC:</strong> DNS Security Extensions
                  </li>
                </ul>
                <p className="text-sm text-zinc-400 mt-2">
                  Missing or misconfigured records may expose the domain to
                  spoofing or delivery issues.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  IP & Hosting Information
                </h3>
                <p className="text-sm text-zinc-400">
                  InfraLens uses the ipapi.co API (optional) to identify public
                  IP address, Autonomous System Number (ASN), hosting provider,
                  geographic location, and IPv6 availability. This provides a
                  high-level view of where and how the site is hosted. The API
                  key is optional—the service works without it but with rate
                  limits.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* HTTP & Security */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">HTTP & Security</CardTitle>
              <CardDescription className="text-zinc-400">
                Security headers and HTTPS/TLS configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Security Headers
                </h3>
                <p className="text-sm text-zinc-400 mb-3">
                  InfraLens checks for the presence of five recommended HTTP
                  security headers using a HEAD request. These headers help
                  protect against common vulnerabilities such as XSS,
                  clickjacking, and MIME-type sniffing. Missing headers trigger
                  actionable recommendations.
                </p>
                <div className="space-y-2 text-sm text-zinc-400">
                  <p>
                    <Badge variant="outline" className="mr-2 border-zinc-700">
                      Content-Security-Policy
                    </Badge>
                    Prevents XSS attacks by controlling which resources can be
                    loaded
                  </p>
                  <p>
                    <Badge variant="outline" className="mr-2 border-zinc-700">
                      X-Frame-Options
                    </Badge>
                    Prevents clickjacking by controlling iframe embedding
                  </p>
                  <p>
                    <Badge variant="outline" className="mr-2 border-zinc-700">
                      Strict-Transport-Security (HSTS)
                    </Badge>
                    Forces HTTPS connections and prevents downgrade attacks
                  </p>
                  <p>
                    <Badge variant="outline" className="mr-2 border-zinc-700">
                      X-Content-Type-Options
                    </Badge>
                    Prevents MIME type sniffing attacks
                  </p>
                  <p>
                    <Badge variant="outline" className="mr-2 border-zinc-700">
                      Referrer-Policy
                    </Badge>
                    Controls how much referrer information is sent with requests
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  HTTPS & TLS
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  This check verifies whether HTTPS is properly enforced and
                  inspects TLS configuration:
                </p>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>HTTPS availability</li>
                  <li>HTTP to HTTPS redirection</li>
                  <li>
                    TLS protocol version (TLS 1.2 minimum, TLS 1.3 preferred)
                  </li>
                  <li>Certificate issuer</li>
                  <li>Certificate expiration status</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Redirect Behavior
                </h3>
                <p className="text-sm text-zinc-400">
                  InfraLens follows redirect chains (up to 10 redirects) to
                  detect misconfigurations, including excessive redirects and
                  potential redirect loops. The check identifies the final
                  destination URL and analyzes redirect behavior. Clean redirect
                  chains improve security, performance, and SEO.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Infrastructure */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Infrastructure</CardTitle>
              <CardDescription className="text-zinc-400">
                Firewall detection and network analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Firewall / WAF Detection
                </h3>
                <p className="text-sm text-zinc-400">
                  This check analyzes HTTP headers to detect common Web
                  Application Firewalls (WAF) or CDN protections. Detection is
                  based on characteristic headers and server responses. Examples
                  include Cloudflare, Fastly, Akamai, AWS CloudFront, and
                  Sucuri.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Website Structure */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Website Structure</CardTitle>
              <CardDescription className="text-zinc-400">
                robots.txt, sitemaps, and link analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">robots.txt</h3>
                <p className="text-sm text-zinc-400">
                  InfraLens checks for the presence of robots.txt, HTTP status,
                  and basic syntax validity. robots.txt controls crawler access
                  and indexing behavior.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">Sitemap</h3>
                <p className="text-sm text-zinc-400">
                  This check verifies whether a sitemap is available and
                  accessible. Signals include sitemap presence, format (XML /
                  index), and basic URL count.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Linked Pages
                </h3>
                <p className="text-sm text-zinc-400">
                  InfraLens parses the HTML content using Cheerio to extract
                  links and categorizes them as internal or external. The check
                  validates external links by performing HEAD requests to detect
                  unreachable or broken links. This provides insights into site
                  structure and link health.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Metadata & Stack */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">
                Metadata & Technology Stack
              </CardTitle>
              <CardDescription className="text-zinc-400">
                HTML metadata, social tags, and technology detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  HTML Metadata
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  Checks for title, meta description, charset, and viewport.
                  Missing metadata affects accessibility and SEO.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Social Tags
                </h3>
                <p className="text-sm text-zinc-400">
                  InfraLens inspects Open Graph tags, Twitter Card metadata, and
                  social preview images.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Stack Detection
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  InfraLens analyzes HTTP headers, HTML content, and JavaScript
                  patterns to detect frontend frameworks (React, Vue, Angular),
                  CMS platforms (WordPress, Drupal), analytics tools (Google
                  Analytics, Plausible), and CDN providers. Detection is
                  heuristic-based and may not always be exhaustive.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Server Headers
                </h3>
                <p className="text-sm text-zinc-400">
                  This check analyzes server headers to identify server
                  software, X-Powered-By exposure, and potential information
                  leakage.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Signals */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Performance Signals</CardTitle>
              <CardDescription className="text-zinc-400">
                Lightweight performance metrics and reachability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Response Metrics
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  InfraLens collects lightweight performance signals using a
                  single HTTP request:
                </p>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>Approximate response time (measured client-side)</li>
                  <li>Response size (Content-Length header or body size)</li>
                  <li>
                    Compression support (Content-Encoding: gzip, br, etc.)
                  </li>
                </ul>
                <p className="text-sm text-zinc-400 mt-2">
                  These are indicative metrics from a single request, not
                  comprehensive performance audits. Results may vary based on
                  network conditions and server load.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Uptime Snapshot
                </h3>
                <p className="text-sm text-zinc-400">
                  InfraLens performs a HEAD request to verify reachability, HTTP
                  status code, and timeout handling. This represents a single
                  point-in-time snapshot of the website&apos;s availability, not
                  historical uptime tracking or monitoring.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Scoring */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Scoring System</CardTitle>
              <CardDescription className="text-zinc-400">
                How InfraLens calculates scores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Category Weights
                </h3>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>HTTP & Security: 25 points</li>
                  <li>Network & DNS: 20 points</li>
                  <li>Infrastructure: 20 points</li>
                  <li>Website Structure: 15 points</li>
                  <li>Metadata & Stack: 10 points</li>
                  <li>Performance Signals: 10 points</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Status Points
                </h3>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>OK: 100% of category weight</li>
                  <li>Warning: 60% of category weight</li>
                  <li>Error: 0% of category weight</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Final Grade
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  Grades (A–E) are visual aids only, not security
                  certifications:
                </p>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>90–100: A (Excellent)</li>
                  <li>75–89: B (Good)</li>
                  <li>60–74: C (Average)</li>
                  <li>40–59: D (Poor)</li>
                  <li>&lt; 40: E (Critical)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">Notes & Limitations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-zinc-400 space-y-2 list-disc list-inside">
                <li>
                  <strong>Read-only:</strong> InfraLens performs passive
                  analysis only—no exploitation, intrusive scanning, or
                  modification of target systems.
                </li>
                <li>
                  <strong>Heuristic detection:</strong> Technology stack
                  detection is based on patterns and may not always be
                  exhaustive or accurate.
                </li>
                <li>
                  <strong>Network-dependent:</strong> Results may vary based on
                  network conditions, DNS resolver location, and server load.
                </li>
                <li>
                  <strong>Single snapshot:</strong> Uptime and performance
                  checks represent a single point in time, not historical
                  monitoring.
                </li>
                <li>
                  <strong>Indicators, not guarantees:</strong> Results should be
                  interpreted as indicators to guide further investigation, not
                  as definitive security assessments.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
