import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { getUserIdFromRequest } from "@/lib/auth";
import { generateCategory } from "@/lib/category";

export async function PUT(req:Request) {
    try {
        await connectDB();
        const userId = getUserIdFromRequest(req);
        if(!userId) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        
        const {expenseId, amount, item, merchant, notes, date} = await req.json();
        if(!expenseId) {
            return NextResponse.json({error: "ExpenseId is required"}, {status: 400});
        }
        
        const expense = await Expense.findById(expenseId);
        if(!expense) {
            return NextResponse.json({error: "Not found"}, {status: 404});
        }

        if(expense.userId.toString() !== userId) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        let category = expense.category;
        if (item || merchant || notes) {
            category = generateCategory(item || expense.item, merchant || expense.merchant, notes || expense.notes);
        }
        expense.amount = amount ?? expense.amount;
        expense.item = item ?? expense.item;
        expense.merchant = merchant ?? expense.merchant;
        expense.notes = notes ?? expense.notes;
        expense.date = date ? new Date(date) : expense.date;
        expense.category = category;

        await expense.save();

        return NextResponse.json(
            {message: "Expense updated: ", expense},
            {status: 200},
        );
    } catch (error) {
        console.error("UPDATE EXPENSE ERROR: ", error);
        return NextResponse.json({error: "Server Error"}, {status: 500});
    }
}