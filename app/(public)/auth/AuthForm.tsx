"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const url = mode === "login" ? "/api/auth/login" : "/api/auth/signup";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error || "Something went wrong");
        return;
      }

      if (mode === "login") {
        // router.replace("/dashboard");
        // router.refresh();
        window.location.href = "/dashboard";
      } else {
        setMode("login");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-foreground/20 bg-background p-6">
      <h1 className="font-heading text-2xl text-center mb-6">
        {mode === "login" ? "Login to Finaura" : "Create Your Account"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-foreground/80 mb-1">Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 outline-none focus:border-foreground/40"
          />
        </div>

        <div>
          <label className="block text-sm text-foreground/80 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 outline-none focus:border-foreground/40"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="mt-2 rounded-md border border-foreground/30 py-2 text-sm hover:bg-foreground/5 transition disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Signup"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-4 w-full text-center text-sm text-foreground/70 hover:text-foreground transition"
      >
        Switch to {mode === "login" ? "Signup" : "Login"}
      </button>
    </div>
  );
}
