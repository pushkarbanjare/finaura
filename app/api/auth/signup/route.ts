import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { generateToken } from "@/lib/auth/jwt";
import { rateLimit } from "@/lib/security/rateLimit";
import { signupSchema } from "@/lib/validators/auth.schema";

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const allowed = rateLimit(`signup:${ip}`, 3, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Try again later." },
        { status: 429 },
      );
    }

    const body = signupSchema.parse(await req.json());
    const { email, password } = body;

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id.toString());

    const response = NextResponse.json(
      {
        message: "Signup successful",
        user: {
          _id: newUser._id,
          email: newUser.email,
        },
      },
      { status: 201 },
    );

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    }

    console.error("SIGNUP ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
