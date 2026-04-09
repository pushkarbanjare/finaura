import { z } from "zod";

// ========== add expense validation schema ==========
export const addExpenseSchema = z.object({
  amount: z.number().positive(),
  item: z.string().min(1),
  merchant: z.string().optional(),
  notes: z.string().optional(),
  date: z.string().optional(),
});

// ========== update expense validation schema ==========
export const updateExpenseSchema = z.object({
  expenseId: z.string().min(1),
  amount: z.number().positive().optional(),
  item: z.string().optional(),
  merchant: z.string().optional(),
  notes: z.string().optional(),
  date: z.string().optional(),
});
