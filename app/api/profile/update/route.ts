import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getUserIdFromRequest } from "@/lib/auth";

export async function PUT(req:Request) {
    try {
        await connectDB();
        const userId = getUserIdFromRequest(req);
        if(!userId) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const {name, salary, goalAmount, goalYear} = await req.json();
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name: name ?? undefined,
                salary: salary ?? undefined,
                goalAmount: goalAmount ?? undefined,
                goalYear: goalYear ?? undefined,
            },
            {new: true},
        ).select("-password");

        return NextResponse.json(
            {message: "Profile updated", profile: updatedUser},
            {status: 200},
        );
    } catch (error) {
        console.error("PROFILE UPDATE ERROR: ", error);
        return NextResponse.json({error: "Server Error"}, {status: 500});
    }
}