export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await connectDB();

        const existing = await User.findOne({
            email: process.env.ADMIN_EMAIL,
        });

        if (existing) {
            return NextResponse.json({
                message: "Admin already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

        await User.create({
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin"
        });
            return NextResponse.json({ message: "Admin created successfully"});
        
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating admin" },
            { status: 500 }
        );
    }
}