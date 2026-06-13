import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";

export async function POST(request: Request) {
    try {
        // establish database connection
        await connectDB();

        // extract payload data element
        const body = await request.json();
        const { studentId, date, status, remarks } = body;

        // simple backend protection fallback
        if (!studentId || !date || !status) {
          return NextResponse.json(
            { success: false, message: "Missing required register fields." },
            { status: 400 }
          );
        }

        // create and save the new record
        const newRecord = await Attendance.create({
            studentId: studentId.trim(),
            date: new Date(date),
            status,
            remarks: remarks ? remarks.trim() : "",
        });

        return NextResponse.json({
            success: true,
            message: "Attendance entry logged successfully!",
            data: newRecord,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal server error stat" },
            { status: 500 }
        );
    }
}