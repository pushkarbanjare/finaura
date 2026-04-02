import { generateToken } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db";
import { AuthError } from "@/lib/errors";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function loginUser(email:string, password:string) {
    await connectDB();

    const user = await User.findOne({email});
    if(!user) throw new AuthError();

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new AuthError();

    const token = generateToken(user._id.toString());
    
    return {user, token};
}