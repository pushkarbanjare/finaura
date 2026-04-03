import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    salary: { type: Number, default: 0 },
    goalAmount: { type: Number, default: 0 },
    goalYear: { type: Number, default: 0 },
  },
  { timestamps: false },
);

export const User = models.User || model("User", UserSchema);
