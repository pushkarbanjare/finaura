"use client";

import { useState } from "react";

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
  const [form, setForm] = useState({
    name: initialProfile.name ?? "",
    salary: initialProfile.salary?.toString() ?? "",
    goalAmount: initialProfile.goalAmount?.toString() ?? "",
    goalYear: initialProfile.goalYear?.toString() ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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
      const err = await res.json();
      console.error(err.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-2">
      <div className="flex items-center justify-center pt-10 pb-5 text-xl font-semibold">Fill your details to get more personalized info</div>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
        className="w-full bg-gray-800 rounded-lg p-2 text-sm cursor-pointer"
      />

      <input
        type="number"
        value={form.salary}
        onChange={(e) => setForm({ ...form, salary: e.target.value })}
        placeholder="Salary"
        className="w-full bg-gray-800 rounded-lg p-2 text-sm cursor-pointer"
      />

      <input
        type="number"
        value={form.goalAmount}
        onChange={(e) => setForm({ ...form, goalAmount: e.target.value })}
        placeholder="Goal Amount"
        className="w-full bg-gray-800 rounded-lg p-2 text-sm cursor-pointer"
      />

      <input
        type="number"
        value={form.goalYear}
        onChange={(e) => setForm({ ...form, goalYear: e.target.value })}
        placeholder="Goal Year"
        className="w-full bg-gray-800 rounded-lg p-2 text-sm cursor-pointer"
      />

      <button className="border border-foreground/50 rounded-lg text-sm p-2 hover:bg-foreground/20">
        Save
      </button>
    </form>
  );
}
