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

        const {salary, goalAmount, goalYear} = user;

        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth()-1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const thisMonth = await Expense.find({
            userId,
            date: {$gte: thisMonthStart, $lte: now},
        });
        const lastMonth = await Expense.find({
            userId,
            date: {$gte: lastMonthStart, $lte: lastMonthEnd},
        });

        const sum = (arr: any[]) => arr.reduce((s,e) => s+e.amount, 0);
        const thisMonthSpend = sum(thisMonth);
        const lastMonthSpend = sum(lastMonth);

        const insights: string[] = [];

        // Spending comparision
        if(lastMonthSpend>0) {
            const change = ((thisMonthSpend-lastMonthSpend)/lastMonthSpend)*100;
            if(change>20) {
                insights.push(`Your spending increased by ${change.toFixed(1)}% compared to last month.`);
            }
            else if(change<-20) {
                insights.push(`Great! You reduced your spending by ${Math.abs(change).toFixed(1)}% compared to last month.`);
            }
        }

        // Overspending category
        const catTotals: Record<string, number> = {};
        thisMonth.forEach((exp) => {
            if (!catTotals[exp.category]) {
                catTotals[exp.category] = 0;
            }
            catTotals[exp.category] += exp.amount;
        });
        for(const cat in catTotals) {
            if(salary>0 && catTotals[cat]>salary*0.30) {
                insights.push(`You spent ${((catTotals[cat]/salary)*100).toFixed(1)}% of your salary on ${cat}.`);
            }
        }

        // Savings insight
        const savings = salary-thisMonthSpend;
        if(savings>0) {
            insights.push(`You saved ₹${savings} this month. Good job!`);
        }
        else {
            insights.push(`You overspent this month by ₹${Math.abs(savings)}.`);
        }

        // Goal progress
        if(goalAmount>0 && goalYear>now.getFullYear()) {
            const yearsLeft = goalYear-now.getFullYear();
            const requiredMonthly = Math.round(goalAmount/(yearsLeft*12));
            insights.push(`To reach your goal of ₹${goalAmount} by ${goalYear}, save at least ₹${requiredMonthly} every month.`);
        }

        return NextResponse.json({insights}, {status: 200});
    } catch (error) {
        console.error("INSIGHTS ERROR: ", error);
        return NextResponse.json({error: "Server Error"}, {status: 500});
    }
}