import { NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth/session";
import { getInsightsData, getSummaryData } from "@/services/dashboard.service";
import { getProfile } from "@/services/profile.service";
import { AppError } from "@/lib/errors";

export async function GET(req: Request) {
  try {
    // ========== auth ==========
    const userId = await getUserIdFromSession();
    if (!userId) throw new AppError("Unauthorized", 401);

    // ========== query params ==========
    const { searchParams } = new URL(req.url);

    const now = new Date();
    const month = Number(searchParams.get("month") ?? now.getMonth());
    const year = Number(searchParams.get("year") ?? now.getFullYear());

    // ========== parallel service calls ==========
    const [profile, summary, insightsData] = await Promise.all([
      getProfile(userId),
      getSummaryData(userId, month, year),
      getInsightsData(userId),
    ]);

    // ========== transform response ==========
    const response = {
      userName: profile.name,
      goalAmount: profile.goalAmount,
      goalYear: profile.goalYear,
      salary: summary.salary,
      totalSpend: summary.totalSpend,
      savings: summary.savings,
      categoryTotals: summary.categoryTotals,
      dailySpend: summary.dailySpend,
      insights: insightsData.insights,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    // ========== handling app error ==========
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("DASHBOARD ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
