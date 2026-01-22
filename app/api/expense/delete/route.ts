import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { getUserIdFromSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/security/rateLimit";

export async function DELETE(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const allowed = rateLimit(`expense:delete:${ip}`, 20, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many delete requests." },
        { status: 429 },
      );
    }

    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { expenseId } = await req.json();
    if (!expenseId) {
      return NextResponse.json(
        { error: "ExpenseId is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    if (expense.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await expense.deleteOne();

    return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE EXPENSE ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
