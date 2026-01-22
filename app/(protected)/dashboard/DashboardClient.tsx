"use client";

import MonthlyBarChart from "@/components/charts/BarChart";
import CategoryPieChart from "@/components/charts/PieChart";
import { useRouter } from "next/navigation";

type Props = {
  userName: string;
  goalAmount: number | null;
  goalYear: number | null;
  summary: any;
  insights: string[];
  month: number;
  year: number;
};

export default function DashboardClient({
  userName,
  goalAmount,
  summary,
  insights,
  month,
  year,
}: Props) {
  const router = useRouter();

  function updateMonthYear(m: number, y: number) {
    if (m === month && y === year) return;
    router.push(`/dashboard?month=${m}&year=${y}`);
  }

  return (
    <div className="pb-6">
      <h1 className="text-2xl font-semibold mb-5">
        Hi {userName || "there"} 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 rounded-lg border border-foreground/20 p-4">
          <div className="flex gap-2 mb-4">
            <select
              className="rounded-md border border-foreground/20 bg-background px-3 py-2"
              value={month}
              onChange={(e) => updateMonthYear(Number(e.target.value), year)}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            <select
              className="rounded-md border border-foreground/20 bg-background px-3 py-2"
              value={year}
              onChange={(e) => updateMonthYear(month, Number(e.target.value))}
            >
              {[2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <div className="h-80">
    {summary?.categoryTotals ? (
      <CategoryPieChart categoryTotals={summary.categoryTotals} />
    ) : (
      <p className="flex h-full items-center justify-center text-foreground/50">
        No category data.
      </p>
    )}
  </div>

  <div className="h-80">
    <MonthlyBarChart
      salary={summary.salary}
      totalSpend={summary.totalSpend}
      savings={summary.savings}
    />
  </div>
</div>

        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-foreground/20 p-4">
            <h2 className="text-lg font-semibold mb-2">Summary</h2>

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
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-foreground/20 p-4">
            <h2 className="text-lg font-semibold mb-2">Insights</h2>
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
      </div>
    </div>
  );
}
