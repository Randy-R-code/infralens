# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- TBD

---

## [1.0.0] - 2026-01-08

### Added

#### Complete Check Implementation (16 Checks)

- **HTTP & Security** (3 checks):
  - HTTP Security Headers (CSP, HSTS, X-Frame-Options, etc.)
  - HTTPS & TLS (enforcement, redirects, certificate validation)
  - Redirect Behavior (chain analysis, loop detection)
- **Network & DNS** (3 checks):
  - DNS Records (A, AAAA, CNAME, MX, TXT, NS resolution)
  - DNS Security (SPF, DKIM, DMARC, DNSSEC detection)
  - IP & Hosting (IP address, ASN, provider via ipapi.co)
- **Infrastructure** (1 check):
  - Firewall / WAF Detection (Cloudflare, Fastly, Akamai, etc.)
- **Website Structure** (3 checks):
  - robots.txt (presence and validity)
  - Sitemap (availability and format)
  - Linked Pages (internal/external link analysis with broken link detection)
- **Metadata & Stack** (4 checks):
  - HTML Metadata (title, description, charset, viewport)
  - Social Tags (Open Graph, Twitter Cards)
  - Stack Detection (frameworks, CMS, analytics, CDN)
  - Server Headers (information leakage detection)
- **Performance** (2 checks):
  - Performance Signals (response time, size, compression)
  - Uptime Snapshot (reachability and status)

#### Scoring System

- Weighted category-based scoring system
- Category weights configuration (HTTP & Security: 25, Network & DNS: 20, etc.)
- Status multipliers (OK: 100%, Warning: 60%, Error: 0%)
- Global score calculation with letter grades (A–E)
- Category breakdown display with progress bars
- "Why this score?" dialog explaining the scoring methodology

#### Recommendation System

- Structured recommendation types with severity levels
- Recommendation factories for security and performance
- Contextual recommendations with step-by-step guidance
- Impact descriptions and external references
- Recommendation cards in results UI

#### DNS Infrastructure

- Native Node.js DNS resolution with `dns/promises`
- In-memory DNS cache with TTL (reduces redundant lookups)
- DNS client with timeout handling and error management
- Support for A, AAAA, CNAME, MX, TXT, NS record types
- Safe error handling for DNS failures

#### Export Functionality

- JSON export of complete analysis results
- Export includes: URL, timestamp, score, grade, categories, all checks
- Download functionality with proper file naming

#### Rate Limiting

- In-memory rate limiting (1 request per IP per 30 seconds)
- IP detection from various headers (x-forwarded-for, x-real-ip, cf-connecting-ip)
- Automatic cleanup of expired rate limit entries
- Clear error messages with wait time when limit exceeded

#### UI Components

- ScoreBadge component with grade display (A–E)
- CategoryBreakdown component with progress bars
- WhyScoreDialog component explaining scoring methodology
- RecommendationCard component for displaying recommendations
- Export button in results section

#### Documentation

- Comprehensive documentation page (`/docs`) with detailed explanations
- Documentation for all 16 checks across 6 categories
- Scoring system explanation
- Notes and limitations section
- Professional, portfolio-ready documentation

#### Configuration

- `.env.example` file for API key configuration
- Optional `IPAPI_KEY` for enhanced IP/ASN lookups
- `.gitignore` updated to allow `.env.example` while ignoring other `.env*` files

### Changed

#### README

- Complete professional rewrite for portfolio presentation
- Detailed architecture section with technology stack
- Comprehensive project structure documentation
- Enhanced features list (16 checks, export, rate limiting)
- Detailed scoring system explanation
- Technical details section (execution, error handling, performance)
- Clear limitations and notes section
- Open source mention in license section

#### Documentation Page

- Enhanced descriptions with implementation details
- More technical and precise language
- Detailed explanations for each check category
- Improved limitations section with 5 clear points
- Consistency with README content

#### Server Actions

- Fixed TypeScript error with `headers()` async in Next.js 16
- Rate limiting integration in `runInfraChecks` action
- Improved error handling with user-friendly messages

#### Footer

- Added GitHub repository link
- Open source badge and MIT License display
- Professional attribution

#### Project Configuration

- Updated `.cursorrules` with current project state (16 checks, scoring, architecture)
- Improved project context for AI assistance

### Technical Details

#### New Dependencies

- `cheerio` for HTML parsing and link extraction

#### Architecture Improvements

- Parallel check execution for optimal performance
- Modular check system with type-safe interfaces
- Centralized scoring calculation
- Recommendation factory pattern
- DNS caching layer for performance optimization

#### Production Readiness

