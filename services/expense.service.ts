import { generateCategory } from "@/lib/category";
import { connectDB } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { Expense } from "@/models/Expense";

// ========== add expense ==========
export async function addExpense(userId: string, data: any) {
  await connectDB();

  const { amount, item, merchant, notes, date } = data;
  const category = generateCategory(item, merchant ?? "", notes ?? "");
  const expense = await Expense.create({
    userId,
    amount,
    item,
    merchant,
    notes,
    date: date ? new Date(date) : new Date(),
    category,
  });

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

  return Expense.find({ userId }).sort({ date: -1 });
}

// ========== update expense ==========
export async function updateExpense(userId: string, data: any) {
  await connectDB();

  const { expenseId, amount, item, merchant, notes, date } = data;

  const expense = await Expense.findById(expenseId);
  if (!expense) throw new AppError("Expense not found", 404);

  if (expense.userId.toString() !== userId)
    throw new AppError("Unauthorized", 401);

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

  return expense;
}
