"use client";

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
    console.log("RESPONSE: ", data);
    if (!res.ok) {
      alert(data.error || "Something went wrong");
      return;
    }

    if (mode === "login" && data.token) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    }
    if (mode === "signup") {
      alert("Signup success! Please login now");
      setMode("login");
    }
  }
  return (
    <div>
      <h1>{mode === "login" ? "Login" : "Signup"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </div>
        <button type="submit">{mode === "login" ? "Login" : "Signup"}</button>
      </form>
      <button onClick={() => setMode(mode === "login" ? "signup" : "login")}>
        Switch to {mode === "login" ? "Signup" : "Login"}
      </button>
    </div>
  );
}
