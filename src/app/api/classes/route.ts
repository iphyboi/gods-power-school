import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SchoolClass from "@/models/SchoolClass";

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const seed = searchParams.get("seed");

        // Seed classes when ?seed=true is used
        if (seed === "true") {
            await SchoolClass.deleteMany({});

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
                    name: "JSS3",
                    fee: 90000,
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
        }

        // Normal GET request — fetch classes
        const classes = await SchoolClass.find({})
            .sort({ name: 1 })
            .lean();

        return NextResponse.json({
            classes,
        });

    } catch (error) {
        console.log("GET CLASSES ERROR:", error);

        return NextResponse.json(
            {
                message: "Failed to fetch classes",
            },
            {
                status: 500,
            }
        );
    }
}