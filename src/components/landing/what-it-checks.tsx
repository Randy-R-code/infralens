import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, FileText, Globe, Search, Shield } from "lucide-react";

const checks = [
  {
    icon: Globe,
    title: "DNS Records",
    description: "A, AAAA, MX, TXT",
  },
  {
    icon: Shield,
    title: "TLS & SSL",
    description: "Protocol, certificate, expiration",
  },
  {
    icon: Search,
    title: "HTTP Headers",
    description: "Security & cache headers",
  },
  {
    icon: Code,
    title: "Tech Stack",
    description: "Frameworks, servers, CMS",
  },
  {
    icon: FileText,
    title: "Metadata",
    description: "robots.txt, sitemap, social tags",
  },
];

export function WhatItChecks() {
  return (
    <section className="py-8 md:py-12 lg:py-16 px-6 sm:px-8 md:px-12 bg-zinc-900/50">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 lg:space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            What it checks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-4 md:gap-6">
          {checks.map((check) => {
            const Icon = check.icon;
            return (
              <Card
                key={check.title}
                className="border-zinc-800 bg-zinc-900/50"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Icon className="size-5 text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">{check.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400">
                    {check.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
