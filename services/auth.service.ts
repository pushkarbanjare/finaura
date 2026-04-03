import { generateToken } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db";
import { AppError, AuthError } from "@/lib/errors";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

// ========== business logic of login route ==========
export async function loginUser(email: string, password: string) {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) throw new AuthError();

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AuthError();

  const token = generateToken(user._id.toString());

  return { user, token };
}

// ========== business logic of signup route ==========
export async function signupUser(email: string, password: string) {
  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("Email already exists", 400);

  const hashedPassword = await bcrypt.hash(password, 8);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  const token = generateToken(newUser._id.toString());

  return { user: newUser, token };
}
