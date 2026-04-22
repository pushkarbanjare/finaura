"use client";

import { useState, useEffect } from "react";

type Profile = {
  name: string;
  salary: number;
  goalAmount: number;
  goalYear: number;
};

export default function ProfileClient({
  initialProfile,
}: {
  initialProfile: Profile;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!message && !error) return;

    const timer = setTimeout(() => {
      setMessage(null);
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, error]);

  const [form, setForm] = useState({
    name: initialProfile.name ?? "",
    salary: initialProfile.salary?.toString() ?? "",
    goalAmount: initialProfile.goalAmount?.toString() ?? "",
    goalYear: initialProfile.goalYear?.toString() ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    const payload: any = {};
    if (form.name.trim()) payload.name = form.name.trim();
    if (form.salary !== "") payload.salary = Number(form.salary);
    if (form.goalAmount !== "") payload.goalAmount = Number(form.goalAmount);
    if (form.goalYear !== "") payload.goalYear = Number(form.goalYear);

    const res = await fetch("/api/profile/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update profile");
      setLoading(false);
      return;
    }

    setMessage("Profile updated successfully");
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mx-auto max-w-xl rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 space-y-5 shadow-lg shadow-indigo-500/10">
        <h1 className="text-xl font-semibold text-center text-white">Profile Settings</h1>
        <p className="text-sm text-center text-white/60">
          Update your details to get personalize insights
        </p>
        {message && (
          <div className="mb-4 rounded-md bg-green-500/10 text-green-400 px-3 py-2 text-sm text-center border border-green-500/20">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 text-red-400 px-3 py-2 text-sm text-center border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-white/70">
              Full Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/40 transition"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/70">
              Monthly Salary
            </label>
            <input
              type="number"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/40 transition"
              placeholder="e.g. 50000"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/70">
              Savings Goal Amount
            </label>
            <input
              type="number"
              value={form.goalAmount}
              onChange={(e) => setForm({ ...form, goalAmount: e.target.value })}
              className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/40 transition"
              placeholder="e.g. 300000"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/70">
              Target Year
            </label>
            <input
              type="number"
              value={form.goalYear}
              onChange={(e) => setForm({ ...form, goalYear: e.target.value })}
              className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/40 transition"
              placeholder="e.g. 2026"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-md bg-indigo-500/80 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-500/30 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
