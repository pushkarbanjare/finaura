import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { generateToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(req:Request) {
    try {
        await connectDB();
        
        const {email, password} = await req.json();
        if(!email || !password) {
            return NextResponse.json(
                {error: "Email and password are required"},
                {status: 400},
            );
        }

        const existingUser = await User.findOne({email});
        if(existingUser) {
            return NextResponse.json(
                {error: "Email already exists"},
                {status: 400},
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({email, password: hashedPassword});

        const token = generateToken(newUser._id.toString());

        return NextResponse.json(
            {
                message: "Signup successful",
                token,
                user: {
                    _id: newUser._id,
                    email: newUser.email,
                },
            }, {status: 201}
        );
    } catch (error) {
        console.error("SIGNUP ERROR: ", error);
        return NextResponse.json(
            {error: "Server Error"},
            {status: 500},
        );
    }
}