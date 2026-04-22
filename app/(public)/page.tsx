import Link from "next/link";
import IlluminatedDots from "@/components/ui/IlluminatedDots";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 text-center select-none overflow-hidden">
      <IlluminatedDots />

      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-cyan-400/10 blur-3xl" />

      <div className="relative z-10 max-w-2xl backdrop-blur-sm">
        <h1 className="font-heading text-foreground text-6xl md:text-8xl font-semibold mb-4 tracking-widest">
          FINAURA
        </h1>

        <h3 className="text-foreground/80 text-lg md:text-2xl mb-6">
          Intelligent Expense Tracking & Insights
        </h3>

        <p className="text-foreground/60 leading-relaxed mb-8 text-sm md:text-base">
          Track expenses, categorize intelligently, and uncover spending
          patterns with clarity and precision.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/auth"
            className="inline-block rounded-md bg-indigo-500/80 px-6 py-2 text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-500/30"
          >
            Get Started
          </Link>

          <Link
            href="/dashboard"
            className="inline-block rounded-md border border-foreground/20 px-6 py-2 text-foreground hover:bg-foreground/90 hover:text-background/90 transition"
          >
            View Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
