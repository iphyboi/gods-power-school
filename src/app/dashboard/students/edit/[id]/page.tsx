"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface SchoolClass {
  _id: string;
  name: string;
  fee: number;
}

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [gender, setGender] = useState("");
  const [stream, setStream] = useState("");

  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // FETCH STUDENT + CLASSES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentResponse, classesResponse] =
          await Promise.all([
            fetch(`/api/students/${id}`),
            fetch("/api/classes"),
          ]);

        const studentData = await studentResponse.json();
        const classesData = await classesResponse.json();

        if (!studentResponse.ok) {
          throw new Error(
            studentData.message || "Failed to fetch student"
          );
        }

        if (!classesResponse.ok) {
          throw new Error(
            classesData.message || "Failed to fetch classes"
          );
        }

        const student = studentData.student;

        if (student) {
          setName(student.fullName || student.name || "");
          setStudentClass(student.class || "");
          setGender(student.gender || "");
          setStream(student.stream || "General");
        }

        setClasses(classesData.classes || []);
      } catch (error) {
        console.error("FETCH EDIT DATA ERROR:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to load student"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // UPDATE STUDENT
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter the student's name");
      return;
    }

    if (!studentClass) {
      alert("Please select the student's class");
      return;
    }

    if (!gender) {
      alert("Please select a gender");
      return;
    }

    if (!stream) {
      alert("Please select a stream");
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(`/api/students/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name.trim(),
          class: studentClass,
          gender,
          stream,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update student");
        return;
      }

      alert(data.message || "Student updated successfully");

      router.push("/dashboard/students");
      router.refresh();
    } catch (error) {
      console.error("UPDATE STUDENT ERROR:", error);
      alert("Failed to update student");
    } finally {
      setUpdating(false);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-gray-600">
            Loading student...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* HEADER */}
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Student
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Update the student's academic information.
              </p>
            </div>

            <div className="hidden rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 sm:block">
              Editing
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleUpdate}
          className="space-y-6 p-6"
        >

          {/* STUDENT NAME */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Student Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* CLASS */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Class
            </label>

            <select
              value={studentClass}
              onChange={(e) =>
                setStudentClass(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">
                Select Class
              </option>

              {classes.map((schoolClass) => (
                <option
                  key={schoolClass._id}
                  value={schoolClass.name}
                >
                  {schoolClass.name}
                </option>
              ))}
            </select>

            {classes.length === 0 && (
              <p className="mt-2 text-sm text-red-500">
                No classes found in the database.
              </p>
            )}
          </div>

          {/* GENDER */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Gender
            </label>

            <select
              value={gender}
              onChange={(e) =>
                setGender(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Stream
            </label>

            <select
              value={stream}
              onChange={(e) =>
                setStream(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">
                Select Stream
              </option>

              <option value="General">
                General — Junior Section
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

          {/* INFO */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900">
              Important
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-700">
              Editing the student's class, gender, or stream will
              not change their student ID or payment information.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/students")
              }
              disabled={updating}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating
                ? "Updating..."
                : "Update Student"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}