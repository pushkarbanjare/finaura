import { model, models, Schema } from "mongoose";

// ========== schema definition of Category table ==========
const CategorySchema = new Schema(
  {
    keyword: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
    },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: false },
);

// ========== model defintion with serverless fix ==========
export const Category = models.Category || model("Category", CategorySchema);
