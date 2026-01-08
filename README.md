# InfraLens

**InfraLens** is a lightweight web inspection tool designed to quickly analyze the infrastructure, security, and technical signals of a website.

It focuses on practical, server-side checks that help developers understand how a website is configured, exposed, and delivered on the web.

InfraLens does not aim to replace full security audits or performance tools. Instead, it provides a fast, readable overview of key infrastructure signals that matter for modern web applications.

---

## What InfraLens Analyzes

### HTTP & Security

- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- HTTPS enforcement and redirect behavior
- TLS version and certificate details

### Network & DNS

- DNS records (A, AAAA, CNAME, MX, TXT, NS)
- DNS security (SPF, DKIM, DMARC, DNSSEC)
- IP address, ASN, and hosting provider

### Infrastructure

- Firewall / WAF detection

### Website Structure

- robots.txt presence and validity
- Sitemap availability
- Internal and external link signals

### Metadata & Social

- HTML metadata
- Open Graph and social tags

### Technology Stack

- Frameworks and platforms
- CDN and analytics detection
- Server header analysis

### Performance Signals (lightweight)

- Response time approximation
- Compression support
- Reachability and uptime snapshot

**Note:** Port scanning and traceroute are not included in the current version to ensure compatibility with serverless platforms and maintain fast response times.

---

## Features

- **Fast** - Server-side parallel execution with optimized DNS caching
- **Comprehensive** - 16 independent checks across 6 categories
- **Readable** - Clear, structured results with status indicators (OK / Warning / Error)
- **Transparent** - Detailed documentation explaining each check and its purpose
- **Actionable** - Contextual recommendations with step-by-step guidance
- **Exportable** - Download results as JSON for further analysis
- **Modular** - Extensible architecture for adding new checks
- **Type-Safe** - Full TypeScript coverage with strict type checking

---

## Getting Started

### Requirements

