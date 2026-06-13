import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Student from "@/models/Result";

// GET SINGLE STUDENT
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }>}
    
) {
    try {
        await connectDB();
        const resolvedPrams = await params;

        const student = await Student.findById(
            resolvedPrams.id
        );

        if (!student) {
            return NextResponse.json(
                {
                    message: "Student not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            student,
        });
    } catch (error) {
        console.log("GET ONE ERROR:", error);

        return NextResponse.json(
            {
                message: "Failed to fetch student",
            },
            { status: 500}
        );
    }
}

// UPDATE STUDENT
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string}>}
    
) {
    try {
        await connectDB();

        // AWAIT THE PARAMETER TO EXTRACT THE ID SAFELY
        const resolvedPrams = await params;
        const studentId = resolvedPrams.id;

        const body = await req.json();
        console.log("UPDATE BODY:", body);

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            {
                name: body.name,
                class: body.class,
                gender: body.gender,
                amountPaid: body.amountPaid,
                balance: body.balance,
                status: body.status,
                stream: body.stream,
            },
            {
                returnDocument: "after"
            }
        );
        console.log("UPDATED STUDENT:", updatedStudent);

        if (!updatedStudent) {
            return NextResponse.json(
                { message: "Student record not found in database" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Student updated successfully",
                updatedStudent,
            }
        );

        } catch (error) {
            console.log("UPDATE ERROR:", error);

            return NextResponse.json(
                {
                    message: "Failed to update student",
                },
                {
                    status: 500,
                }
            );
        }
    }

        // DELETE STUDENT
        export async function DELETE(
            req: Request,
            { params }: { params: Promise<{id: string}>}
            
        ) {
            try {
                const { id } = await params;
                await connectDB();
                await Student.findByIdAndDelete(
                    id
                );

                return NextResponse.json(
                    {
                        message: "Student deleted successfully",
                    }
                );
            } catch (error) {
                console.log("DELETE ERROR:", Error);

                return NextResponse.json(
                    {
                        message: "Failed to delete student",
                    },
                    {
                        status: 500,
                    }
                );
        
            }
        }
    
