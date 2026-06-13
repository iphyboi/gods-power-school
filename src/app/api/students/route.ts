import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Student from "@/models/Student";
import SchoolClass from "@/models/SchoolClass";

export async function POST(req: Request) {
    console.log("STUDENT REGISTRATION HIT");
    
    try {
        await connectDB();
        const body = await req.json();
        console.log("BODY RECEIVED:", body);

        // FIND CLASS
        const foundClass = await SchoolClass.findOne({
            name: { $regex: new RegExp(`^${body.class}$`, "i") },
        });

        if (!foundClass) {
            return NextResponse.json(
                { message: `Class '${body.class}' does not exist in database settings.` },
                { status: 404 }
            );
        }

        //GENERATE A CLEAN UNIQUE STUDENT ID NUMBER
        const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
        const generatedStudentId = `STU-${uniqueNumber}`;


        // GET CLASS FEE
        const totalFee = foundClass.fee;

        //calculate the current academic session automatically
        const currentYear = new Date().getFullYear();
        const currentSession = `${currentYear}/${currentYear + 1}`;

        //PAYMENT LOGIC
        const amountPaid = 0;

        const balance = totalFee - amountPaid;

        let status = "Unpaid";

        if (
            amountPaid >= totalFee
        ) {
            status = "Paid";
        } else if (
            amountPaid > 0
        ) {
            status = "Part Payment";
        }

        //CREATE STUDENT
        const newStudent = await Student.create({
            studentId: generatedStudentId,
            fullName: body.fullName,
            class: body.class,
            gender: body.gender,
            totalFee: body.totalFee || totalFee,
            amountPaid: 0,
            balance,
            status: "Unpaid",
            department: body.department,
            session: currentSession,
            isActive: true,

            // optional fields
            dateOfBirth: "",
            parentName: "",
            parentPhone: "",
            address: "",
        });

        return NextResponse.json(
            {
            message: "Student added successfully!",
            studentId: newStudent.studentId
            },
            { status: 201 }
        );

    } catch (error) {
        console.log("POST ERROR:", error);

        return NextResponse.json(
            { message: "Failed to add student", error: String(error) },
            { status: 500 }
        );
    }
}


{/* GET STUDENTS */}
export async function GET() {
    try {
        await connectDB();
        const students = await Student.find({});

        return NextResponse.json({
            students,
    });
    } catch (error) {
        console.log("GET ERROR:", error);

        return NextResponse.json(
            { message: "Failed to fetch students" },
            { status: 500 }
        );
    }
}

