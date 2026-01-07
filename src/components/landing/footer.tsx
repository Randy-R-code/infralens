import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-6 md:py-8 px-6 sm:px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="text-sm text-zinc-500 text-center md:text-left">
            <p className="font-semibold text-zinc-100">InfraLens</p>
            <p>Website inspection tool for developers</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 text-sm text-zinc-500">
            <Link
              href="/docs"
              className="hover:text-zinc-300 transition-colors"
            >
              Documentation
            </Link>
            <Badge variant="outline" className="border-zinc-800">
              Open Source
            </Badge>
            <span>MIT License</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
          <p className="text-xs sm:text-sm text-zinc-500">
            Built by{" "}
            <Link
              href="https://randy-code.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              R-code
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
