import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Student from "@/models/Student";
import Payment from "@/models/Payment";
import Result from "@/models/Result";
import SchoolClass from "@/models/SchoolClass";

export async function GET(){
    try {
        await connectDB();

        // count total registered students
        const totalStudents = await Student.countDocuments({});

        // sum up all payments
        const paymentsRecords = await Payment.find({});
        const totalPayments = paymentsRecords.reduce((sum, record) => {

            // safely check for payment amount fields in your schema
            const amount = parseFloat(record.amountPaid)
            return sum + amount;
        }, 0);

        //count total uploaded results
        const totalResults = await Result.countDocuments({});

        // count total classes configured in the school portal
        const totalClasses = await SchoolClass.countDocuments({});

        return NextResponse.json({
            totalStudents,
            totalPayments,
            totalResults,
            totalClasses
        }, { status: 200 })
    } catch (error) {
        console.error("Dashboard stats Database Error:", error);
        return NextResponse.json({ message: "Failed to load real-time metrics" }, { status: 500});
    }
}