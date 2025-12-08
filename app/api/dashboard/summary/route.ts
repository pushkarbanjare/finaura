import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Expense } from "@/models/Expense";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(req:Request) {
    try {
        await connectDB();
        const userId = getUserIdFromRequest(req);
        if(!userId) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const user = await User.findById(userId);
        if(!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const salary = user.salary || 0;
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth()+1, 0);

        const expenses = await Expense.find({
            userId,
            date: {$gte: firstDay, $lte: lastDay},
        });

        const totalSpend = expenses.reduce((sum,e) => sum+e.amount, 0);

        const categoryTotals: Record<string, number> = {};
        expenses.forEach((exp) => {
            if(!categoryTotals[exp.category]) {
                categoryTotals[exp.category] = 0;
            }
            categoryTotals[exp.category] += exp.amount;
        });

        const savings = salary-totalSpend;

        return NextResponse.json(
            {
                month: now.toLocaleString("default", {month: "long"}),
                salary,
                totalSpend,
                savings,
                categoryTotals,
            }, {status: 200},
        );
    } catch (error) {
        console.error("DASHBOARD SUMMARY ERROR: ", error);
        return NextResponse.json({error: "Server Error"}, {status: 500});
    }
}