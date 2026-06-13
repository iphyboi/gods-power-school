"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Subject {
    subjectName: string;
    ca: number;
    exam: number;
    total: number;
    grade: string;
}

interface Result {
    _id: string;
    studentName: string;
    class: string;
    department: string;
    term: string;
    session: string;
    subjects: Subject[];
    grandTotal: number;
    average: number;
}

export default function ResultPage() {
    const [ studentName, setStudentName] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [department, setDepartment] = useState("");
    const [term, setTerm] = useState("");
    const [session, setSession] = useState("");
    const [studentId, setStudentId] = useState("");

    const [subjects, setSubjects] = useState<Subject[]>([
        {
        subjectName: "",
        ca: 0,
        exam: 0,
        total: 0,
        grade: "",
        },
    ]);

    // CALCULATE GRADE
    const calculateGrade = (
        total: number
    ) => {
        if (total >= 70) return "A";
        if (total >= 60) return "B";
        if (total >= 50) return "C";
        if (total >= 45) return "D";
        if (total >= 40) return "E";
        return "F";
    };

    //HANDLE SUBJECT CHANGE
    const handleSubjectChange = (
        index: number,
        field: keyof Subject,
        value: string | number
    ) => {
        const updatedSubjects = [...subjects];

        updatedSubjects[index] = {
            ...updatedSubjects[index],
            [field]: value,
        };

        const total = Number(updatedSubjects[index].ca) +
        Number(updatedSubjects[index].exam);

        updatedSubjects[index].total = total;

        updatedSubjects[index].grade = calculateGrade(total);

        setSubjects(updatedSubjects);
    };

    //ADD SUBJECT
    const addsubject = () => {
        setSubjects([
            ...subjects,
            {
                subjectName: "",
                ca: 0,
                exam: 0,
                total: 0,
                grade: "",
            },
        ]);
    };

    //SUBMIT RESULT
    const handlesubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const grandTotal = subjects.reduce(
            (acc, subject) => 
                acc + subject.total,
            0
        );

        const average = grandTotal / subjects.length;

        const resultData = {
            fullName: studentName,
            studentName: studentName,
            class: studentClass,
            department,
            term,
            session,
            subjects,
            grandTotal,
            average,
            studentId,
        };

        await fetch("/api/results", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resultData),
        });
        alert("Result Uploaded!");
    };
    return (
        <div
        className="p-6 min-h-screen bg-cover bg-center bg-fixed"
        style={{
         backgroundImage:
         "url('/images/photo-3.jpg')",
        }}
        >

            <div className="bg-black/40 backdrop-blur-sm min-h-screen p-6 rounded-2xl">

            <h1 className="text-4xl font-bold mb-8text-black">
                Upload Results
            </h1>

            <Link
            href="/dashboard/results/broadsheet"
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-md font-bold transition-colors inline-block mb-4"
            >
                View Broadsheet
            </Link>

            <form
            onSubmit={handlesubmit}
            className="space-y-6"
            >

                {/* STUDENT INFO */}
                <div className="grid md:grid-cols-2 gap-4">
                    <input
                    type="text"
                    placeholder="Student Name"
                    value={studentName}
                    onChange={(e) => setStudentName(
                        e.target.value
                    )}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-200 p-3 rounded"
                    required
                    />

                    <input
                    type="text"
                    placeholder="ID Number"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-200 p-3 rounded"
                    required
                    />

                    <input
                    type="text"
                    placeholder="Class"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-200 p-3 rounded"
                    required
                    />

                    <input
                    type="text"
                    placeholder="Department (optional)"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-200 p-3 rounded"
                    />

                    <input
                    type="text"
                    placeholder="Term"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-200 p-3 rounded"
                    required
                    />

                    <input
                    type="text"
                    placeholder="Session"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-200 p-3 rounded"
                    required
                    />
                </div>

                {/* SUBJECTS */}
                <div className="space-y-4">
                    {subjects.map(
                        (subject, index) => (

                            <div
                            key={index}
                            className="grid md:grid-cols-5 gap-4 bg-black/20 backdrop-blur-sm border border-white/20 p-4 rounded-xl"
                            >

                                <input
                                type="text"
                                placeholder="Subject"
                                value={subject.subjectName}
                                onChange={(e) => handleSubjectChange(
                                    index,
                                    "subjectName",
                                    e.target.value
                                )}
                                className="bg-white/20 border border-white/30 text-white placeholder:text-gray-200 p-2 rounded"
                                />

                                <input
                                type="number"
                                placeholder="CA"
                                value={subject.ca}
                                onChange={(e) => handleSubjectChange(
                                    index,
                                    "ca",
                                    Number(
                                        e.target.value
                                    )
                                )}
                                className="bg-white/20 border border-white/30 text-white p-2 rounded"
                                />

                                <input
                                type="number"
                                placeholder="Exam"
                                value={subject.exam}
                                onChange={(e) => handleSubjectChange(
                                    index,
                                    "exam",
                                    Number(e.target.value)
                                )}
                                className="bg-white/20 border border-white/30 text-white p-2 rounded"
                                />

                                <input
                                type="number"
                                value={subject.total}
                                readOnly
                                className="bg-white/10 border border-white/20 text-white p-2 rounded"
                                />

                                <input
                                type="text"
                                value={subject.grade}
                                readOnly
                                className="bg-white/10 border border-white/20 text-white p-2 rounded"
                                />
                                </div>
                        )
                    )}
                </div>

                <div className="flex gap-4">
                    <button
                    type="button"
                    onClick={addsubject}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
                    >
                        Add Subject
                    </button>

                    <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                        Upload Result
                    </button>
                </div>
            </form>
            </div>
            </div>
    );
}