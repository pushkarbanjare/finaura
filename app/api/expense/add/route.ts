import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { getUserIdFromRequest } from "@/lib/auth";
import { generateCategory } from "@/lib/category";

export async function POST(req:Request) {
    try {
        await connectDB();
        const userId = getUserIdFromRequest(req);
        if(!userId) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status:401}
            );
        }

        const {amount, item, merchant, notes, date} = await req.json();
        if(!amount || !item) {
            return NextResponse.json(
                {error: "Amount and item are required"},
                {status: 400}
            );
        }

        const category = generateCategory(item, merchant || "", notes || "");

        const newExpense = await Expense.create({
            userId,
            amount,
            item,
            merchant,
            notes,
            date: date ? new Date(date) : new Date(),
            category,
        });

        return NextResponse.json(
            {message: "Expense added", expense: newExpense},
            {status: 201},
        );

    } catch (error) {
        console.error("ADD EXPENSE ERROR: ", error);
        return NextResponse.json(
            {error: "Server Error"},
            {status: 500},
        );
    }
}