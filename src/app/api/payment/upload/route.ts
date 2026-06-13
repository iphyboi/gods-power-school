import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import Payment from "@/models/Payment";
import Student from "@/models/Student";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        // extract the extra fields sent by the parent form
        const studentIdInput = formData.get("studentId") as string;
        const totalFee = Number(formData.get("totalFee") || 0);
        const amountPaid = Number(formData.get("amountPaid") || 0);
        const session = formData.get("session") as string
        const term = formData.get("term") as string

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

            const studentRecord = await Student.findOne({ studentId: studentIdInput });

            if (!studentRecord) {
                return NextResponse.json(
                    { error: `No student registered with ID: "${studentIdInput}". Please check your entry.`},
                    { status: 404 }
                );
            }
        

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResponse = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: "auto", folder: "payments" }, 
                (error, result) => {
                if (error) reject(error);
                 else resolve(result);
                 }
                
            ).end(buffer);
        });
        const receiptUrl = uploadResponse.secure_url

        //calculate financial balance and status
        const balance = totalFee - amountPaid;
        let status = "Unpaid";
        if (amountPaid >= totalFee && totalFee > 0) {
            status = "Paid";
        } else if (amountPaid > 0 && amountPaid < totalFee) {
            status = "Part Payment";
        } else {
            status = "Unpaid";
        }
        
        // save record to mongoose
        const newPayment = await Payment.create({
            studentId : studentRecord._id,
            totalFee,
            amountPaid,
            balance,
            status,
            PaymentMethod: "Bank Transfer",
            session,
            term,
            receiptUrl
        });

        return NextResponse.json({
            message: "payment receipt received and recorded successfully!", payment: newPayment },
            { status: 201}
        );

    } catch (error: any) {
        console.error("Upload Route Crash:", error);
        return NextResponse.json({ error: error.message}, { status: 500 });
    }
}