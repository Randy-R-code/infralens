# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-01-07

### Added

#### SEO & Social Sharing

- Open Graph meta tags for social media sharing
- Twitter Card meta tags with large image support
- Dedicated metadata configuration file (`src/lib/metadata.ts`)
- OG image integration (`/logo-infralens-og.png`)

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

[0.1.0]: https://github.com/yourusername/infralens/releases/tag/v0.1.0
