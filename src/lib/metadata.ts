import type { Metadata } from "next";

export const siteMetadata: Metadata = {
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
        url: "/logo-infralens-og.png",
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
    images: ["/logo-infralens-og.png"],
  },
};
