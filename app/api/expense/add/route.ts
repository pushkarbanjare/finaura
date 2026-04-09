import { NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/security/rateLimit";
import { addExpenseSchema } from "@/lib/validators/expense.schema";
import { addExpense } from "@/services/expense.service";
import { AppError, RateLimitError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    // ========== client identification ==========
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    // ========== rate limit ==========
    const allowed = rateLimit(`expense:add:${ip}`, 30, 60_000);
    if (!allowed)
      throw new RateLimitError("Too many add requests, Try again later.");

    // ========== auth ==========
    const userId = await getUserIdFromSession();
    if (!userId) throw new AppError("Unauthorized", 401);

    // ========== expense parsing ==========
    const body = addExpenseSchema.parse(await req.json());

    // ========== add expense logic ==========
    const newExpense = await addExpense(userId, body);

    return NextResponse.json(
      { message: "Expense added", expense: newExpense },
      { status: 201 },
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

    console.error("ADD EXPENSE ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
