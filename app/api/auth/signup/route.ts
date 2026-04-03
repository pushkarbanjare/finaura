import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { signupSchema } from "@/lib/validators/auth.schema";
import { signupUser } from "@/services/auth.service";
import { AppError, RateLimitError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    // ========== client identification ==========
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    // ========== rate limit ==========
    const allowed = rateLimit(`signup:${ip}`, 3, 60_000);
    if (!allowed)
      throw new RateLimitError("Too many requests, Try again later.");

    // ========== request parsing ==========
    const body = signupSchema.parse(await req.json());
    const { email, password } = body;

    // ========== auth logic ==========
    const { user: newUser, token } = await signupUser(email, password);

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

    // ========== setting cookies ==========
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    // ========== zod validation errors ==========
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 },
      );
    }

    // ========== custom app errors ==========
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("SIGNUP ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
