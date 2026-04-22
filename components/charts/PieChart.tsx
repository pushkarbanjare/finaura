"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const COLORS = [
  "#818cf8",
  "#22d3ee",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#a78bfa",
  "#60a5fa",
  "#2dd4bf",
];

export default function CategoryPieChart({ categoryTotals }: any) {
  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Number(value),
  }));

  if (!data.length) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-52 h-52 sm:w-56 sm:h-56 min-h-[220px]">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="58%"
              outerRadius="78%"
              paddingAngle={3}
              isAnimationActive
            >
              <Label
                value={`₹${total}`}
                position="center"
                className="fill-foreground text-lg font-semibold"
              />

              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  stroke="#020617"
                  strokeWidth={2}
                />
              ))}
            </Pie>

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
              formatter={(value: number, name: string) => [`₹${value}`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm w-full max-h-40 overflow-y-auto pr-1">
        {data.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-foreground/80"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="wrap-break-words">
              {entry.name}: ₹{entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
