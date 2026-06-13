import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Result from "@/models/Result";

// GET RESULTS
export async function GET() {
    try {
        await connectDB();
        const results = await Result.find().sort({
        createdAt: -1,
        });

        return NextResponse.json(results);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json(
            { message: "Failed to fetch results" },
            { status: 500 }
        );
    }
}

//CREATE RESULT
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const result = await Result.create(body);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json(
            { message: "Failed to create result" },
            { status: 500 }
        );
    }
}