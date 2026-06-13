import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { email, password } = body;

        // check if user exists
        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 400 }
            );
        }

        // check password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 400 }
            );
        }

        // create token
        const token = Jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET || "secretkey",
            {expiresIn: "1d"}
        );

        // send response
        return NextResponse.json({
            token,
            user: {
                emails: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Login Failed" },
            { status: 500}
        );
    }
}