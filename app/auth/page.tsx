"use client";

import { toast } from "@/components/ToastProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = mode === "login" ? "/api/auth/login" : "/api/auth/signup";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast(data.error || "Something went wrong");
      return;
    }

    if (mode === "login" && data.token) {
      localStorage.setItem("token", data.token);
      router.replace("/dashboard");
    }

    if (mode === "signup") {
      toast("Signup successful! Please login.");
      setMode("login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-lg border border-gray-200 p-6 shadow-md">
        <h1 className="text-xl md:text-2xl font-semibold text-center mb-6">
          {mode === "login" ? "Login to Finaura" : "Create Your Account"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {mode === "login" ? "Login" : "Signup"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-sm text-center text-blue-600 hover:underline"
        >
          Switch to {mode === "login" ? "Signup" : "Login"}
        </button>
      </div>
    </div>
  );
}
