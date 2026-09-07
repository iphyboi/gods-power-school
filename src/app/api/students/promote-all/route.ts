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

    return `${currentYear + 1}/${currentYear + 2}`;
  }

  const startYear = Number(match[1]);

  return `${startYear + 1}/${startYear + 2}`;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json().catch(() => ({}));

    const requestedSession =
      typeof body.session === "string"
        ? body.session.trim()
        : "";

    const students = await Student.find({
      isActive: true,
      ...(requestedSession
        ? { session: requestedSession }
        : {}),
    });

    if (students.length === 0) {
      return NextResponse.json(
        {
          message: "No active students found to promote.",
        },
        { status: 404 }
      );
    }

    let promotedCount = 0;
    let graduatedCount = 0;
    let skippedCount = 0;

    const promotedStudents: Array<{
      studentId: string;
      fullName: string;
      from: string;
      to: string;
      session: string;
    }> = [];

    const graduatedStudents: Array<{
      studentId: string;
      fullName: string;
      class: string;
      session: string;
    }> = [];

    for (const student of students) {
      const currentClass =
        student.class?.trim().toUpperCase();

      // ==========================================
      // SS3 → GRADUATED
      // ==========================================

      if (currentClass === "SS3") {
        const alreadyGraduated =
          student.academicHistory?.some(
            (history: {
              session: string;
              class: string;
              promotionStatus?: string;
            }) =>
              history.session === student.session &&
              history.class === student.class &&
              history.promotionStatus === "Graduated"
          );

        if (alreadyGraduated) {
          skippedCount++;
          continue;
        }

        // Save final academic record
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

        graduatedCount++;

        graduatedStudents.push({
          studentId: student.studentId,
          fullName: student.fullName,
          class: student.class,
          session: student.session,
        });

        continue;
      }

      // ==========================================
      // FIND NEXT CLASS
      // ==========================================

      const nextClass =
        promotionMap[currentClass];

      if (!nextClass) {
        skippedCount++;
        continue;
      }

      const nextSession =
        getNextSession(student.session);

      // ==========================================
      // PREVENT DUPLICATE PROMOTION
      // ==========================================

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
        skippedCount++;
        continue;
      }

      // ==========================================
      // SAVE CURRENT ACADEMIC RECORD
      // ==========================================

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

      // ==========================================
      // PROMOTE STUDENT
      // ==========================================

      const previousClass = student.class;

      student.class = nextClass;
      student.session = nextSession;

      // Junior students don't use senior streams
      if (nextClass.startsWith("JSS")) {
        student.stream = "General";
      }

      // ==========================================
      // IMPORTANT:
      // NEW SESSION STARTS WITH ZERO FEES
      // ==========================================

      student.totalFee = 0;
      student.amountPaid = 0;
      student.balance = 0;
      student.status = "Unpaid";

      await student.save();

      promotedCount++;

      promotedStudents.push({
        studentId: student.studentId,
        fullName: student.fullName,
        from: previousClass,
        to: nextClass,
        session: nextSession,
      });
    }

    return NextResponse.json({
      message:
        "Promotion process completed successfully.",

      summary: {
        totalStudents: students.length,
        promoted: promotedCount,
        graduated: graduatedCount,
        skipped: skippedCount,
      },

      promotedStudents,

      graduatedStudents,
    });
  } catch (error) {
    console.error(
      "PROMOTE ALL ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to promote students.",
      },
      { status: 500 }
    );
  }
}