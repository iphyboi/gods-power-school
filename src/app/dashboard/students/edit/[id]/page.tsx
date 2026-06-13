"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditStudentPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [name, setName] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [gender, setGender] = useState("");
    const [loading, setLoading] = useState(true);
    const [stream, setStream] = useState("");

{/* FETCH SINGLE STUDENT */}
useEffect(() => {
    const fetchStudent = async () => {
        try {
            const response = await fetch("/api/students");
            const data = await response.json();
            console.log("Current params:", params);

            const student = data.find(
                (item: any) =>
                    item._id === params.id
            );

            if (student) {
                setName(student.name);
                setStudentClass(student.class);
                setGender(student.gender);
                setStream(student.stream || "_");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    fetchStudent();
}, [params.id]);

// UPDATE STUDENT
const handleUpdate = async (
    e: React.FormEvent
) => {
    e.preventDefault();
    try {
        console.log({
            name,
            class: studentClass,
            stream,
            gender,
        });
        const response = await fetch(`/api/students/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                id: params.id,
                name,
                class: studentClass,
                gender,
                stream,
            }),
        });

        const data = await response.json();
        alert(data.message);
        router.push("/dashboard/students");
        router.refresh();
    } catch (error) {
        console.log(error);
        alert("Failed to update student");
    }
};

if (loading) {
    return (
        <p className="text-black">
            Loading...
        </p>
    );
}

return (
    <div className="bg-white p-6 rounded-xl shadow-md border max-w-2xl">
        <h1 className="text-3xl font-bold text-black mb-6">
            Edit Student
        </h1>

        <form
        onSubmit={handleUpdate}
        className="space-y-5">

            {/* NAME */}
            <div>
                <label className="block mb-2 text-black font-medium">
                    Student Name
                </label>

                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-3 text-black"
                />
            </div>

            {/* CLASS */}
            <div>
                <label className="block mb-2 text-black font-medium">
                    Class
                </label>

                <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full border rounded-lg p-3 text-black"
                />
            </div>

            {/* GENDER */}
            <div>
                <label className="block mb-2 text-black font-medium">
                    Gender
                    </label>
                    <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border rounded-lg p-3 text-black">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
            </div>

            <div>
                <label className="block mb-2 text-black">
                    Stream
                </label>

                <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full border p-3 rounded text-black"
                >
                <option value="">Select Stream</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Commercial">Commercial</option>
                </select>
            </div>

            {/* BUTTON */}
            <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                Update Student
            </button>
        </form>
    </div>
);
}