import ExpenseClient from "./ExpenseClient";
import { getUserIdFromSession } from "@/lib/auth/session";
import { listExpense } from "@/services/expense.service";

export default async function ExpensePage() {
  const userId = await getUserIdFromSession();
  if (!userId) return null;

  const expenses = await listExpense(userId);
  return <ExpenseClient initialExpenses={expenses} />;
}
