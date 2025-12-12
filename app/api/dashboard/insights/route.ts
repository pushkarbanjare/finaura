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

    const { salary, goalAmount, goalYear } = user;

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonth = await Expense.find({
      userId,
      date: { $gte: thisMonthStart, $lte: now },
    });

    const lastMonth = await Expense.find({
      userId,
      date: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });

    const sum = (arr: any[]) => arr.reduce((s, e) => s + e.amount, 0);
    const thisMonthSpend = sum(thisMonth);
    const lastMonthSpend = sum(lastMonth);

    const insights: string[] = [];

    // -------- SPENDING TREND --------
    if (lastMonthSpend > 0) {
      const change = ((thisMonthSpend - lastMonthSpend) / lastMonthSpend) * 100;
      if (change > 20) {
        insights.push(
          `Your spending increased by ${change.toFixed(
            1
          )}% compared to last month.`
        );
      } else if (change < -20) {
        insights.push(
          `Nice! You reduced spending by ${Math.abs(change).toFixed(
            1
          )}% compared to last month.`
        );
      }
    }

    // -------- CATEGORY OVERSHOOT --------
    const catTotals: Record<string, number> = {};
    thisMonth.forEach((exp) => {
      catTotals[exp.category] = (catTotals[exp.category] || 0) + exp.amount;
    });

    for (const cat in catTotals) {
      if (salary > 0 && catTotals[cat] > salary * 0.3) {
        insights.push(
          `You spent ${((catTotals[cat] / salary) * 100).toFixed(
            1
          )}% of your salary on ${cat}.`
        );
      }
    }

    // -------- SAVINGS INSIGHT --------
    const savings = salary - thisMonthSpend;
    if (savings > 0) {
      insights.push(`You saved ₹${savings} this month. Good job!`);
    } else {
      insights.push(`You overspent this month by ₹${Math.abs(savings)}.`);
    }

    // -------- GOAL + ROI INSIGHTS --------
    if (goalAmount > 0 && goalYear > now.getFullYear()) {
      const yearsLeft = goalYear - now.getFullYear();
      const requiredMonthly = Math.round(goalAmount / (yearsLeft * 12));

      insights.push(
        `To achieve your goal of ₹${goalAmount} by ${goalYear}, you need to save approximately ₹${requiredMonthly} per month.`
      );

      // If user has salary defined
      if (salary > 0) {
        const currentMonthlySavings = Math.max(salary - thisMonthSpend, 0);
        const annualSavings = currentMonthlySavings * 12;

        // Avoid divide by zero
        if (annualSavings > 0) {
          const requiredROI = (goalAmount / (annualSavings * yearsLeft)) * 100;

          if (requiredROI < 6) {
            insights.push(
              `You can reach your goal with a low-risk plan targeting around ${requiredROI.toFixed(
                1
              )}% annual return.`
            );
          } else if (requiredROI < 12) {
            insights.push(
              `A moderate investment plan with about ${requiredROI.toFixed(
                1
              )}% annual return is required to reach your goal.`
            );
          } else {
            insights.push(
              `To reach your goal, you need around ${requiredROI.toFixed(
                1
              )}% annual return — this requires an aggressive investment strategy or higher monthly savings.`
            );
          }
        }
      }
    }

    return NextResponse.json({ insights }, { status: 200 });
  } catch (error) {
    console.error("INSIGHTS ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
