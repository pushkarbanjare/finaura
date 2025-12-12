import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Expense } from "@/models/Expense";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Read month, year from URL
    const { searchParams } = new URL(req.url);

    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    const now = new Date();
    const month = monthParam ? Number(monthParam) : now.getMonth();
    const year = yearParam ? Number(yearParam) : now.getFullYear();

    // Calculate month boundaries
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const salary = user.salary || 0;

    const expenses = await Expense.find({
      userId,
      date: { $gte: firstDay, $lte: lastDay },
    });

    const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Category Total
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((exp) => {
      categoryTotals[exp.category] =
        (categoryTotals[exp.category] || 0) + exp.amount;
    });

    // Expense Data
    const dailySpend: Record<string, number> = {};
    expenses.forEach((exp) => {
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
      { status: 200 }
    );
  } catch (error) {
    console.error("DASHBOARD SUMMARY ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
