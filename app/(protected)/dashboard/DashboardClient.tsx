"use client";

import { useState } from "react";
import MonthlyBarChart from "@/components/charts/BarChart";
import CategoryPieChart from "@/components/charts/PieChart";

type Props = {
  userName: string;
  goalAmount: number | null;
  goalYear: number | null;
  initialMonth: number;
  initialYear: number;
  initialSummary: any;
  initialInsights: string[];
};

export default function DashboardClient({
  userName,
  goalAmount,
  initialMonth,
  initialYear,
  initialSummary,
  initialInsights,
}: Props) {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [summary, setSummary] = useState(initialSummary);
  const [insights, setInsights] = useState(initialInsights);
  const [loading, setLoading] = useState(false);

  async function applyFilter() {
    setLoading(true);

    const [summaryRes, insightsRes] = await Promise.all([
      fetch(`/api/dashboard/summary?month=${month}&year=${year}`),
      fetch(`/api/dashboard/insights`),
    ]);

    setSummary(await summaryRes.json());
    setInsights((await insightsRes.json()).insights ?? []);
    setLoading(false);
  }

  const hasData = summary?.totalSpend > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 space-y-2">
      {/* Header */}
      <h1 className="text-2xl font-semibold pt-4">Hi {userName || "there"}</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 text-sm">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="rounded-md border border-foreground/20 bg-background px-3 py-2"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-md border border-foreground/20 bg-background px-3 py-2"
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          onClick={applyFilter}
          className="rounded-md border border-foreground/20 px-4 py-2 text-sm hover:bg-foreground/20 transition"
        >
          {loading ? "Loading..." : "Apply"}
        </button>
      </div>

      {!hasData ? (
        <p className="text-center text-foreground/50 p-10">
          No expenses found for this period.
        </p>
      ) : (
        <>
        {/* charts */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="min-h-80 lg:h-80 flex-1 rounded-lg border border-foreground/20 p-4">
              <CategoryPieChart categoryTotals={summary.categoryTotals} />
            </div>

            <div className="min-h-80 lg:h-80 flex-1 rounded-lg border border-foreground/20 p-4">
              <MonthlyBarChart
                salary={summary.salary}
                totalSpend={summary.totalSpend}
                savings={summary.savings}
              />
            </div>
          </div>

          {/* summary & insights */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 rounded-lg border border-foreground/20 p-4">
              <h2 className="text-lg font-semibold mb-3">Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Salary</span>
                  <span>₹{summary.salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Total Spend</span>
                  <span>₹{summary.totalSpend}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Savings</span>
                  <span>₹{summary.savings}</span>
                </div>
              </div>

              {goalAmount && summary.savings >= 0 && (
                <div className="mt-4">
                  <p className="text-sm mb-1">
                    Goal Progress: ₹{summary.savings} / ₹{goalAmount}
                  </p>
                  <div className="h-2 w-full rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full bg-foreground transition-all"
                      style={{
                        width: `${Math.min(
                          (summary.savings / goalAmount) * 100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 rounded-lg border border-foreground/20 p-4">
              <h2 className="text-lg font-semibold mb-3">Insights</h2>
              {insights.length ? (
                insights.map((line, i) => (
                  <p key={i} className="text-sm text-foreground/80">
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-sm text-foreground/50">
                  No insights available.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
