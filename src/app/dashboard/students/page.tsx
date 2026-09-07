"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
}

interface SchoolClass {
  _id: string;
  name: string;
  fee: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const [loading, setLoading] = useState(true);
  const [classesLoading, setClassesLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [streamFilter, setStreamFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [adding, setAdding] = useState(false);

  // PROMOTION STATES
  const [promotingId, setPromotingId] = useState<string | null>(null);
  const [promotingAll, setPromotingAll] = useState(false);

  // NEW STUDENT FORM
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [gender, setGender] = useState("");
  const [stream, setStream] = useState("General");

  // ============================================
  // FETCH STUDENTS
  // ============================================
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/students", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch students"
        );
      }

      setStudents(
        Array.isArray(data.students)
          ? data.students
          : []
      );
    } catch (error) {
      console.error("FETCH STUDENTS ERROR:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FETCH CLASSES
  // ============================================
  const fetchClasses = async () => {
    try {
      setClassesLoading(true);

      const response = await fetch("/api/classes", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch classes"
        );
      }

      setClasses(
        Array.isArray(data.classes)
          ? data.classes
          : []
      );
    } catch (error) {
      console.error("FETCH CLASSES ERROR:", error);
      setClasses([]);
    } finally {
      setClassesLoading(false);
    }
  };

  // ============================================
  // INITIAL FETCH
  // ============================================
  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  // ============================================
  // FILTER STUDENTS
  // ============================================
  const filteredStudents = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return students.filter((student) => {
      const studentName = (
        student.fullName || ""
      )
        .toLowerCase()
        .trim();

      const studentId = (
        student.studentId || ""
      )
        .toLowerCase()
        .trim();

      const normalizedStudentId =
        studentId.replace(/[\s-]/g, "");

      const cleanStudentId = studentId
        .replace(/^stu[\s-]*/i, "")
        .replace(/[\s-]/g, "");

      const normalizedSearch =
        searchTerm.replace(/[\s-]/g, "");

      const matchesSearch =
        searchTerm === "" ||
        studentName.includes(searchTerm) ||
        studentId.includes(searchTerm) ||
        normalizedStudentId.includes(
          normalizedSearch
        ) ||
        cleanStudentId.includes(
          normalizedSearch
        );

      const matchesClass =
        classFilter === "All" ||
        student.class === classFilter;

      const studentStream =
        student.stream || "General";

      const matchesStream =
        streamFilter === "All" ||
        studentStream === streamFilter;

      return (
        matchesSearch &&
        matchesClass &&
        matchesStream
      );
    });
  }, [
    students,
    search,
    classFilter,
    streamFilter,
  ]);

  // ============================================
  // STATS
  // ============================================
  const activeStudents = students.filter(
    (student) =>
      student.isActive !== false
  ).length;

  const graduationCandidates = students.filter(
    (student) =>
      student.isActive !== false &&
      student.class?.trim().toUpperCase() === "SS3"
  ).length;

  // ============================================
  // CLEAR FILTERS
  // ============================================
  const clearFilters = () => {
    setSearch("");
    setClassFilter("All");
    setStreamFilter("All");
  };

  // ============================================
  // ADD STUDENT
  // ============================================
  const handleAddStudent = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter student name");
      return;
    }

    if (!studentClass) {
      alert("Please select student class");
      return;
    }

    if (!gender) {
      alert("Please select gender");
      return;
    }

    try {
      setAdding(true);

      const response = await fetch(
        "/api/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: name.trim(),
            class: studentClass,
            gender,
            stream,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to add student"
        );
        return;
      }

      alert(
        data.message ||
          "Student added successfully"
      );

      setName("");
      setStudentClass("");
      setGender("");
      setStream("General");

      setShowModal(false);

      await fetchStudents();
    } catch (error) {
      console.error(
        "ADD STUDENT ERROR:",
        error
      );

      alert("Failed to add student");
    } finally {
      setAdding(false);
    }
  };

  // ============================================
  // PROMOTE ONE STUDENT
  // ============================================
  const handlePromote = async (
    student: Student
  ) => {
    if (promotingId) return;

    const currentClass =
      student.class?.trim().toUpperCase();

    let destination = "";

    if (currentClass === "JSS1") {
      destination = "JSS2";
    } else if (currentClass === "JSS2") {
      destination = "JSS3";
    } else if (currentClass === "JSS3") {
      destination = "SS1";
    } else if (currentClass === "SS1") {
      destination = "SS2";
    } else if (currentClass === "SS2") {
      destination = "SS3";
    } else if (currentClass === "SS3") {
      destination = "Graduated";
    } else {
      alert(
        `No promotion path found for ${student.class}.`
      );
      return;
    }

    const confirmed = confirm(
      currentClass === "SS3"
        ? `Are you sure you want to graduate ${student.fullName}?`
        : `Promote ${student.fullName} from ${student.class} to ${destination}?`
    );

    if (!confirmed) return;

    try {
      setPromotingId(student._id);

      const response = await fetch(
        `/api/students/${student._id}/promote`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to promote student"
        );
        return;
      }

      alert(
        data.message ||
          "Student promoted successfully"
      );

      await fetchStudents();
    } catch (error) {
      console.error(
        "PROMOTE STUDENT ERROR:",
        error
      );

      alert("Failed to promote student");
    } finally {
      setPromotingId(null);
    }
  };

  // ============================================
  // PROMOTE ALL STUDENTS
  // ============================================
  const handlePromoteAll = async () => {
    if (promotingAll) return;

    const activeCount = students.filter(
      (student) =>
        student.isActive !== false
    ).length;

    if (activeCount === 0) {
      alert("There are no active students to promote.");
      return;
    }

    const confirmed = confirm(
      `You are about to process ${activeCount} active student${
        activeCount !== 1 ? "s" : ""
      }.\n\nStudents will be promoted to their next class, while SS3 students will be graduated.\n\nTheir academic history will be preserved.\n\nDo you want to continue?`
    );

    if (!confirmed) return;

    try {
      setPromotingAll(true);

      const response = await fetch(
        "/api/students/promote-all",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to promote students"
        );
        return;
      }

      const summary = data.summary;

      alert(
        `Promotion completed successfully!\n\n` +
          `Promoted: ${summary?.promoted || 0}\n` +
          `Graduated: ${summary?.graduated || 0}\n` +
          `Skipped: ${summary?.skipped || 0}`
      );

      await fetchStudents();
    } catch (error) {
      console.error(
        "PROMOTE ALL ERROR:",
        error
      );

      alert("Failed to promote students");
    } finally {
      setPromotingAll(false);
    }
  };

  // ============================================
  // DELETE STUDENT
  // ============================================
  const handleDelete = async (
    studentId: string
  ) => {
    const confirmed = confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/students/${studentId}`,
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

      await fetchStudents();
    } catch (error) {
      console.error("DELETE ERROR:", error);

      alert("Failed to delete student");
    }
  };

  // ============================================
  // INITIALS
  // ============================================
  const getInitials = (
    fullName: string
  ) => {
    return fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) =>
        name.charAt(0).toUpperCase()
      )
      .join("");
  };

  return (
    <div className="space-y-6">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Students
          </h1>

          <p className="text-gray-500 mt-1">
            Manage student records, academic sessions,
            and promotions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">

          <button
            type="button"
            onClick={handlePromoteAll}
            disabled={
              promotingAll ||
              activeStudents === 0
            }
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {promotingAll
              ? "Processing..."
              : "Promote All"}
          </button>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl transition"
          >
            + Add Student
          </button>

        </div>
      </div>

      {/* ====================================== */}
      {/* PROMOTION INFO */}
      {/* ====================================== */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <div>
            <h2 className="font-bold text-blue-900">
              Academic Promotion
            </h2>

            <p className="text-sm text-blue-700 mt-1">
              Promote students without changing their
              Student ID. Previous academic records are
              preserved in their history.
            </p>
          </div>

          <div className="text-sm font-semibold text-blue-800">
            SS3 candidates: {graduationCandidates}
          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* STAT CARDS */}
      {/* ====================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Students
          </p>

          <p className="text-3xl font-bold text-gray-900 mt-2">
            {students.length}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Showing
          </p>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {filteredStudents.length}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Active Students
          </p>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {activeStudents}
          </p>
        </div>

      </div>

      {/* ====================================== */}
      {/* SEARCH + FILTERS */}
      {/* ====================================== */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* SEARCH */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Name or Student ID..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {search && (
              <p className="text-xs text-gray-400 mt-2">
                Searching for: {search}
              </p>
            )}
          </div>

          {/* CLASS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Class
            </label>

            <select
              value={classFilter}
              onChange={(e) =>
                setClassFilter(e.target.value)
              }
              disabled={classesLoading}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="All">
                All Classes
              </option>

              {classes.map((item) => (
                <option
                  key={item._id}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* STREAM */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stream
            </label>

            <select
              value={streamFilter}
              onChange={(e) =>
                setStreamFilter(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">
                All Streams
              </option>

              <option value="General">
                General
              </option>

              <option value="Science">
                Science
              </option>

              <option value="Arts">
                Arts
              </option>

              <option value="Commercial">
                Commercial
              </option>
            </select>
          </div>

        </div>

        {/* FILTER FOOTER */}
        {(search ||
          classFilter !== "All" ||
          streamFilter !== "All") && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">

            <p className="text-sm text-gray-500">
              {filteredStudents.length} student
              {filteredStudents.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear Filters
            </button>

          </div>
        )}

      </div>

      {/* ====================================== */}
      {/* STUDENTS TABLE */}
      {/* ====================================== */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead className="bg-gray-50 border-b border-gray-200">

              <tr>

                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Student
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Student ID
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Class
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Gender
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Stream
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Status
                </th>

                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {loading ? (

                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-500"
                  >
                    Loading students...
                  </td>
                </tr>

              ) : filteredStudents.length === 0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12"
                  >
                    <p className="text-gray-500 font-medium">
                      No students found
                    </p>

                    {search && (
                      <p className="text-sm text-gray-400 mt-1">
                        Try another name or Student ID.
                      </p>
                    )}

                    {(classFilter !== "All" ||
                      streamFilter !== "All") && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Clear Filters
                      </button>
                    )}
                  </td>
                </tr>

              ) : (

                filteredStudents.map((student) => {

                  const studentStream =
                    student.stream ||
                    "General";

                  const isGraduated =
                    student.isActive === false;

                  const isPromoting =
                    promotingId === student._id;

                  return (
                    <tr
                      key={student._id}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* STUDENT */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            {getInitials(
                              student.fullName
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {student.fullName}
                            </p>

                            <p className="text-xs text-gray-500">
                              {student.session ||
                                "Current Session"}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* STUDENT ID */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-700">
                          {student.studentId}
                        </span>
                      </td>

                      {/* CLASS */}
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                          {student.class}
                        </span>
                      </td>

                      {/* GENDER */}
                      <td className="px-6 py-4 text-gray-700">
                        {student.gender}
                      </td>

                      {/* STREAM */}
                      <td className="px-6 py-4">

                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                          {studentStream}
                        </span>

                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">

                        {isGraduated ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                            Graduated
                          </span>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                        )}

                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">

                        <div className="flex items-center justify-end gap-2">

                          <Link
                            href={`/dashboard/students/${student._id}`}
                            className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                          >
                            View
                          </Link>

                          {!isGraduated && (
                            <button
                              type="button"
                              onClick={() =>
                                handlePromote(student)
                              }
                              disabled={
                                promotingAll ||
                                isPromoting
                              }
                              className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isPromoting
                                ? "Promoting..."
                                : student.class
                                    ?.trim()
                                    .toUpperCase() ===
                                  "SS3"
                                ? "Graduate"
                                : "Promote"}
                            </button>
                          )}

                          <Link
                            href={`/dashboard/students/edit/${student._id}`}
                            className="px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50 transition"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                student._id
                              )
                            }
                            disabled={
                              promotingAll ||
                              promotingId !== null
                            }
                            className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* ====================================== */}
      {/* ADD STUDENT MODAL */}
      {/* ====================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Add New Student
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enter the student's basic information.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleAddStudent}
              className="p-6 space-y-5"
            >

              {/* NAME */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter full name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* CLASS */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Class
                </label>

                <select
                  value={studentClass}
                  onChange={(e) =>
                    setStudentClass(
                      e.target.value
                    )
                  }
                  disabled={classesLoading}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {classesLoading
                      ? "Loading classes..."
                      : "Select Class"}
                  </option>

                  {classes.map((item) => (
                    <option
                      key={item._id}
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* GENDER */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>

                <select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>
                </select>
              </div>

              {/* STREAM */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stream
                </label>

                <select
                  value={stream}
                  onChange={(e) =>
                    setStream(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General">
                    General
                  </option>

                  <option value="Science">
                    Science
                  </option>

                  <option value="Arts">
                    Arts
                  </option>

                  <option value="Commercial">
                    Commercial
                  </option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  disabled={adding}
                  className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    adding ||
                    classesLoading
                  }
                  className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {adding
                    ? "Adding..."
                    : "Add Student"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}