import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").optional(),

  salary: z.number().nonnegative("Salary must be ≥ 0").optional(),

  goalAmount: z.number().nonnegative("Goal amount must be ≥ 0").optional(),

  goalYear: z
    .number()
    .int()
    .min(2024, "Goal year is too small")
    .max(2100, "Goal year is too large")
    .optional(),
});
