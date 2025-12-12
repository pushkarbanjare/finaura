"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  function goToAuth() {
    router.push("/auth");
  }

  return (
    <div className="flex min-h-screen items-center justify-center text-center px-4">
      <div className="max-w-2xl">
        <h1
          className="text-6xl md:text-8xl font-bold mb-4 text-shadow-black"
          style={{ fontFamily: "var(--font-outfit)", fontWeight: 600 }}
        >
          F I N A U R A
        </h1>

        <h3 className="text-lg md:text-2xl mb-6 text-gray-700">
          Your Personal Finance & Expense Intelligence App
        </h3>

        <p className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base px-2">
          Track expenses, learn spending patterns, get savings insights, and set
          financial goals powered by a smart rule-based AI engine designed to
          improve your monthly financial habits.
        </p>

        <button
          onClick={goToAuth}
          className="px-6 py-1 md:px-6 md:py-1 bg-indigo-700 text-white rounded-md text-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
