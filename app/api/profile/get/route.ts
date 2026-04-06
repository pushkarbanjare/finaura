import { NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import { getProfile } from "@/services/profile.service";

export async function GET() {
  try {
    // ========== auth ==========
    const userId = await getUserIdFromSession();
    if (!userId) throw new AppError("Unauthorized", 401);

    // ========== get profile logic ==========
    const profile = await getProfile(userId);

    return NextResponse.json(profile, { status: 200 });
  } catch (error: any) {
    // ========== custom app errors ==========
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("PROFILE GET ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
