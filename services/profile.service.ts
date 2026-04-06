import { connectDB } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { User } from "@/models/User";

// ========== get profile ==========
export async function getProfile(userId: string) {
  await connectDB();

  const user = await User.findById(userId).select("-password").lean();
  if (!user) throw new AppError("User not found", 404);

  return {
    name: user.name ?? "",
    salary: user.salary ?? 0,
    goalAmount: user.goalAmount ?? 0,
    goalYear: user.goalYear ?? 0,
    email: user.email,
  };
}

// ========== update profile ==========
export async function updateProfile(userId: string, data: any) {
  await connectDB();

  const { name, salary, goalAmount, goalYear } = data;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      name: name ?? undefined,
      salary: salary ?? undefined,
      goalAmount: goalAmount ?? undefined,
      goalYear: goalYear ?? undefined,
    },
    { new: true },
  )
    .select("-password")
    .lean();

  if (!updatedUser) throw new AppError("User not found", 404);

  return {
    name: updatedUser.name ?? "",
    salary: updatedUser.salary ?? 0,
    goalAmount: updatedUser.goalAmount ?? 0,
    goalYear: updatedUser.goalYear ?? 0,
  };
}
