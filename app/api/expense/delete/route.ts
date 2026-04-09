import { NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/security/rateLimit";
import { deleteExpense } from "@/services/expense.service";
import { AppError, RateLimitError } from "@/lib/errors";

export async function DELETE(req: Request) {
  try {
    // ========== client identification ==========
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    // ========== rate limit ==========
    const allowed = rateLimit(`expense:delete:${ip}`, 20, 60_000);
    if (!allowed)
      throw new RateLimitError("Too many delete requests, Try again later.");

    // ========== auth ==========
    const userId = await getUserIdFromSession();
    if (!userId) throw new AppError("Unauthorized", 401);

    // ========== expense parsing ==========
    const { expenseId } = await req.json();
    if (!expenseId) {
      return NextResponse.json(
        { error: "ExpenseId is required" },
        { status: 400 },
      );
    }

    // ========== delete expense logic ==========
    await deleteExpense(userId, expenseId);

    return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
  } catch (error: any) {
    // ========== custom app errors ==========
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("DELETE EXPENSE ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
