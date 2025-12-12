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
    <div className="w-full h-72 fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={38}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#6366F1" stopOpacity={0.55} />
            </linearGradient>
          </defs>

          <Bar
            dataKey="value"
            fill="url(#barGradient)"
            radius={[12, 12, 0, 0]}
            animationDuration={900}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
