import { NextRequest,NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/models/Payment";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string}>}
) {
    try {
        await connectDB();
        const resolvedParams = await params
        const id = resolvedParams.id;
        const deletedPayment = await Payment.findByIdAndDelete(id);

        if (!deletedPayment) {
            return NextResponse.json({ error: "Payment record not found" }, { status: 404});
        }

        return NextResponse.json({ message: "Record deleted successfully" }, { status: 200});
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "An internal error occurred during entrt" },
             { status:500}
            );
    }
}