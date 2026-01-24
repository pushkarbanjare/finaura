import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getUserIdFromSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/security/rateLimit";
import { updateProfileSchema } from "@/lib/validators/profile.schema";
import { ZodError } from "zod";

export async function PUT(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const allowed = rateLimit(`profile:update:${ip}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many profile updates. Try again later." },
        { status: 429 },
      );
    }

    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = updateProfileSchema.parse(await req.json());
    const { name, salary, goalAmount, goalYear } = body;

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name ?? undefined,
        salary: salary ?? undefined,
        goalAmount: goalAmount ?? undefined,
        goalYear: goalYear ?? undefined,
      },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Profile updated",
        profile: {
          name: updatedUser.name ?? "",
          salary: updatedUser.salary ?? 0,
          goalAmount: updatedUser.goalAmount ?? 0,
          goalYear: updatedUser.goalYear ?? 0,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    console.error("PROFILE UPDATE ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
