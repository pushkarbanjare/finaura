"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Not logged in");
        return;
      }

      const res1 = await fetch("/api/dashboard/summary", {
        //summary
        headers: { Authorization: "Bearer " + token },
      });
      const data1 = await res1.json();

      const res2 = await fetch("/api/dashboard/insights", {
        //insights
        headers: { Authorization: "Bearer " + token },
      });
      const data2 = await res2.json();

      setSummary(data1);
      setInsights(data2.insights || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);
  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Summary</h2>
      {summary ? (
        <div>
          <p>Month: {summary.month}</p>
          <p>Salary: {summary.salary}</p>
          <p>Total Spend: {summary.totalSpend}</p>
          <p>Savings: {summary.savings}</p>

          <h3>Category Totals:</h3>
          {Object.entries(summary.categoryTotals).map(([cat, amt]) => (
            <p key={cat}>
              {cat}: {String(amt)}
            </p>
          ))}
        </div>
      ) : (
        <p>No summary data available.</p>
      )}

      <h2>Insights</h2>
      {insights.length > 0 ? (
        insights.map((line, index) => <p key={index}> {line}</p>)
      ) : (
        <p>No insights available.</p>
      )}
    </div>
  );
}
