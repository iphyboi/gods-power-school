import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Student from "@/models/Student";

const promotionMap: Record<string, string> = {
  JSS1: "JSS2",
  JSS2: "JSS3",
  JSS3: "SS1",
  SS1: "SS2",
  SS2: "SS3",
};

function getNextSession(session: string) {
  const match = session.match(/^(\d{4})\/(\d{4})$/);

  if (!match) {
    const currentYear = new Date().getFullYear();

    return `${currentYear}/${currentYear + 1}`;
  }

  const startYear = Number(match[1]);

  return `${startYear + 1}/${startYear + 2}`;
}

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json(
        {
          message: "Student not found",
        },
        { status: 404 }
      );
    }

    if (!student.isActive) {
      return NextResponse.json(
        {
          message: "This student is no longer active.",
        },
        { status: 400 }
      );
    }

    const currentClass =
      student.class?.trim().toUpperCase();

    /*
     * SS3 students graduate.
     * Their final academic record is saved
     * before making them inactive.
     */
    if (currentClass === "SS3") {
      student.academicHistory.push({
        session: student.session,
        class: student.class,
        stream: student.stream || "General",

        totalFee: student.totalFee || 0,
        amountPaid: student.amountPaid || 0,
        balance: student.balance || 0,

        status: student.status || "Unpaid",

        promotionStatus: "Graduated",

        promotedAt: new Date(),
      });

      student.isActive = false;

      await student.save();

      return NextResponse.json({
        message: `${student.fullName} has completed SS3 and has been marked as graduated.`,
        student,
      });
    }

    const nextClass = promotionMap[currentClass];

    if (!nextClass) {
      return NextResponse.json(
        {
          message: `No promotion path found for class "${student.class}".`,
        },
        { status: 400 }
      );
    }

    const nextSession = getNextSession(
      student.session
    );

    /*
     * Prevent duplicate promotion.
     */
    const alreadyPromoted =
      student.academicHistory?.some(
        (history: {
          session: string;
          class: string;
        }) =>
          history.session === nextSession &&
          history.class === nextClass
      );

    if (alreadyPromoted) {
      return NextResponse.json(
        {
          message:
            "This student has already been promoted to this class and session.",
        },
        { status: 400 }
      );
    }

    /*
     * Save the student's previous academic record.
     */
    student.academicHistory.push({
      session: student.session,
      class: student.class,
      stream: student.stream || "General",

      totalFee: student.totalFee || 0,
      amountPaid: student.amountPaid || 0,
      balance: student.balance || 0,

      status: student.status || "Unpaid",

      promotionStatus: "Promoted",

      promotedAt: new Date(),
    });

    /*
     * Promote the student.
     */
    student.class = nextClass;
    student.session = nextSession;

    /*
     * JSS students do not have senior-secondary
     * streams.
     */
    if (nextClass.startsWith("JSS")) {
      student.stream = "General";
    }

    /*
     * IMPORTANT:
     * School fees are NOT automatically assigned.
     *
     * Every new academic session starts with:
     *
     * Total Fee  = ₦0
     * Amount Paid = ₦0
     * Balance     = ₦0
     *
     * Fees can be recorded later through Payments.
     */
    student.totalFee = 0;
    student.amountPaid = 0;
    student.balance = 0;
    student.status = "Unpaid";

    await student.save();

    return NextResponse.json({
      message: `${student.fullName} has been promoted to ${nextClass}.`,
      student,
    });
  } catch (error) {
    console.error(
      "PROMOTE STUDENT ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to promote student",
      },
      { status: 500 }
    );
  }
}