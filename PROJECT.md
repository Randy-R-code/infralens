# InfraLens — Project Reference

**InfraLens** is a lightweight, open-source website inspection tool that performs server-side infrastructure analysis across 18 independent checks. Built with Next.js 16 and TypeScript, it gives developers a fast, practical view of how any website is configured, secured, and delivered.

> Live at [infralens.dev](https://infralens.dev) · MIT License

---

## Tech Stack

| Layer           | Technology                                         |
| --------------- | -------------------------------------------------- |
| Framework       | Next.js 16 (App Router, React Server Components)   |
| Language        | TypeScript 5 (strict)                              |
| UI              | React 19, Tailwind CSS 4, shadcn/ui (Radix UI)     |
| Icons           | Lucide React                                       |
| Fonts           | Geist (local, SemiBold / Bold / Black)             |
| DNS             | Native Node.js `dns/promises` with in-memory cache |
| HTML parsing    | Regex-based (no external parser)                   |
| IP/ASN          | ipapi.co (optional, via `IPAPI_KEY`)               |
| Rate limiting   | In-memory (1 req / IP / 30 s)                      |
| PWA             | Service Worker + Web App Manifest                  |
| Package manager | pnpm                                               |

---

## Architecture

```
app/
  layout.tsx              # Root layout, fonts, metadata, PWA
  page.tsx                # Home (client component — state hub)
  docs/page.tsx           # Documentation page
  actions/run-checks.ts   # Server action: rate limit + run checks
  opengraph-image.tsx     # Dynamic OG image (next/og)
  not-found.tsx           # 404 page

src/
  components/
    landing/              # Hero, CTA, WhatItChecks, HowResults, WhyInfraLens, Footer
    results/              # ResultsSection, CheckResultCard, ScoreBadge,
    │                     # CategoryBreakdown, WhyScoreDialog, RecommendationCard
    history/              # HistorySection
    pwa/                  # RegisterServiceWorker
    ui/                   # shadcn/ui primitives (Badge, Button, Card, Dialog…)
  hooks/
    use-analysis-history.ts  # useSyncExternalStore-based localStorage history
  lib/
    checks/
      checks/             # 18 individual check implementations
      types.ts            # CheckResult, CheckRunner, ChecksResponse, Score
      index.ts            # runChecks() — parallel Promise.all orchestrator
      run-checks.ts       # CHECKS registry
      calculate-score.ts  # Weighted scoring → letter grade
      scoring-config.ts   # Category weights & status multipliers
      export.ts           # JSON export helper
    dns/
      dns-client.ts       # dns/promises wrapper with timeout
      dns-cache.ts        # TTL-based in-memory cache
      dns-types.ts        # DNS record types
    history/types.ts      # HistoryEntry type
    metadata.ts           # Next.js Metadata config
    rate-limit.ts         # In-memory rate limiter + cleanup interval
    recommendations/      # security.ts, performance.ts, index.ts
    utils.ts              # cn() (clsx + tailwind-merge)
```

### Data flow

```
User input (URL)
  → Server Action (rate limit check)
    → runChecks() [Promise.all — 18 checks in parallel]
      → calculateGlobalScore()
        → ChecksResponse { url, hostname, checks[], score, totalDurationMs }
          → ResultsSection (client render)
          → addEntry() → localStorage history
```

---

## Check System (18 checks)

### HTTP & Security — 25 pts

| ID             | Check             | Description                                                         |
| -------------- | ----------------- | ------------------------------------------------------------------- |
| `headers`      | Security Headers  | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| `https`        | HTTPS & TLS       | Enforcement, redirects, TLS version                                 |
| `security-txt` | security.txt      | `/.well-known/security.txt` or `/security.txt`                      |
| `redirects`    | Redirect Behavior | Chain analysis, loop detection                                      |

### Network & DNS — 20 pts

| ID             | Check                                  |
| -------------- | -------------------------------------- |
| `dns-records`  | A, AAAA, CNAME, MX, TXT, NS resolution |
| `dns-security` | SPF, DKIM, DMARC, DNSSEC               |
| `ip-hosting`   | IP address, ASN, provider (ipapi.co)   |

### Infrastructure — 20 pts

| ID    | Check                                                  |
| ----- | ------------------------------------------------------ |
| `waf` | WAF / CDN detection (Cloudflare, Fastly, Akamai, etc.) |

### Website Structure — 15 pts

| ID        | Check                                               |
| --------- | --------------------------------------------------- |
| `robots`  | robots.txt presence and validity                    |
| `sitemap` | Sitemap availability and format                     |
| `links`   | Internal/external link count, broken link detection |

### Metadata & Stack — 10 pts

| ID               | Check                                                        |
| ---------------- | ------------------------------------------------------------ |
| `metadata`       | HTML title, description, charset, viewport                   |
| `accessibility`  | lang attr, skip links, ARIA landmarks, alt text, form labels |
| `social`         | Open Graph, Twitter Cards                                    |
| `server-headers` | Information leakage (Server, X-Powered-By)                   |
| `stack`          | Framework, CMS, analytics, CDN detection                     |

### Performance — 10 pts

| ID            | Check                                        |
| ------------- | -------------------------------------------- |
| `performance` | Response time, size, compression (gzip / br) |
| `uptime`      | Reachability and HTTP status                 |

---

## Scoring System

```
Global score = Σ (category_weight × category_score) / Σ weights

Category score = Σ (check_status_multiplier) / check_count
  OK      → 1.0
  Warning → 0.6
  Error   → 0.0

Grade thresholds:
  A  90–100
  B  75–89
  C  60–74
  D  40–59
  E  0–39
```

---

## Design System

- **Background**: `zinc-900` (#18181b) / `zinc-950` (#09090b)
- **Primary accent**: `blue-500` (#3b82f6)
- **OK**: `emerald-500` (#10b981) / `emerald-400`
- **Warning**: `amber-500` (#f59e0b) / `amber-400`
- **Error**: `red-500` (#ef4444) / `red-400`
- **Cards**: `zinc-900/50` with `border-zinc-800`
- **Font**: Geist (local) — SemiBold, Bold, Black
- **Radius base**: `0.625rem`
- **Mode**: Dark only (`<html class="dark">`)

---

## Environment Variables

```env
# Optional — enhanced IP/ASN lookups via ipapi.co
IPAPI_KEY=your_key_here

# Required in production — used for OG image metadataBase
NEXT_PUBLIC_SITE_URL=https://infralens.dev
```

---

## Development

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint check
```

### Adding a new check

1. Create `src/lib/checks/checks/<name>.ts` exporting a `CheckRunner<YourData>`
2. Register it in `src/lib/checks/run-checks.ts` (CHECKS array)
3. Assign a category in the check's return value
4. Optionally add scoring weight in `src/lib/checks/scoring-config.ts`
5. Add recommendations in `src/lib/recommendations/`

---

## Key Constraints & Notes

- **Rate limiting** is in-memory — resets on server restart (not suitable for multi-instance without Redis)
- **Link check** samples up to 10 links with a 3 s timeout per link
- **IP/ASN check** requires `IPAPI_KEY` for reliable lookups; falls back gracefully
- **DNS cache** is in-memory with TTL — shared across requests within a server instance
- **No database** — all state is either server-in-memory (rate limit, DNS cache) or client localStorage (history)
- **Serverless-friendly** — all checks use native Node.js APIs and `fetch`, no persistent connections
