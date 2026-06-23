import { connectDB } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { Expense } from "@/models/Expense";
import { User } from "@/models/User";

// ========== monthly summary data ==========
export async function getSummaryData(
  userId: string,
  month: number,
  year: number,
) {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

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

  // ========== total saved across all time for goal progress ==========
  const allExpenses = await Expense.find({ userId }).sort({ date: 1 }).limit(1);
  const trackingStart = allExpenses[0]?.date ?? firstDay;

  const now = new Date();
  const monthsElapsed = Math.max(
    1,
    (now.getFullYear() - trackingStart.getFullYear()) * 12 +
      (now.getMonth() - trackingStart.getMonth()) +
      1,
  );

  const allTimeExpenses = await Expense.find({
    userId,
    date: { $gte: trackingStart, $lte: now },
  });
  const totalSpendAllTime = allTimeExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );
  const totalSavedAllTime = salary * monthsElapsed - totalSpendAllTime;

  return {
    month: firstDay.toLocaleString("default", { month: "long" }),
    monthNumber: month,
    year,
    salary,
    totalSpend,
    savings,
    categoryTotals,
    dailySpend,
    totalSavedAllTime,
  };
}

// ========== insight engine ==========
export async function getInsightsData(userId: string) {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

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

  const sum = (arr: any[]) => arr.reduce((total, exp) => total + exp.amount, 0);
  const thisMonthSpend = sum(thisMonthExpenses);
  const lastMonthSpend = sum(lastMonthExpenses);

  const insights: string[] = [];

  // ========== comparison ==========
  if (lastMonthSpend > 0) {
    const change = ((thisMonthSpend - lastMonthSpend) / lastMonthSpend) * 100;
    if (change > 20) {
      insights.push(
        `Your spending increased by ${change.toFixed(1)}% compared to last month.`,
      );
    } else if (change < -20) {
      insights.push(
        `Nice! You reduced spending by ${Math.abs(change).toFixed(1)}% compared to last month.`,
      );
    }
  }

  // ========== threshold alert ==========
  const categoryTotals: Record<string, number> = {};
  thisMonthExpenses.forEach((exp) => {
    categoryTotals[exp.category] =
      (categoryTotals[exp.category] || 0) + exp.amount;
  });

  for (const category in categoryTotals) {
    if (salary > 0 && categoryTotals[category] > salary * 0.3) {
      insights.push(
        `You spent ${((categoryTotals[category] / salary) * 100).toFixed(1)}% of your salary on ${category}.`,
      );
    }
  }

  // ========== savings feedback ==========
  const savings = salary - thisMonthSpend;
  if (savings >= 0) {
    insights.push(`You saved ₹${savings} this month. Good job!`);
  } else {
    insights.push(`You overspent this month by ₹${Math.abs(savings)}.`);
  }

  // ========== goal forecasting ==========
  if (goalAmount > 0 && goalYear >= now.getFullYear()) {
    const allExpenses = await Expense.find({ userId })
      .sort({ date: 1 })
      .limit(1);
    const trackingStart = allExpenses[0]?.date ?? thisMonthStart;

    const allTimeExpenses = await Expense.find({
      userId,
      date: { $gte: trackingStart, $lte: now },
    });
    const totalSpendAllTime = sum(allTimeExpenses);

    const monthsElapsed = Math.max(
      1,
      (now.getFullYear() - trackingStart.getFullYear()) * 12 +
        (now.getMonth() - trackingStart.getMonth()) +
        1,
    );

    const totalSalaryEarned = salary * monthsElapsed;
    const totalSavedSoFar = totalSalaryEarned - totalSpendAllTime;

    const remainingGoal = Math.max(0, goalAmount - totalSavedSoFar);

    const goalEndDate = new Date(goalYear, 11, 31);
    const monthsLeft = Math.max(
      1,
      (goalEndDate.getFullYear() - now.getFullYear()) * 12 +
        (goalEndDate.getMonth() - now.getMonth()),
    );

    if (remainingGoal <= 0) {
      insights.push(
        `Congratulations! You've already reached your savings goal of ₹${goalAmount}.`,
      );
    } else {
      const requiredMonthly = Math.round(remainingGoal / monthsLeft);
      insights.push(
        `You've saved ₹${totalSavedSoFar} so far. To reach your goal of ₹${goalAmount} by ${goalYear}, you need to save approximately ₹${requiredMonthly} per month for the remaining ${monthsLeft} months.`,
      );
    }
  }
  return { insights };
}
