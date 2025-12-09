"use client";

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
    if (!token) {
      alert("Not logged in");
      return;
    }
    const res = await fetch("/api/profile/get", {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to load profile");
      return;
    }
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
    if (!res.ok) {
      alert(data.error || "Failed to update");
      return;
    }

    alert("Profile updated!");
    if (loading) return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Name: </label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Salary: </label>
          <input
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            type="number"
          />
        </div>
        <div>
          <label>Goal Amount: </label>
          <input
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            type="number"
          />
        </div>
        <div>
          <label>Goal Year: </label>
          <input
            value={goalYear}
            onChange={(e) => setGoalYear(e.target.value)}
            type="number"
          />
        </div>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}
