import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { getUserIdFromSession } from "@/lib/auth/session";
import { generateCategory } from "@/lib/category";
import { rateLimit } from "@/lib/security/rateLimit";
import { updateExpenseSchema } from "@/lib/validators/expense.schema";

export async function PUT(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const allowed = rateLimit(`expense:update:${ip}`, 20, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many update requests." },
        { status: 429 },
      );
    }

    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = updateExpenseSchema.parse(await req.json());
    const { expenseId, amount, item, merchant, notes, date } = body;

    await connectDB();

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    if (expense.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let category = expense.category;
    if (item || merchant || notes) {
      category = generateCategory(
        item ?? expense.item,
        merchant ?? expense.merchant,
        notes ?? expense.notes,
      );
    }

    expense.amount = amount ?? expense.amount;
    expense.item = item ?? expense.item;
    expense.merchant = merchant ?? expense.merchant;
    expense.notes = notes ?? expense.notes;
    expense.date = date ? new Date(date) : expense.date;
    expense.category = category;

    await expense.save();

    return NextResponse.json(
      { message: "Expense updated", expense },
      { status: 200 },
    );
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    }

    console.error("UPDATE EXPENSE ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
