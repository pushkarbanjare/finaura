"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyBarChart({ salary, totalSpend, savings }: any) {
  const data = [
    { name: "Salary", value: Number(salary) },
    { name: "Spend", value: Number(totalSpend) },
    { name: "Savings", value: Number(savings) },
  ];

  return (
    <div className="w-full h-[220px] sm:h-[260px] lg:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={32}>
          {/* Subtle grid for dark mode */}
          <CartesianGrid
            strokeDasharray="2 2"
            stroke="#334155"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            tick={{ fill: "#cbd5f5", fontSize: 12 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: "rgba(99,102,241,0.1)" }}
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #334155",
              fontSize: "12px",
            }}
            labelStyle={{
              color: "#e5e7eb",
              fontWeight: 500,
            }}
            itemStyle={{
              color: "#ffffff",
            }}
          />

          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.55} />
            </linearGradient>
          </defs>

          <Bar
            dataKey="value"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            animationDuration={700}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
