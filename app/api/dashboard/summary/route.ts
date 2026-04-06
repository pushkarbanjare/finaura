import { NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth/session";
import { getSummaryData } from "@/services/dashboard.service";
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

    // ========== service call ==========
    const data = await getSummaryData(userId, month, year);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    // ========== handling app error ==========
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("DASHBOARD SUMMARY ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
