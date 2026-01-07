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
                This page explains how InfraLens checks work and what each
                result means.
              </p>
            </div>
          </div>

          {/* DNS Records */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">DNS Records</CardTitle>
              <CardDescription className="text-zinc-400">
                Domain Name System records that map domain names to IP addresses
                and other resources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  A / AAAA records
                </h3>
                <p className="text-sm text-zinc-400">
                  A records map domain names to IPv4 addresses, while AAAA
                  records map to IPv6 addresses. These are the most fundamental
                  DNS records, telling browsers where to find your website.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">MX records</h3>
                <p className="text-sm text-zinc-400">
                  Mail Exchange records specify which mail servers are
                  responsible for accepting email messages for your domain.
                  Multiple MX records can be configured with priority values.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  TXT records
                </h3>
                <p className="text-sm text-zinc-400">
                  Text records can contain arbitrary text data. Commonly used
                  for SPF (email authentication), DKIM keys, domain
                  verification, and other purposes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Common misconfigurations
                </h3>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>Missing or incorrect A/AAAA records</li>
                  <li>Circular CNAME records</li>
                  <li>Invalid MX record priorities</li>
                  <li>Missing SPF records for email domains</li>
                  <li>DNS propagation delays</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* HTTP Headers */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">HTTP Headers</CardTitle>
              <CardDescription className="text-zinc-400">
                HTTP response headers that control security, caching, and
                browser behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Security headers
                </h3>
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
                      Strict-Transport-Security
                    </Badge>
                    Forces HTTPS connections for enhanced security
                  </p>
                  <p>
                    <Badge variant="outline" className="mr-2 border-zinc-700">
                      X-Content-Type-Options
                    </Badge>
                    Prevents MIME type sniffing attacks
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Cache headers
                </h3>
                <p className="text-sm text-zinc-400">
                  Headers like{" "}
                  <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    Cache-Control
                  </code>
                  ,
                  <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 mx-1">
                    ETag
                  </code>
                  , and
                  <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 mx-1">
                    Last-Modified
                  </code>{" "}
                  control how browsers and CDNs cache your content. Proper cache
                  headers improve performance and reduce server load.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">Redirects</h3>
                <p className="text-sm text-zinc-400">
                  HTTP status codes 301 (permanent) and 302 (temporary) indicate
                  redirects. Proper redirect chains are important for SEO and
                  user experience. We check for redirect loops and ensure HTTPS
                  redirects are properly configured.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* TLS & SSL */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">TLS & SSL</CardTitle>
              <CardDescription className="text-zinc-400">
                Transport Layer Security and SSL certificate information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Supported TLS versions
                </h3>
                <p className="text-sm text-zinc-400 mb-2">
                  We check which TLS protocol versions your server supports.
                  Modern best practices recommend:
                </p>
                <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
                  <li>TLS 1.2 (minimum recommended)</li>
                  <li>TLS 1.3 (preferred for modern security)</li>
                  <li>Disabling TLS 1.0 and 1.1 (deprecated and insecure)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Certificate issuer
                </h3>
                <p className="text-sm text-zinc-400">
                  The Certificate Authority (CA) that issued your SSL
                  certificate. Common issuers include Let&apos;s Encrypt,
                  DigiCert, Cloudflare, and others. We verify the certificate
                  chain is valid.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-200 mb-2">
                  Expiration date
                </h3>
                <p className="text-sm text-zinc-400">
                  SSL certificates have expiration dates. We check when your
                  certificate expires and warn you if it&apos;s expiring soon
                  (typically within 30 days). Expired certificates cause
                  security warnings in browsers and can break your site.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
