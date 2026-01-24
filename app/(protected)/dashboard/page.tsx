import { cookies } from "next/headers";
import DashboardClient from "./DashboardClient";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://finaura-app.vercel.app"
    : "http://localhost:3000");

export default async function DashboardPage() {
  const cookieHeader = (await cookies()).toString();

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const [profileRes, summaryRes, insightsRes] = await Promise.all([
    fetch(`${BASE_URL}/api/profile/get`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    }),
    fetch(`${BASE_URL}/api/dashboard/summary?month=${month}&year=${year}`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    }),
    fetch(`${BASE_URL}/api/dashboard/insights`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    }),
  ]);

  if (!profileRes.ok) return null;

  const profile = await profileRes.json();
  const summary = await summaryRes.json();
  const insights = await insightsRes.json();

  return (
    <DashboardClient
      userName={profile.name ?? ""}
      goalAmount={profile.goalAmount ?? null}
      goalYear={profile.goalYear ?? null}
      initialMonth={month}
      initialYear={year}
      initialSummary={summary}
      initialInsights={insights.insights ?? []}
    />
  );
}
