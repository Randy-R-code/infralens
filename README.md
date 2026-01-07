# InfraLens

**InfraLens** is a developer-focused web inspection tool that allows you to analyze and understand the public infrastructure of any website. It provides detailed insights on DNS records, HTTP headers, TLS versions, SSL certificates, and other key site features. The app is designed to be simple, fast, and developer-friendly, presenting results in a structured, readable format.

InfraLens is primarily intended as a **personal or portfolio project**, but its modular architecture makes it easy to extend with additional checks in the future.

---

## Features

- Inspect HTTP responses and headers
- Check DNS records and configuration
- Analyze TLS and SSL settings
- Detect technologies used on the website
- Display results with clear status indicators (OK / Warning / Error)
- Modular and extensible architecture for adding new checks
- Designed for rapid developer analysis and troubleshooting

---

## Getting Started

### Requirements

- Node.js 20+
- pnpm (recommended)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/infralens.git
cd infralens

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open http://localhost:3000 in your browser to see the app.

---

## Project Structure

The project is organized as follows:

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Homepage
└── actions/
    └── run-checks.ts   # Server action to run checks

src/
├── lib/
│   ├── checks/
│   │   ├── index.ts    # Orchestrator
│   │   ├── types.ts    # Types & contract
│   │   ├── http.ts     # HTTP / headers check
│   │   ├── tls.ts      # TLS / SSL check (planned)
│   │   └── dns.ts      # DNS check (planned)
│   └── utils.ts        # Utility functions
└── components/
    └── ui/             # shadcn/ui components
        ├── alert.tsx
        ├── badge.tsx
        ├── button.tsx
        ├── card.tsx
        ├── input.tsx
        ├── separator.tsx
        ├── skeleton.tsx
        ├── table.tsx
        └── tooltip.tsx
```

---

## Usage

1. Enter a website URL in the input field
2. Click **Analyze**
3. The results will appear below, showing the status of each check (OK / Warning / Error)

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Future Plans

- Add TLS certificate expiration check
- Add more DNS record checks
- Detect technologies used on the website (CMS, frameworks, libraries)
- Improve result visualization with tables and badges
- Optional: historical tracking of previous checks
