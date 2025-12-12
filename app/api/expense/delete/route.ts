import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { getUserIdFromRequest } from "@/lib/auth";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { expenseId } = await req.json();
    if (!expenseId) {
      return NextResponse.json(
        { error: "ExpenseId is required" },
        { status: 400 }
      );
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (expense.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await expense.deleteOne();

    return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE EXPENSE ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
