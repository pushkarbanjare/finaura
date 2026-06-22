import { generateCategory, buildLookupKey } from "@/lib/category";
import { connectDB } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { enqueueExpenseJob } from "@/lib/queue";
import { Category } from "@/models/Category";
import { Expense } from "@/models/Expense";

// ========== smart categorization ==========
async function getSmartCategory(
  item: string,
  merchant?: string,
  notes?: string,
) {
  const lookupKey = buildLookupKey(item, merchant);
  const existing = await Category.findOne({ lookupKey });
  if (existing) {
    return {
      category: existing.category,
      status: "COMPLETED",
      queueJob: false,
    };
  }

  const category = generateCategory(item, merchant || "", notes || "");
  if (category !== "Other") {
    await Category.create({ lookupKey, category });
    return {
      category,
      status: "COMPLETED",
      queueJob: false,
    };
  }
  return {
    category: "PROCESSING",
    status: "PROCESSING",
    queueJob: true,
  };
}

// ========== add expense ==========
export async function addExpense(userId: string, data: any) {
  await connectDB();

  const { amount, item, merchant, notes, date } = data;
  const result = await getSmartCategory(item, merchant, notes);
  const expense = await Expense.create({
    userId,
    amount,
    item,
    merchant,
    notes,
    date: date ? new Date(date) : new Date(),
    category: result.category,
    status: result.status,
  });

  if (result.queueJob) {
    await enqueueExpenseJob({
      expenseId: expense._id.toString(),
      item,
      merchant,
      notes,
    });
  }

  return expense;
}

// ========== delete expense ==========
export async function deleteExpense(userId: string, expenseId: string) {
  await connectDB();

  const expense = await Expense.findById(expenseId);
  if (!expense) throw new AppError("Expense not found", 404);

  if (expense.userId.toString() !== userId)
    throw new AppError("Unauthorized", 401);

  await expense.deleteOne();
}

// ========== list expense ==========
export async function listExpense(userId: string) {
  await connectDB();
  const expenses = await Expense.find({ userId }).sort({ date: -1 }).lean();

  return expenses.map((exp) => ({
    ...exp,
    _id: exp._id.toString(),
    userId: exp.userId.toString(),
    date: exp.date?.toISOString(),
  }));
}

// ========== update expense ==========
export async function updateExpense(userId: string, data: any) {
  await connectDB();

  const { expenseId, amount, item, merchant, notes, date } = data;
  const expense = await Expense.findById(expenseId);
  if (!expense) throw new AppError("Expense not found", 404);

  if (expense.userId.toString() !== userId)
    throw new AppError("Unauthorized", 401);

  expense.amount = amount ?? expense.amount;
  expense.item = item ?? expense.item;
  expense.merchant = merchant ?? expense.merchant;
  expense.notes = notes ?? expense.notes;
  expense.date = date ? new Date(date) : expense.date;

  await expense.save();
  return expense;
}
