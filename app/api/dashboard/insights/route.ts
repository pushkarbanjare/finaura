import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Expense } from "@/models/Expense";
import { getUserIdFromSession } from "@/lib/auth/session";

export async function GET() {
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

    const { salary = 0, goalAmount = 0, goalYear = 0 } = user;

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthExpenses = await Expense.find({
      userId,
      date: { $gte: thisMonthStart, $lte: now },
    });

    const lastMonthExpenses = await Expense.find({
      userId,
      date: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });

    const sum = (arr: any[]) =>
      arr.reduce((total, exp) => total + exp.amount, 0);

    const thisMonthSpend = sum(thisMonthExpenses);
    const lastMonthSpend = sum(lastMonthExpenses);

    const insights: string[] = [];

    // -------- Spending trend --------
    if (lastMonthSpend > 0) {
      const change = ((thisMonthSpend - lastMonthSpend) / lastMonthSpend) * 100;

      if (change > 20) {
        insights.push(
          `Your spending increased by ${change.toFixed(
            1,
          )}% compared to last month.`,
        );
      } else if (change < -20) {
        insights.push(
          `Nice! You reduced spending by ${Math.abs(change).toFixed(
            1,
          )}% compared to last month.`,
        );
      }
    }

    // -------- Category overshoot --------
    const categoryTotals: Record<string, number> = {};
    thisMonthExpenses.forEach((exp) => {
      categoryTotals[exp.category] =
        (categoryTotals[exp.category] || 0) + exp.amount;
    });

    for (const category in categoryTotals) {
      if (salary > 0 && categoryTotals[category] > salary * 0.3) {
        insights.push(
          `You spent ${((categoryTotals[category] / salary) * 100).toFixed(
            1,
          )}% of your salary on ${category}.`,
        );
      }
    }

    // -------- Savings insight --------
    const savings = salary - thisMonthSpend;
    if (savings >= 0) {
      insights.push(`You saved ₹${savings} this month. Good job!`);
    } else {
      insights.push(`You overspent this month by ₹${Math.abs(savings)}.`);
    }

    // -------- Goal insight --------
    if (goalAmount > 0 && goalYear > now.getFullYear()) {
      const yearsLeft = goalYear - now.getFullYear();
      const requiredMonthly = Math.round(goalAmount / (yearsLeft * 12));

      insights.push(
        `To achieve your goal of ₹${goalAmount} by ${goalYear}, you need to save approximately ₹${requiredMonthly} per month.`,
      );
    }

    return NextResponse.json({ insights }, { status: 200 });
  } catch (error) {
    console.error("INSIGHTS ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
