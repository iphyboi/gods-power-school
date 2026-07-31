"use client";
import React, { useState } from "react";

export default function AdminAttendancePage() {
 const [studentId, setStudentId] = useState("");
 const [date, setDate] = useState("");
 const [status, setStatus] = useState("Present");
 const [remarks, setRemarks] = useState("");
 const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState({ text: "", isError: false });

 const handleUploadAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });

    // basic validation checks
    if (!studentId.trim() || !date || !status) {
        setMessage({ text: "Please fill in all required fields.", isError: true });
        return;
    }

    // prevent uploading attendance for weekends (secondary school rule)
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        setMessage({
            text: "You cannot upload attendance for weekends! please pick a weekday (Monday - Friday).",
            isError: true
        });
        return;
    }

    setLoading(true);

    try {
        const response = await fetch("/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                studentId: studentId.trim(),
                date,
                status,
                remarks: remarks.trim(),
            }),
        });

        const result = await response.json();

        if (result.success) {
            setMessage({ text: "Attendance uploaded successfullu!", isError: false });

            // xlear form options except status default
            setStudentId("");
            setDate("");
            setDate("");
            setRemarks("");
        } else {
            setMessage({ text: result.message || "Failed to save attendance record.", isError: true });
        }
        } catch (err) {
            setMessage({ text: "Network error occurred. Check server connection.", isError: true });
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center text-white">
            <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">

            {/* header title */}
            <div className="mb-6">
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    Attendance control Panel
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    Log and Upload formal register entries directly into the database
                </p>
            </div>

            {/* message alert boxes */}
            {message.text && (
                <div className={`mb-6 p-3.5 rounded-xl text-sm font-semibold border ${
                    message.isError
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}>
                    {message.text}
                    </div>
            )}

            {/* form input */}
            <form onSubmit={handleUploadAttendance} className="space-y-5">
                {/* student ID BLOCK */}
                <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        Student Registration ID *
                    </label>

                    <input
                    type="text"
                    placeholder="e.g SCH-2069"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                    required
                    />
                </div>

                {/* Date picker grid selection */}
                <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        Select Calendar Date *
                    </label>

                    <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white scheme-dark focus:outline-none focus:border-blue-500 text-sm"
                    required
                    /> 
                </div>

                {/* status radio element */}
                <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        Attendance Register status *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {["Present", "Late", "Absent"].map((opt) => (
                            <button
                            type="button"
                            key={opt}
                            onClick={() => setStatus(opt)}
                            className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wide border transition-all ${
                                status === opt
                                ? opt === "Present" ? "bg-emerald-600/20 border-emerald-500 text-emerald-400" :
                                opt === "Late" ? "bg-amber-600/20 border-amber-500 text-amber-400" :
                                "bg-red-600/20 border-red-500 text-red-400"
                                : "bg-black/20 border-white/5 text-gray-400 hover:bg-black/40"
                            }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* remarks/Notes textarea */}
                <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        Remarks / Comments <span className="text-gray-500">(optional)</span>
                    </label>
                    <textarea
                    placeholder="e.g., late due to heavy rain"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
                    />
                </div>

                {/* acton trigger button */}
                <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm rounded-xl tracking-wide transition disabled:bg-gray-700"
                >
                    {loading ? "Processing Upload..." : "Upload Entry Record"}
                </button>
            </form>
            </div>
        </div>
    );
 }

