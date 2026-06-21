import { getUserIdFromSession } from "@/lib/auth/session";
import { getSummaryData, getInsightsData } from "@/services/dashboard.service";
import { getProfile } from "@/services/profile.service";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const userId = await getUserIdFromSession();
  if (!userId) return null;

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const [profile, summary, insightsData] = await Promise.all([
    getProfile(userId),
    getSummaryData(userId, month, year),
    getInsightsData(userId),
  ]);

  const data = {
    userName: profile.name,
    goalAmount: profile.goalAmount,
    goalYear: profile.goalYear,
    ...summary,
    insights: insightsData.insights,
  };

  return (
    <DashboardClient
      initialMonth={month}
      initialYear={year}
      initialSummary={data}
      initialInsights={data.insights}
      userName={data.userName}
      goalAmount={data.goalAmount}
      goalYear={data.goalYear}
    />
  );
}
