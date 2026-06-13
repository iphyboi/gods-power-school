"use client";

import { Option } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditStudentPage() {
    const params = useParams();
    const router = useRouter();

    const [name, setName] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [gender, setGender] = useState("");
    const [amountPaid, setAmountPaid] = useState(0);
    

    // FETCH STUDENT
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await fetch(`/api/student/${params.id}`);
                const data = await res.json();

                setName(data.student.name);
                setStudentClass(data.student.class);
                setGender(data.student.gender);
                setAmountPaid(data.student.amountPaid);
            } catch (error) {
                console.log(error);
            }
        };

        fetchStudent();
    }, [params.id]);

    // UPDATE STUDENT
    const updateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/students/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    name,
                    class: studentClass,
                    gender,
                    amountPaid,
                    balance: 0,
                    status:
                    amountPaid > 0
                    ? "Part Payment"
                    : "UnPaid",
                }),
            });

            if (res.ok) {
                alert("Student updated successfully");

                router.push("/dashboard/students");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-6 text-black">
            <h1 className="text-3xl font-bold text-black mb-6">
                Edit Student
            </h1>

            <form
            onSubmit={updateStudent}
            className="space-y-4 max-w-md">

                {/* NAME */}
                <input
                type="text"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-3 rounded text-black bg-white"
                />

                {/* CLASS */}
                <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full border p-3 rounded text-black bg-white"
                >
                    <option value="">Select Class</option>
                    <option value="JSS1">JSS1</option>
                    <option value="JSS2">JSS2</option>
                    <option value="JSS3">JSS3</option>
                    <option value="SS1">SS1</option>
                    <option value="SS2">SS2</option>
                    <option value="SS3">SS3</option>

                </select>

                {/* GENDER */}
                <select value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-ful border p-3 rounded text-black bg-white"
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Femal">Female</option>
                </select>

                {/* PAYMENT */}
                <input
                type="number"
                placeholder="Amount Paid"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className="w-full border p-3 rounded text-black bg-white"
                />

                {/* BUTTON */}
                <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 px-6 rounded">
                    Update Student
                </button>
            </form>
        </div>
    );
}
    