import { cookies } from "next/headers";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const params = await searchParams;

  const month = Number(params.month ?? new Date().getMonth());
  const year = Number(params.year ?? new Date().getFullYear());

  const [profileRes, summaryRes, insightsRes] = await Promise.all([
    fetch("http://localhost:3000/api/profile/get", {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    }),
    fetch(
      `http://localhost:3000/api/dashboard/summary?month=${month}&year=${year}`,
      {
        headers: { cookie: cookieHeader },
        cache: "no-store",
      }
    ),
    fetch("http://localhost:3000/api/dashboard/insights", {
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
      summary={summary}
      insights={insights.insights ?? []}
      month={month}
      year={year}
    />
  );
}
