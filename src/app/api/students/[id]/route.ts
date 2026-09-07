import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Student from "@/models/Student";

// ============================================
// GET SINGLE STUDENT
// ============================================
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await params;

    const studentId = resolvedParams.id;

    const student = await Student.findById(studentId).lean();

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

    // Support older records where General
    // may have been stored in department.
    const normalizedStudent = {
      ...student,
      stream:
        student.stream ||
        (student.department === "General"
          ? "General"
          : "General"),
    };

    return NextResponse.json({
      student: normalizedStudent,
    });
  } catch (error) {
    console.error("GET ONE STUDENT ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch student",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================
// PATCH STUDENT
// ============================================
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await params;

    const studentId = resolvedParams.id;

    const body = await req.json();

    console.log("PATCH BODY:", body);

    // ==========================================
    // BUILD ONLY PROVIDED FIELDS
    // ==========================================
    const updates: Record<string, unknown> = {};

    if (body.name !== undefined) {
      updates.fullName = body.name;
    }

    if (body.fullName !== undefined) {
      updates.fullName = body.fullName;
    }

    if (body.studentId !== undefined) {
      updates.studentId = body.studentId;
    }

    if (body.class !== undefined) {
      updates.class = body.class;
    }

    if (body.gender !== undefined) {
      updates.gender = body.gender;
    }

    if (body.stream !== undefined) {
      updates.stream = body.stream;
    }

    if (body.department !== undefined) {
      updates.department = body.department;
    }

    if (body.totalFee !== undefined) {
      updates.totalFee = body.totalFee;
    }

    if (body.amountPaid !== undefined) {
      updates.amountPaid = body.amountPaid;
    }

    if (body.balance !== undefined) {
      updates.balance = body.balance;
    }

    if (body.status !== undefined) {
      updates.status = body.status;
    }

    if (body.session !== undefined) {
      updates.session = body.session;
    }

    if (body.dateOfBirth !== undefined) {
      updates.dateOfBirth = body.dateOfBirth;
    }

    if (body.parentName !== undefined) {
      updates.parentName = body.parentName;
    }

    if (body.parentPhone !== undefined) {
      updates.parentPhone = body.parentPhone;
    }

    if (body.address !== undefined) {
      updates.address = body.address;
    }

    if (body.isActive !== undefined) {
      updates.isActive = body.isActive;
    }

    // ==========================================
    // PREVENT EMPTY PATCH
    // ==========================================
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          message: "No fields provided for update",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // UPDATE STUDENT
    // ==========================================
    const updatedStudent =
      await Student.findByIdAndUpdate(
        studentId,
        {
          $set: updates,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedStudent) {
      return NextResponse.json(
        {
          message:
            "Student record not found in database",
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "UPDATED STUDENT:",
      updatedStudent
    );

    return NextResponse.json(
      {
        message: "Student updated successfully",
        updatedStudent,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("PATCH STUDENT ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to update student",
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================
// DELETE STUDENT
// ============================================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await params;

    const studentId = resolvedParams.id;

    const deletedStudent =
      await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return NextResponse.json(
        {
          message:
            "Student ID not found in database",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Student deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);

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