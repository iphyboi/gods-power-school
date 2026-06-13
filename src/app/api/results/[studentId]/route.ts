import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Result from "@/models/Result";

export async function GET(
    req: Request,
    context: { params: Promise<{ studentId: string}>}
) {
    try {
        await connectDB();

        const { studentId } = await context.params;
        if (!studentId) {
            return NextResponse.json({ message: "Student ID is requested" }, { status: 400 });
        }

        const result = await Result.findOne({ studentId: studentId });

        if (!result) {
            return NextResponse.json({ message: "Result not found" }, { status: 404 });
        }

        return NextResponse.json(
            result
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Failed to fetch result" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ studentId: string }> }
) {
    try {
        await connectDB();
        const { studentId } = await context.params;

        const deletedResult = await Result.findByIdAndDelete(studentId);

        if (!deletedResult) {
            return NextResponse.json({ message: "Result not found" }, { status: 404});
        }

        return NextResponse.json({ message: "Result deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to delete result" }, { status: 500 });
    }
}