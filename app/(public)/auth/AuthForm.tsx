"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    if (mode === "signup" && password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
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
        setError(data.error || "Something went wrong");
        return;
      }

      if (mode === "login") {
        router.replace("/dashboard");
        router.refresh();
      } else {
        setMode("login");
        setError("Signup successful. Please login.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-foreground/20 bg-background p-6">
      <h1 className="font-heading text-2xl text-center mb-6 font-semibold">
        {mode === "login" ? "Login to Finaura" : "Create Your Account"}
      </h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-500/10 text-red-600 px-3 py-2 text-sm">
          {error}
        </div>
      )}

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
          className="mt-2 rounded-md border border-foreground/20 py-2 text-sm hover:bg-foreground/20 transition disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Signup"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setEmail("test@mail.com");
          setPassword("123456");
          setMode("login");
          setError(null);
        }}
        className="mt-3 w-full rounded-md border border-dashed border-foreground/30 py-2 text-sm text-foreground/70 hover:bg-foreground/80 hover:text-background transition"
      >
        Login as Demo User
      </button>

      <button
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setError(null);
        }}
        className="mt-4 w-full text-center text-sm text-foreground/70 hover:text-foreground transition"
      >
        Switch to {mode === "login" ? "SIGNUP" : "LOGIN"}
      </button>
    </div>
  );
}
