import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Expense } from "@/models/Expense";
import { getUserIdFromSession } from "@/lib/auth/session";

export async function GET(req: Request) {
  try {
    await connectDB();

    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);

    const now = new Date();
    const month = Number(searchParams.get("month") ?? now.getMonth());
    const year = Number(searchParams.get("year") ?? now.getFullYear());

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const salary = user.salary ?? 0;

    const expenses = await Expense.find({
      userId,
      date: { $gte: firstDay, $lte: lastDay },
    });

    const totalSpend = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const categoryTotals: Record<string, number> = {};
    const dailySpend: Record<string, number> = {};

    expenses.forEach((exp) => {
      categoryTotals[exp.category] =
        (categoryTotals[exp.category] || 0) + exp.amount;

      const day = new Date(exp.date).getDate();
      dailySpend[day] = (dailySpend[day] || 0) + exp.amount;
    });

    const savings = salary - totalSpend;

    return NextResponse.json(
      {
        month: firstDay.toLocaleString("default", { month: "long" }),
        monthNumber: month,
        year,
        salary,
        totalSpend,
        savings,
        categoryTotals,
        dailySpend,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DASHBOARD SUMMARY ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
