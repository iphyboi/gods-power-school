
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Student {
  _id: string;
  studentId: string;
  fullName: string;
  class: string;
  gender: string;
  status?: string;
  stream?: string;
  department?: string;
  session?: string;
  isActive?: boolean;
  totalFee?: number;
  amountPaid?: number;
  balance?: number;
  dateOfBirth?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
}

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [student, setStudent] =
    useState<Student | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ============================================
  // FETCH STUDENT
  // ============================================
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/students/${params.id}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        console.log(
          "STUDENT DETAILS:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch student"
          );
        }

        setStudent(data.student);
      } catch (error) {
        console.error(
          "FETCH STUDENT ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load student"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStudent();
    }
  }, [params.id]);

  // ============================================
  // DELETE STUDENT
  // ============================================
  const handleDelete = async () => {
    if (!student) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${student.fullName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/students/${student._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete student"
        );
        return;
      }

      alert(
        data.message ||
          "Student deleted successfully"
      );

      router.push("/dashboard/students");
    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error
      );

      alert("Failed to delete student");
    }
  };

  // ============================================
  // FORMAT MONEY
  // ============================================
  const formatMoney = (
    amount: number | undefined
  ) => {
    return `₦${(
      amount || 0
    ).toLocaleString()}`;
  };

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading student details...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================
  if (error || !student) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
          !
        </div>

        <h2 className="text-xl font-bold text-gray-900">
          Student Not Found
        </h2>

        <p className="text-gray-500 mt-2">
          {error ||
            "We could not find this student."}
        </p>

        <Link
          href="/dashboard/students"
          className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl transition"
        >
          Back to Students
        </Link>
      </div>
    );
  }

  // ============================================
  // STUDENT INITIALS
  // ============================================
  const initials = student.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) =>
      name.charAt(0).toUpperCase()
    )
    .join("");

  const studentStream =
    student.stream || "General";

  return (
    <div className="space-y-6">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <Link
            href="/dashboard/students"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Students
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mt-3">
            Student Details
          </h1>

          <p className="text-gray-500 mt-1">
            View complete information about this student.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <Link
            href={`/dashboard/students/edit/${student._id}`}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Edit Student
          </Link>

          <button
            onClick={handleDelete}
            className="px-5 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition"
          >
            Delete
          </button>

        </div>
      </div>

      {/* ====================================== */}
      {/* PROFILE CARD */}
      {/* ====================================== */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            {/* AVATAR */}
            <div className="w-20 h-20 rounded-2xl bg-white text-blue-700 flex items-center justify-center text-2xl font-bold shadow-lg">
              {initials}
            </div>

            {/* NAME */}
            <div className="text-white">

              <h2 className="text-2xl font-bold">
                {student.fullName}
              </h2>

              <p className="text-blue-100 mt-1 font-mono">
                {student.studentId}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">

                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                  {student.class}
                </span>

                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                  {studentStream}
                </span>

                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                  {student.gender}
                </span>

              </div>
            </div>

          </div>

        </div>

        {/* BASIC INFORMATION */}
        <div className="p-6">

          <h3 className="text-lg font-bold text-gray-900 mb-5">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            <InfoItem
              label="Student ID"
              value={student.studentId}
            />

            <InfoItem
              label="Full Name"
              value={student.fullName}
            />

            <InfoItem
              label="Gender"
              value={student.gender}
            />

            <InfoItem
              label="Class"
              value={student.class}
            />

            <InfoItem
              label="Stream"
              value={studentStream}
            />

            <InfoItem
              label="Academic Session"
              value={
                student.session ||
                "Not available"
              }
            />

            <InfoItem
              label="Date of Birth"
              value={
                student.dateOfBirth ||
                "Not provided"
              }
            />

            <InfoItem
              label="Department"
              value={
                student.department ||
                "General"
              }
            />

            <InfoItem
              label="Status"
              value={
                student.isActive === false
                  ? "Inactive"
                  : "Active"
              }
              badge
              badgeColor={
                student.isActive === false
                  ? "red"
                  : "green"
              }
            />

          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* PAYMENT INFORMATION */}
      {/* ====================================== */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Payment Information
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Current school fee payment status.
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              student.status === "Paid"
                ? "bg-green-100 text-green-700"
                : student.status ===
                  "Part Payment"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {student.status ||
              "Unpaid"}
          </span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* TOTAL FEE */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-5">

            <p className="text-sm text-gray-500">
              Total Fee
            </p>

            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatMoney(
                student.totalFee
              )}
            </p>

          </div>

          {/* AMOUNT PAID */}
          <div className="rounded-xl bg-green-50 border border-green-100 p-5">

            <p className="text-sm text-gray-500">
              Amount Paid
            </p>

            <p className="text-2xl font-bold text-green-700 mt-2">
              {formatMoney(
                student.amountPaid
              )}
            </p>

          </div>

          {/* BALANCE */}
          <div className="rounded-xl bg-red-50 border border-red-100 p-5">

            <p className="text-sm text-gray-500">
              Balance
            </p>

            <p className="text-2xl font-bold text-red-700 mt-2">
              {formatMoney(
                student.balance
              )}
            </p>

          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* PARENT / GUARDIAN INFORMATION */}
      {/* ====================================== */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

        <h3 className="text-lg font-bold text-gray-900 mb-5">
          Parent / Guardian Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <InfoItem
            label="Parent / Guardian Name"
            value={
              student.parentName ||
              "Not provided"
            }
          />

          <InfoItem
            label="Phone Number"
            value={
              student.parentPhone ||
              "Not provided"
            }
          />

          <div className="md:col-span-2">
            <InfoItem
              label="Address"
              value={
                student.address ||
                "Not provided"
              }
            />
          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* QUICK ACTIONS */}
      {/* ====================================== */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

        <h3 className="text-lg font-bold text-gray-900 mb-5">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          <Link
            href={`/dashboard/students/edit/${student._id}`}
            className="text-center px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition"
          >
            Edit Student
          </Link>

          <Link
            href="/dashboard/payments/add"
            className="text-center px-4 py-3 rounded-xl bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition"
          >
            Record Payment
          </Link>

          <Link
            href="/dashboard/students"
            className="text-center px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
          >
            All Students
          </Link>

        </div>

      </div>

    </div>
  );
}

// ============================================
// INFO ITEM COMPONENT
// ============================================
function InfoItem({
  label,
  value,
  badge = false,
  badgeColor = "green",
}: {
  label: string;
  value: string;
  badge?: boolean;
  badgeColor?: "green" | "red";
}) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
        {label}
      </p>

      {badge ? (
        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
            badgeColor === "green"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ) : (
        <p className="text-gray-800 font-medium mt-1">
          {value}
        </p>
      )}
    </div>
  );
}