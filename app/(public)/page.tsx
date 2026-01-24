import Link from "next/link";
import IlluminatedDots from "@/components/ui/IlluminatedDots";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 text-center select-none">
      <IlluminatedDots />

      <div className="relative z-10 max-w-2xl">
        <h1 className="font-heading text-foreground text-6xl md:text-8xl font-semibold mb-4 tracking-widest">
          FINAURA
        </h1>

        <h3 className="text-foreground/80 text-lg md:text-2xl mb-6">
          Your Personal Finance & Expense Intelligence App
        </h3>

        <p className="text-foreground/60 leading-relaxed mb-8 text-sm md:text-base">
          Track expenses, understand spending patterns, and build better
          financial habits with clarity.
        </p>

        <Link
          href="/auth"
          className="inline-block rounded-md border border-foreground/20 px-6 py-2 text-foreground hover:bg-foreground/20 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
