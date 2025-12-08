import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(req:Request) {
    try {
        await connectDB();
        const userId = getUserIdFromRequest(req);
        if(!userId) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const expenses = await Expense.find({userId}).sort({date: -1});

        return NextResponse.json({expenses}, {status: 200});
    } catch (error) {
        console.error("LIST EXPENSE ERROR: ", error);
        return NextResponse.json({error: "Server Error"}, {status: 500});
    }
}