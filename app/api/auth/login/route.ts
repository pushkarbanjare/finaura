import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { loginSchema } from "@/lib/validators/auth.schema";
import { loginUser } from "@/services/auth.service";
import { AppError, RateLimitError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    // ========== client identification ==========
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    // ========== rate limit ==========
    const allowed = rateLimit(`login:${ip}`, 5, 60_000);
    if (!allowed)
      throw new RateLimitError("Too many requests, Try again later.");

    // ========== request parsing ==========
    const body = loginSchema.parse(await req.json());
    const { email, password } = body;

    // ========== auth logic ==========
    const { user, token } = await loginUser(email, password);

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          _id: user._id,
          email: user.email,
        },
      },
      { status: 200 },
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

    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
