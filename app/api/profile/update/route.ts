import { NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/security/rateLimit";
import { updateProfileSchema } from "@/lib/validators/profile.schema";
import { ZodError } from "zod";
import { AppError, RateLimitError } from "@/lib/errors";
import { updateProfile } from "@/services/profile.service";

export async function PUT(req: Request) {
  try {
    // ========== client identification ==========
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    // ========== rate limit ==========
    const allowed = rateLimit(`profile:update:${ip}`, 10, 60_000);
    if (!allowed)
      throw new RateLimitError("Too many profileupdates, Try again later.");

    // ========== auth ==========
    const userId = await getUserIdFromSession();
    if (!userId) throw new AppError("Unauthorized", 401);

    // ========== request parsing ==========
    const body = updateProfileSchema.parse(await req.json());

    // ========== update profile logic ==========
    const profile = updateProfile(userId, body);

    return NextResponse.json(
      { message: "Profile updated", profile },
      { status: 200 },
    );
  } catch (error: any) {
    // ========== zod validation errors ==========
    if (error instanceof ZodError) {
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

    console.error("PROFILE UPDATE ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
