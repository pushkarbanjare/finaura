import { model, models, Schema } from "mongoose";

// ========== schema definition of Category table ==========
const CategorySchema = new Schema(
  {
    lookupKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// ========== model defintion with serverless fix ==========
export const Category = models.Category || model("Category", CategorySchema);
