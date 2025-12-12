import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name || "",
      salary: user.salary || 0,
      goalAmount: user.goalAmount || 0,
      goalYear: user.goalYear || 0,
    });
  } catch (error) {
    console.error("PROFILE GET ERROR: ", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
