"use client";

import { toast } from "@/components/ToastProvider";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalYear, setGoalYear] = useState("");
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function loadProfile() {
    if (!token) return;

    const res = await fetch("/api/profile/get", {
      headers: { Authorization: "Bearer " + token },
    });

    const data = await res.json();
    if (!res.ok) return toast(data.error || "Failed to load profile");

    setName(data.name || "");
    setSalary(String(data.salary || ""));
    setGoalAmount(String(data.goalAmount || ""));
    setGoalYear(String(data.goalYear || ""));
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleUpdate(e: any) {
    e.preventDefault();
    if (!token) return;

    const res = await fetch("/api/profile/update", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name || undefined,
        salary: salary ? Number(salary) : undefined,
        goalAmount: goalAmount ? Number(goalAmount) : undefined,
        goalYear: goalYear ? Number(goalYear) : undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) return toast(data.error || "Failed to update");

    toast("Profile updated!");
  }

  if (loading)
    return (
      <div className="w-full flex justify-center pt-10 text-gray-600">
        Loading profile...
      </div>
    );

  return (
    <div className="max-w-xl mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Update your basic and financial details.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm">
        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm mb-1 font-medium">Name</label>
            <input
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Monthly Salary
            </label>
            <input
              value={salary}
              placeholder="e.g. 50000"
              onChange={(e) => setSalary(e.target.value)}
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Goal Amount
            </label>
            <input
              value={goalAmount}
              placeholder="e.g. 500000"
              onChange={(e) => setGoalAmount(e.target.value)}
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Goal Year</label>
            <input
              value={goalYear}
              placeholder="e.g. 2030"
              onChange={(e) => setGoalYear(e.target.value)}
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 rounded-lg transition font-medium"
          >
            Save Changes
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-3">
          Your changes update instantly.
        </p>
      </div>
    </div>
  );
}
