import { NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import { listExpense } from "@/services/expense.service";

export async function GET() {
  try {
    // ========== auth ==========
    const userId = await getUserIdFromSession();
    if (!userId) throw new AppError("Unauthorized", 401);

    // ========== list expense logic ==========
    const expenses = await listExpense(userId);

    return NextResponse.json({ expenses }, { status: 200 });
  } catch (error: any) {
    // ========== custom app errors ==========
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("LIST EXPENSE ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
