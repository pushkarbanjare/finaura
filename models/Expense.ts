import mongoose, { model, models, Schema } from "mongoose";

// ========== schema definition of Expense table ==========
const ExpenseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    item: { type: String, required: true },
    merchant: { type: String, default: "" },
    notes: { type: String, default: "" },
    date: { type: Date, default: Date.now() },
    category: { type: String, default: "Uncategorized" },
  },
  { timestamps: false },
);

// ========== model defintion with serverless fix ==========
export const Expense = models.Expense || model("Expense", ExpenseSchema);
