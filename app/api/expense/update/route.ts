import { NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/security/rateLimit";
import { updateExpenseSchema } from "@/lib/validators/expense.schema";
import { AppError, RateLimitError } from "@/lib/errors";
import { updateExpense } from "@/services/expense.service";

export async function PUT(req: Request) {
  try {
    // ========== client identification ==========
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    // ========== rate limit ==========
    const allowed = rateLimit(`expense:update:${ip}`, 20, 60_000);
    if (!allowed)
      throw new RateLimitError("Too many update requests, Try again later.");

    // ========== auth ==========
    const userId = await getUserIdFromSession();
    if (!userId) throw new AppError("Unauthorized", 401);

    // ========== request parsing ==========
    const body = updateExpenseSchema.parse(await req.json());

    // ========== update expense logic ==========
    const expense = await updateExpense(userId, body);

    return NextResponse.json(
      { message: "Expense updated", expense },
      { status: 200 },
    );
  } catch (error: any) {
    // ========== zod validation errors ==========
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 },
      );
    }
    // ========== custom app errors ==========
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("UPDATE EXPENSE ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
