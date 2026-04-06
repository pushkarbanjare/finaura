import { NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth/session";
import { getInsightsData } from "@/services/dashboard.service";
import { AppError } from "@/lib/errors";

export async function GET() {
  try {
    // ========== auth ==========
    const userId = await getUserIdFromSession();
    if (!userId) throw new AppError("Unauthorized", 401);

    // ========== service call ==========
    const data = await getInsightsData(userId);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    // ========== handling app error ==========
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("INSIGHTS ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
