export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Student from "@/models/Student";
import SchoolClass from "@/models/SchoolClass";

export async function POST(req: Request) {
  console.log("STUDENT REGISTRATION HIT");

  try {
    await connectDB();

    const body = await req.json();

    if (!body.fullName?.trim()) {
      return NextResponse.json(
        { message: "Student name is required." },
        { status: 400 }
      );
    }

    if (!body.class) {
      return NextResponse.json(
        { message: "Student class is required." },
        { status: 400 }
      );
    }

    if (!body.gender) {
      return NextResponse.json(
        { message: "Student gender is required." },
        { status: 400 }
      );
    }

    // Make sure the selected class exists.
    const foundClass = await SchoolClass.findOne({
      name: {
        $regex: new RegExp(`^${body.class}$`, "i"),
      },
    });

    if (!foundClass) {
      return NextResponse.json(
        {
          message: `Class '${body.class}' does not exist in database settings.`,
        },
        { status: 404 }
      );
    }

    // Generate Student ID
    let generatedStudentId = "";
    let studentIdExists = true;

    while (studentIdExists) {
      const uniqueNumber = Math.floor(
        1000 + Math.random() * 9000
      );

      generatedStudentId = `STU-${uniqueNumber}`;

      const existingStudent =
        await Student.findOne({
          studentId: generatedStudentId,
        });

      studentIdExists = !!existingStudent;
    }

    // NEW STUDENTS START WITH ZERO FEES
    const totalFee = 0;
    const amountPaid = 0;
    const balance = 0;
    const status = "Unpaid";

    const currentYear = new Date().getFullYear();
    const currentSession = `${currentYear}/${currentYear + 1}`;

    const newStudent = await Student.create({
      studentId: generatedStudentId,

      fullName: body.fullName.trim(),

      class: body.class,

      gender: body.gender,

      stream: body.stream || "General",

      department: body.department || "",

      session: currentSession,

      totalFee,

      amountPaid,

      balance,

      status,

      dateOfBirth: body.dateOfBirth || "",

      parentName: body.parentName || "",

      parentPhone: body.parentPhone || "",

      address: body.address || "",

      academicHistory: [],

      isActive: true,
    });

    return NextResponse.json(
      {
        message: "Student added successfully!",
        studentId: newStudent.studentId,
        student: newStudent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE STUDENT ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to add student.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const students = await Student.find({}).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      students,
    });
  } catch (error) {
    console.error(
      "FETCH STUDENTS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch students.",
      },
      { status: 500 }
    );
  }
}