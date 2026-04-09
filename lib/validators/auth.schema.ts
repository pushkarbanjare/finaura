import { z } from "zod";

// ========== login validation schema ==========
export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

// ========== signup validation schema ==========
export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