- Node.js 20+
- pnpm (recommended)
- (Optional) IPAPI_KEY from [ipapi.co](https://ipapi.co/signup/) for IP/ASN lookups (1000 free requests/day without key)

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Optional: IP API Key for enhanced IP/ASN lookups
# Get your free key at https://ipapi.co/signup/
IPAPI_KEY=your_api_key_here
```

**Note:** The app works without this key, but you'll be limited to 1000 IP lookups per day.

### Rate Limiting

InfraLens implements rate limiting to protect the service and external APIs:

- **1 analysis per IP per 30 seconds** - Prevents abuse and protects DNS resolvers
- Rate limits are enforced server-side
- Exceeding the limit returns a clear error message with wait time

This ensures fair usage and protects against abuse while keeping the service free.

### Installation

```bash
# Clone the repo
git clone https://github.com/Randy-R-code/infralens.git
cd infralens

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open http://localhost:3000 in your browser to see the app.

---

## Usage

1. Enter a website URL in the input field (e.g., `https://example.com`)
2. Click **Analyze** to start the inspection
3. Review the overall score and grade (A–E)
4. Explore the category breakdown to see performance by area
5. Examine individual check results with detailed data
6. Review actionable recommendations for failed checks
7. Export results as JSON for further analysis or reporting

---

## Scoring System

InfraLens uses a weighted, category-based scoring system designed to provide meaningful insights while remaining transparent and actionable.

### Category Weights

Each category is assigned a weight reflecting its importance:

- **HTTP & Security**: 25 points
- **Network & DNS**: 20 points
- **Infrastructure**: 20 points
- **Website Structure**: 15 points
- **Metadata & Stack**: 10 points
- **Performance Signals**: 10 points

**Total**: 100 points

### Status Multipliers

Each check contributes to its category's score based on status:

- **OK**: 100% of category weight
- **Warning**: 60% of category weight
- **Error**: 0% of category weight

### Grade Calculation

The final score (0–100) is converted to a letter grade:

- **90–100**: A (Excellent)
- **75–89**: B (Good)
- **60–74**: C (Average)
- **40–59**: D (Poor)
- **< 40**: E (Critical)

**Note**: Grades are visual indicators to help prioritize improvements. They are not security certifications or guarantees.

---

## Architecture

InfraLens is built with **Next.js 16** (App Router) and follows a modular, type-safe architecture:

### Core Architecture

- **Server Actions**: All checks run server-side via Next.js server actions for security and performance
- **Modular Check System**: Each check is an independent, testable module implementing a `CheckRunner` interface
- **Type Safety**: Full TypeScript coverage with strict type checking
- **Scoring System**: Weighted category-based scoring with configurable weights and status multipliers
- **Rate Limiting**: In-memory rate limiting to protect services and prevent abuse

### Technology Stack

- **Framework**: Next.js 16 (App Router, React Server Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **DNS Resolution**: Native Node.js `dns/promises` with caching
- **HTML Parsing**: Cheerio for link extraction
- **External APIs**: ipapi.co for IP/ASN lookups (optional)

## Project Structure

```
infralens/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Homepage with analysis UI
│   ├── docs/
│   │   └── page.tsx            # Comprehensive documentation
│   └── actions/
│       └── run-checks.ts       # Server action with rate limiting
│
├── src/
│   ├── lib/
│   │   ├── checks/
│   │   │   ├── index.ts                    # Public API exports
│   │   │   ├── run-checks.ts               # Check orchestration
│   │   │   ├── types.ts                    # Core type definitions
│   │   │   ├── scoring-config.ts           # Category weights & multipliers
│   │   │   ├── calculate-score.ts          # Score calculation logic
│   │   │   ├── export.ts                   # JSON export functionality
│   │   │   └── checks/                     # Individual check implementations
│   │   │       ├── headers.ts              # HTTP security headers
│   │   │       ├── https.ts                # HTTPS & TLS verification
│   │   │       ├── redirects.ts            # Redirect chain analysis
│   │   │       ├── dns-records.ts          # DNS record resolution
│   │   │       ├── dns-security.ts         # SPF, DKIM, DMARC, DNSSEC
│   │   │       ├── ip-hosting.ts           # IP, ASN, hosting provider
│   │   │       ├── robots.ts               # robots.txt validation
│   │   │       ├── sitemap.ts              # Sitemap detection
│   │   │       ├── links.ts                # Link extraction & validation
│   │   │       ├── metadata.ts             # HTML metadata checks
│   │   │       ├── social.ts               # Open Graph & Twitter Cards
│   │   │       ├── stack.ts                # Technology stack detection
│   │   │       ├── server-headers.ts       # Server header analysis
│   │   │       ├── waf.ts                  # WAF/CDN detection
│   │   │       ├── performance.ts          # Response metrics
│   │   │       └── uptime.ts                # Reachability check
│   │   │
│   │   ├── dns/
│   │   │   ├── index.ts                    # DNS client exports
│   │   │   ├── dns-types.ts                # DNS type definitions
│   │   │   ├── dns-cache.ts                # In-memory DNS cache
│   │   │   └── dns-client.ts               # DNS resolver with timeout
│   │   │
│   │   ├── recommendations/
│   │   │   ├── index.ts                    # Recommendation exports
│   │   │   ├── security.ts                 # Security recommendations
│   │   │   └── performance.ts              # Performance recommendations
│   │   │
│   │   ├── rate-limit.ts                   # Rate limiting implementation
│   │   ├── metadata.ts                     # App metadata
│   │   └── utils.ts                        # Utility functions
│   │
│   └── components/
│       ├── landing/                         # Landing page sections
│       │   ├── hero.tsx                    # Hero with URL input
│       │   ├── cta.tsx                     # Call-to-action section
│       │   ├── what-it-checks.tsx          # Feature overview
│       │   ├── why-infralens.tsx           # Value proposition
│       │   ├── how-results.tsx             # Results explanation
│       │   └── footer.tsx                  # Footer component
│       │
│       ├── results/                         # Results display components
│       │   ├── results-section.tsx         # Main results container
│       │   ├── check-result-card.tsx       # Individual check card
│       │   ├── score-badge.tsx             # Overall score display
│       │   ├── category-breakdown.tsx      # Category score breakdown
│       │   ├── why-score-dialog.tsx        # Scoring explanation dialog
│       │   └── recommendation-card.tsx     # Recommendation display
│       │
│       └── ui/                              # shadcn/ui components
│           ├── badge.tsx
│           ├── button.tsx
│           ├── card.tsx
│           ├── dialog.tsx
│           ├── input.tsx
│           └── ...
```

---

## Documentation

See the [Documentation page](/docs) for detailed information about:

- How each check works
- What the results mean
- Common misconfigurations
- Best practices

---

## License

This project is **open source** and licensed under the MIT License. See [LICENSE](LICENSE) for details.

You are free to use, modify, and distribute this software in accordance with the MIT License terms.

---

## Technical Details

### Check Execution

- All checks run in parallel using `Promise.all()` for optimal performance
- Each check has an 8-second timeout to prevent hanging requests
- DNS queries are cached in-memory with a TTL to reduce redundant lookups
- Rate limiting prevents abuse (1 request per IP per 30 seconds)

### Error Handling

- Individual check failures don't stop the entire analysis
- Failed checks return an "error" status with descriptive messages
- Network timeouts and DNS failures are gracefully handled
- User-friendly error messages guide troubleshooting

### Performance

- Typical analysis completes in 2–5 seconds
- DNS caching reduces lookup overhead
- Parallel execution minimizes total duration
- Server-side execution ensures consistent results

## Limitations

- **Read-only**: InfraLens performs passive analysis only—no exploitation or intrusive scanning
- **Heuristic detection**: Technology stack detection is based on patterns and may not be exhaustive
- **Single snapshot**: Uptime checks represent a single point in time, not historical monitoring
- **Network-dependent**: Results may vary based on network conditions and DNS resolver location
- **No port scanning**: Port scanning is excluded to ensure serverless compatibility and maintain fast response times

## Notes

- Results should be interpreted as **indicators**, not guarantees
- This project is designed for **educational purposes and portfolio demonstration**
- Always verify findings with additional tools before making security decisions
