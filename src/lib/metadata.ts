import type { Metadata } from "next";

// Get the base URL from environment variable or use localhost for development
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const siteMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "InfraLens — Website inspection tool",
  description:
    "Inspect, analyze and understand any website infrastructure. Built for developers.",
  openGraph: {
    title: "InfraLens — Website inspection tool",
    description:
      "Inspect, analyze and understand any website infrastructure. Built for developers.",
    type: "website",
    images: [
      {
        url: "/og-image-infralens.png",
        width: 1200,
        height: 630,
        alt: "InfraLens — Website inspection tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InfraLens — Website inspection tool",
    description:
      "Inspect, analyze and understand any website infrastructure. Built for developers.",
    images: ["/og-image-infralens.png"],
  },
};
