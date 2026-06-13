import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/models/Payment";
import cloudinary from "@/lib/cloudinary";

/* CREATE PAYMENT */
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        const {
            studentId,
            totalFee,
            amountPaid,
            paymentMethod,
            session,
            term,
        } = body;

        // validation check
        if (!studentId || !totalFee) {
            return NextResponse.json(
                { message: "Missing required fields: studentId or totalFee" },
                { status: 400}
            );
        }

        /* CALCULATE BALANCE */
        let status = "Unpaid";
        const balance = totalFee - amountPaid;
        if (balance === 0) {
            status = "Paid";
        } else if (amountPaid > 0) {
            status ="Part Payment";
        }

        // save to database
        const payment = await Payment.create({
            studentId,
            totalFee,
            amountPaid,
            balance,
            status,
            paymentMethod,
            session,
            term,
            receiptUrl: "",
        });

        return NextResponse.json({
            message: "Payment recorded successfully",
            payment,
        });
    } catch (error) {
        console.log("POST Payment Error:", error);
        return NextResponse.json(
            { message: "Failed to record payment" },
            { status: 500 }
        );
    }
}

/* GET PAYMENT */
export async function GET () {
    try {
        await connectDB();

           // fetches payments and populates the link student record info
        const payments = await Payment.find()
        .populate("studentId")
        .sort({ createdAt: -1 });

        return NextResponse.json(payments);
    } catch (error: any) {
        console.error("GET API Error:", error);

        return NextResponse.json(
            { message: "Failed to fetch payments" },
            { status: 500 }
        );
    }
}