"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
    _id: string;
    fullName: string;
    class: string;
    gender: string;
    status: string;
    stream: string;
    studentId: string;
    department: string;
}

export default function StudentsPage() {

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtered, setFiltered] = useState<Student[]>([]);
    const [classFilter, setClassFilter] = useState("");
    const [streamFilter, setStreamFilter] = useState("");
    const [search, setSearch] = useState("");

    // safe popup modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formFullName, setFormFullName] = useState("");
    const [formClass, setFormClass] = useState("SS3");
    const [formStream, setFormStream] = useState("Science");
    const [formGender, setFormGender] = useState("Male");
    const [formStudentId, setFormStudentId] = useState("");

    const handleAddNewStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formFullName || !formStudentId) {
            alert("Please fill in Name and Student ID");
            return;
        }

        try {
            const res = await fetch("/api/student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: formFullName,
                    studentId: formStudentId,
                    class: formClass,
                    stream: formStream,
                    gender: formGender,
                }),
            });

            if (res.ok) {
                alert("Student registered successfully!");
                setFormFullName("");
                setFormStudentId("");
                setIsModalOpen(false);
                window.location.reload();
            } else {
                alert("Failed to register student.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredStudents = students.filter((student) => {
        const matchesClass = !classFilter || classFilter === "All classes" ||
        student.class?.toLowerCase() === classFilter.toLowerCase();

        const matchesStream = !streamFilter || streamFilter === "All Stream" ||
        student.stream?.toLowerCase() === streamFilter.toLowerCase();

        const matchesSearch = !search || student.fullName?.toLowerCase().includes(search.toLowerCase());

        return matchesClass && matchesStream && matchesSearch;
    });

    const router = useRouter();

    useEffect(() => {
        const fetchStudents = async () => {

            try {
                const response = await fetch("/api/students");
                const data = await response.json();
                console.log("API RESPONSE:", data);

                //SAFE FIX: ALWAYS ENSURE ARRAY
                const safeData = Array.isArray(data)
                ? data
                : data.students
                ? data.students
                : [];
                setStudents(safeData);
                setFiltered(safeData);
            } catch (error) {
                console.log(error);
                setStudents([]);
                setFiltered([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // AUTO FILTER
    useEffect(() => {
        let result = [...students];

        if (classFilter) {
            result = result.filter(
                (s) => s.class === classFilter
            );
        }

        if (streamFilter) {
            result = result.filter(
                (s) => s.stream === streamFilter
            );
        }

        setFiltered(result);
    }, [classFilter, streamFilter, students]);
    
    /* DELETE STUDENT */

    const handleDelete = async (id: string) => {
        console.log("--- DEBUGGING DELETE ID ---");
        console.log("The ID being passed is:", id);
    const confirmDelete = confirm("Delete this student?");
    if (!confirmDelete) return;
    
        try {
            const response = await fetch(`/api/students/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        

            const data = await response.json();

            if (response.ok) {
            alert(data.message || "Student deleted successfully");
            setStudents((prev) => prev.filter((student) => student._id !== id));
            } else {
                alert(data.message || "Failed to delete student");
            }
        } catch (error) {
            console.error(error);
            alert(
                "Failed to delete student"
            );
        }
    };

    // UPDATE STUDENT
    const updateStudent = async (
        id: string,
        name: string,
        studentClass: string,
        gender: string
    ) => {
        try {
            const res = await fetch("/api/students", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    name,
                    class: studentClass,
                    gender,
                }),
            });

            const data = await res.json();
            alert(data.message);

            // update UI INSTANTLY
            setStudents((prev) =>
            prev.map((student) =>
            student._id === id
             ? {
                ...student,
                fullName: name,
                class: studentClass,
                gender,
             }
             : student
        )
    );
        } catch (error) {
            console.log(error);
            alert("Failed to update student");
        }
    };

    return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-black">
            Students
        </h1>

        <div className="flex gap-4 mb-6">
            <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="border p-2 text-black"
            >
                <option value="">All classes</option>
                <option value="SS1">SS1</option>
                <option value="SS2">SS2</option>
                <option value="SS3">SS3</option>
                <option value="JSS1">JSS1</option>
                <option value="JSS2">JSS2</option>
                <option value="JSS3">JSS3</option>
            </select>

            <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="border p-2 text-black"
            >
                <option value="">All Stream</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Commercial">Commercial</option>
            </select>

        </div>

        {loading ? (
            <p className="text-black">Loading students...</p>
        ) : (
   <>
            <input
            type="text"
            placeholder="Search student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full text-black"
            />

            <div className="bg-white shadow rounded border overflow-x-auto">

                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left text-black">Name</th>
                            <th className="p-3 text-left text-black">student ID</th>
                            <th className="p-3 text-left text-black">Class</th>
                            <th className="p-3 text-left text-black">Stream</th>
                            <th className="p-3 text-left text-black">Gender</th>
                            <th className="p-3 text-left text-black">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredStudents.map((s) => (
                            <tr key={s._id} className="border-t">
                                <td className="p-3 text-black">
                                {s.fullName}
                                </td>
                                <td className="p-3 text-black">
                                    {s.studentId}
                                </td>

                                <td className="p-3 text-black">
                                    {s.class}
                                </td>

                                <td className="p-3 text-black">
                                    {s.stream || s.department || "_"}
                                </td>

                                <td className="p-3 text-black">
                                    {s.gender}
                                </td>


                                <td className="p-3 flex gap-2">
                                    <button
                                    onClick={() =>
                                        router.push(`/dashboard/students/edit/${s._id}`)
                                    }
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                    onClick={() => handleDelete(s._id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex item-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 animate-in fade-in zoom-in duration-200">
                            {/* modal header */}
                            <div className="=flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Register New Student</h3>
                                <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-700 text-2xl font-bold p-1 line-height-1"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* modal form */}
                            <form onSubmit={handleAddNewStudent} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                                    <input
                                    type="text"
                                    value={formFullName}
                                    onChange={(e) => setFormFullName(e.target.value)}
                                    placeholder="Enter Name"
                                    className="w-fullp-2.5 rounded-lg border border-gray-300 text-black focus:ring-2 fofus:ring-blue-500 outline-none text-sm bg-gray-50"
                                    required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">StudentID</label>
                                    <input
                                    type="text"
                                    value={formStudentId}
                                    onChange={(e) => setFormStudentId(e.target.value)}
                                    placeholder="STU-2069"
                                    className="w-fullp-2.5 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50"
                                    required
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Class</label>
                                        <select
                                        value={formClass}
                                        onChange={(e) => setFormClass(e.target.value)}
                                        className="w-full p-2.5 rounded-lg borderborder-gray-300 text-black text-sm bg-gray-50 outline-none"
                                        >
                                            <option value="SS1">SS1</option>
                                            <option value="SS2">SS2</option>
                                            <option value="SS3">SS3</option>
                                            <option value="JSS1">JSS1</option>
                                            <option value="JSS2">JSS2</option>
                                            <option value="JSS3">JSS3</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xsfont-bold text-gray-700 uppercase mb-1">Stream</label>
                                        <select
                                        value={formStream}
                                        onChange={(e) => setFormStream(e.target.value)}
                                        className="w-full p-2.5 rounded-lg border border-gray-300 text-black text-sm bg-gray-50 outline-none"
                                        >
                                            <option value="Science">Science</option>
                                            <option value="Arts">Arts</option>
                                            <option value="Commercial">Commercial</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gender</label>
                                        <select
                                        value={formGender}
                                        onChange={(e) => setFormGender(e.target.value)}
                                        className="w-full p-2.5 rounded-lg border border-gray-300 text-black text-sm bg-gray-50 outline-none"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                </div>

                                {/* ACTION BUTTON */}
                                <div className="flexgap-2 pt-2">
                                    <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-lg text-sm transition"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                    type="submit"
                                    className="w-2/3 bg-blue-600 hover:bg-blue-700 text-whitefont-bold py-2.5 rounded-lg text-sm shadow transition"
                                    >
                                        Save Account
                                    </button>
                                </div>
                            </form>
                        </div>
                        </div>
                )}
                </div>
            </>    
        )}
    </div>
    );
}