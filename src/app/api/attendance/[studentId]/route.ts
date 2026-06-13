import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ studentId: string}>}
) {
    try {
        await connectDB();
        const { studentId } = await params;

        // fetch all attendance logs for specific student
        const records = await Attendance.find({ studentId }).sort({ date: -1 });

        if (!records || records.length === 0) {
            return NextResponse.json(
                { success: false, message: "No attendance logs found for this Student ID." },
                { status: 404 }
            );
        }

        //school analytics calculations
        const totalDays = records.length;

        //late counts as being present at school morning register
        const presentDays = records.filter(r => r.status === "Present" || r.status === "Late").length;
        const absentDays = totalDays - presentDays;

        // calculate precise attendance percentage rate
        const attendancePercentage = totalDays > 0 ? ((presentDays  / totalDays) * 100).toFixed(1) : "0.0";

        return NextResponse.json({
            success: true,
            percentage: attendancePercentage,
            total: totalDays,
            present: presentDays,
            absent: absentDays,
            records,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}