- Fixed `metadataBase` warning for Open Graph images
- Added `NEXT_PUBLIC_SITE_URL` environment variable support
- Updated OG image to `og-image-infralens.png`
- Production-ready configuration for Vercel deployment

---

## [0.2.0] - 2026-01-07

### Added

#### SEO & Social Sharing

- Open Graph meta tags for social media sharing
- Twitter Card meta tags with large image support
- Dedicated metadata configuration file (`src/lib/metadata.ts`)
- OG image integration (`/og-image-infralens.png`)

### Changed

- Metadata configuration extracted to separate module for better maintainability

---

## [0.1.0] - 2026-01-06

### Added

#### Project Setup

- Initial Next.js 16.1.1 project setup with TypeScript
- Tailwind CSS v4 configuration with custom breakpoints (xs: 26.25rem)
- shadcn/ui component library integration
- ESLint configuration for Next.js
- PostCSS configuration
- TypeScript configuration with path aliases (`@/*`, `@lib/*`, `@components/*`)

#### Design System

- Custom dark theme with zinc color palette (zinc-900 background, zinc-100 foreground)
- Primary color scheme: blue-500 with hover states
- Status color indicators:
  - OK: emerald-500
  - Warning: amber-500
  - Error: red-500
  - Info: blue-400
- Local Geist font integration (SemiBold, Bold, Black weights)
- Responsive design with mobile-first approach

#### UI Components

- shadcn/ui components: Alert, Badge, Button, Card, Input, Separator, Skeleton, Table, Tooltip
- Custom Skeleton component with zinc-800 background
- All components styled with dark theme

#### Landing Page

- Hero section with gradient title "infralens.dev"
- Search form with URL input and Analyze button
- Responsive form layout (stacked on mobile, inline on xs+)
- "What it checks" section with 5 feature cards:
  - DNS Records
  - TLS & SSL
  - HTTP Headers
  - Tech Stack
  - Metadata
- "How results are presented" section with status indicators and feature cards
- "Why InfraLens" section highlighting key benefits
- Call-to-action section with search form
- Footer with documentation link and portfolio attribution

#### Documentation

- `/docs` page with comprehensive documentation
- Sections covering:
  - DNS Records (A/AAAA, MX, TXT, common misconfigurations)
  - HTTP Headers (security headers, cache headers, redirects)
  - TLS & SSL (supported versions, certificate issuer, expiration)
- Back to home navigation

#### Check System Architecture

- Modular check system with extensible architecture
- Type-safe check definitions with `CheckResult<T>` and `CheckRunner<T>`
- Check context with URL, hostname, and timeout configuration
- Check response structure with duration tracking
- Centralized check orchestration in `run-checks.ts`

#### HTTP Security Headers Check

- First implemented check: HTTP Security Headers
- Checks for 5 recommended security headers:
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - Strict-Transport-Security
- Status determination:
  - OK: All headers present
  - Warning: Some headers present
  - Error: No headers or fetch failure
- Returns present and missing headers arrays
- Performance tracking with duration in milliseconds

#### Results Display

- Results section component with loading states
- Skeleton loading animation during check execution
- Check result cards with:
  - Status badges (OK/Warning/Error) with icons
  - Summary message
  - Detailed data display (present/missing headers)
  - Duration information
- "New Analysis" button to reset and start over
- Automatic scroll to results after analysis
- Smooth scroll animations

#### Server Actions

- Server action `runInfraChecks` for executing checks
- URL normalization and validation
- Error handling with user-friendly messages

#### Responsive Design

- Mobile-first responsive breakpoints
- Custom xs breakpoint (26.25rem / 420px)
- Responsive spacing and padding adjustments
- Responsive typography scaling
- Responsive grid layouts (1 column → 2 columns → 3 columns)
- Responsive form layouts (stacked → inline)

### Changed

- Default dark mode enabled in root layout
- Global CSS updated to use Geist font family
- Body background set to zinc-900

### Technical Details

#### Dependencies

- Next.js 16.1.1
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Radix UI primitives
- Lucide React icons
- class-variance-authority
- clsx & tailwind-merge

#### File Structure

- 40+ files created/modified
- Organized component structure (landing/, results/, ui/)
- Modular check system (checks/ directory)
- Server actions in app/actions/
- Documentation in app/docs/

---

[Unreleased]: https://github.com/Randy-R-code/infralens/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Randy-R-code/infralens/releases/tag/v1.0.0
[0.2.0]: https://github.com/Randy-R-code/infralens/releases/tag/v0.2.0
[0.1.0]: https://github.com/Randy-R-code/infralens/releases/tag/v0.1.0
