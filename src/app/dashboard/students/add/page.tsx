"use client";

import { useState } from "react";

export default function AddStudentPage() {

    const [name, setName] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [department, setDepartment] = useState("");
    const [gender, setGender] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !studentClass || !gender || !department) {
            alert("please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/students", {
                method: "POST",
                headers: {
                    "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                    fullName: name,
                    class: studentClass,
                    department,
                    gender,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "something went wrong"
                );
            }

            alert(`${data.message || "student added successfully!"}\nID Number: ${data.studentId || "N/A"}`);
        
        setName("");
        setStudentClass("");
        setDepartment("");
        setGender("");
    } catch (error) {
        console.log(error);
        alert(
            "Failed to add student"
        );
    } finally {
        setLoading(false)
    }
};

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border max-w-2xl">
            <h1 className="text-3xl font-bold text-black mb-6">
                Add Student
            </h1>

            <form
            onSubmit={handleSubmit}
            className="space-y-5"
            >

                <div>
                    <label className="block mb-2 text-black font-medium">
                        Student Name
                    </label>

                    <input
                    type="text"
                    placeholder="Enter student name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-lg p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* class */}
                <div>
                    <label className="block mb-2 text-black font-medium">
                        Class
                    </label>

                    <input
                    type="text"
                    placeholder="Enter class"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full border rounded-lg p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-black font-medium">
                        Department
                    </label>
                    <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full border rounded-lg p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    <option value="">Select Department</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commercial">Commercial</option>
                    </select>
                </div>

                {/* Gender */}
                <div>
                    <label className="block mb-2 text-black font-medium">
                        Gender
                    </label>

                    <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border rounded-lg p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
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

                <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    {loading
                    ? "Adding..."
                     : "Add Student"}
                </button>
            </form>
        </div>
    );
}