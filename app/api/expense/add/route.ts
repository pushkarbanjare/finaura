import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { getUserIdFromSession } from "@/lib/auth/session";
import { generateCategory } from "@/lib/category";
import { rateLimit } from "@/lib/security/rateLimit";
import { addExpenseSchema } from "@/lib/validators/expense.schema";
import { addExpense } from "@/services/expense.service";
import { AppError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const allowed = rateLimit(`expense:add:${ip}`, 30, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Slow down." },
        { status: 429 },
      );
    }

    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = addExpenseSchema.parse(await req.json());
    const { amount, item, merchant, notes, date } = body;

    const newExpense = await addExpense(userId, body);

    return NextResponse.json(
      { message: "Expense added", expense: newExpense },
      { status: 201 },
    );
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 },
      );
    }

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("ADD EXPENSE ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
