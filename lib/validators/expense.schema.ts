import { z } from "zod";

export const addExpenseSchema = z.object({
  amount: z.number().positive(),
  item: z.string().min(1),
  merchant: z.string().optional(),
  notes: z.string().optional(),
  date: z.string().optional(),
});

export const updateExpenseSchema = z.object({
  expenseId: z.string().min(1),
  amount: z.number().positive().optional(),
  item: z.string().optional(),
  merchant: z.string().optional(),
  notes: z.string().optional(),
  date: z.string().optional(),
});
