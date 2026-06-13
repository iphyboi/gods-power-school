import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SchoolClass from "@/models/SchoolClass";

export async function GET() {
    try {
        await connectDB();

        // CLEAR OLD DATA
        await SchoolClass.deleteMany();

        //INSERT CLASSES
        await SchoolClass.insertMany([
            {
                name: "JSS1",
                fee: 80000,
            },

            {
                name: "JSS2",
                fee: 85000,
            },

            {
                name: "SS1",
                fee: 120000,
            },

            {
                name: "SS2",
                fee: 130000,
            },

            {
                name: "SS3",
                fee: 140000,
            },
        ]);

        return NextResponse.json({
            message: "Classes seeded successfully",
        });
    } catch (error) {
        console.log("SEED ERROR:", error);

        return NextResponse.json(
            {
                message: "Failed to seed classes",
            },
            {
                status: 500,
            }
        );
    }
}