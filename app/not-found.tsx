import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-zinc-100 px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo mark */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full border-2 border-blue-500 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
          </div>
          <span className="text-lg font-bold text-zinc-500 tracking-wide">
            InfraLens
          </span>
        </div>

        {/* 404 */}
        <div className="space-y-2">
          <p className="text-8xl font-black tracking-tight text-zinc-800 select-none">
            404
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            This URL doesn&apos;t resolve to anything here.
            <br />
            Maybe you were looking for a website to inspect?
          </p>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-blue-500/40 mx-auto" />

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-500/90 text-white text-sm font-semibold transition-colors"
        >
          Back to InfraLens
        </Link>
      </div>
    </main>
  );
}
