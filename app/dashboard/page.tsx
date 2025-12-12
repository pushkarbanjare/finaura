"use client";

import { useEffect, useState } from "react";
import MonthlyBarChart from "@/components/charts/BarChart";
import CategoryPieChart from "@/components/charts/PieChart";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  const [goalAmount, setGoalAmount] = useState<number | null>(null);
  const [goalYear, setGoalYear] = useState<number | null>(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  async function loadDashboard() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const profileRes = await fetch("/api/profile/get", {
        headers: { Authorization: "Bearer " + token },
      });
      const profileData = await profileRes.json();

      if (profileRes.ok) {
        setUserName(profileData.name || "");
        setGoalAmount(profileData.goalAmount || null);
        setGoalYear(profileData.goalYear || null);
      }

      // Summary
      const res1 = await fetch(
        `/api/dashboard/summary?month=${selectedMonth}&year=${selectedYear}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      const summaryData = await res1.json();

      // Insights
      const res2 = await fetch(`/api/dashboard/insights`, {
        headers: { Authorization: "Bearer " + token },
      });
      const insightsData = await res2.json();

      setSummary(summaryData);
      setInsights(insightsData.insights || []);

      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [selectedMonth, selectedYear]);

  if (loading)
    return (
      <div className="animate-pulse space-y-4 p-4">
        <div className="h-6 bg-gray-200 w-40 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-80 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="pb-6 fade-in">
      {/* Greet */}
      <h1 className="text-2xl font-bold mb-5 mt-1 px-1">
        Hi {userName || "there"} 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm fade-in">
          {/* Month selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            <select
              className="border px-3 py-2 rounded-md bg-white hover:border-gray-400 transition"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            <select
              className="border px-3 py-2 rounded-md bg-white hover:border-gray-400 transition"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {[2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <h2 className="text-lg font-semibold mb-3">Monthly Overview</h2>

          {/* Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {summary?.categoryTotals &&
            Object.keys(summary.categoryTotals).length > 0 ? (
              <CategoryPieChart categoryTotals={summary.categoryTotals} />
            ) : (
              <div className="text-center text-gray-400 pt-10">
                No category data for this month.
              </div>
            )}

            <MonthlyBarChart
              salary={summary?.salary || 0}
              totalSpend={summary?.totalSpend || 0}
              savings={summary?.savings || 0}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm fade-in">
            <h2 className="text-lg font-semibold mb-2">Summary</h2>

            {summary ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary</span>
                  <span className="font-medium">₹{summary.salary}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spend</span>
                  <span className="font-medium">₹{summary.totalSpend}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Savings</span>
                  <span className="font-semibold text-green-600">
                    ₹{summary.savings}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No summary available.</p>
            )}

            {/* Goal Progress bar */}
            {goalAmount && summary?.savings >= 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-1">
                  Goal Progress:{" "}
                  <span className="font-semibold">₹{summary.savings}</span> / ₹
                  {goalAmount}
                </p>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (summary.savings / goalAmount) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Insights */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm fade-in">
            <h2 className="text-lg font-semibold mb-2">Insights</h2>

            {insights.length > 0 ? (
              insights.map((line, index) => (
                <p key={index} className="text-sm">
                  {line}
                </p>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No insights available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
