import { RegisterServiceWorker } from "@/components/pwa/register-sw";
import { siteMetadata } from "@/lib/metadata";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: [
    {
      path: "../public/fonts/Geist-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Geist-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Geist-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const geistMono = localFont({
  src: "../public/fonts/Geist-SemiBold.otf",
  variable: "--font-geist-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  ...siteMetadata,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "InfraLens",
  },
  icons: {
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
