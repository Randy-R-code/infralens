"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function CTA() {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement analysis
    console.log("Analyzing:", url);
  };

  return (
    <section className="py-8 md:py-12 lg:py-16 px-6 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-6 md:p-8 lg:p-12">
            <div className="space-y-4 md:space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                  Ready to inspect?
                </h2>
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col xs:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                  <Input
                    placeholder="https://example.com"
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-10 h-12 text-base bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-blue-500 focus:ring-blue-500/30"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 xs:px-8 w-full xs:w-auto bg-blue-500 hover:bg-blue-500/90 text-white"
                >
                  Analyze
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
