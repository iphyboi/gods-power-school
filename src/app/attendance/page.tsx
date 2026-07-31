"use client";
import React, { useState} from "react";

export default function PublicAttendancePage() {
    const [studentId, setStudentId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [attendanceData, setAttendanceData] = useState<any>(null);

    const handleAttendanceSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!studentId.trim()) return;

        setLoading(true);
        setError("");
        setAttendanceData(null);

        try {
            const response = await fetch(`/api/attendance/${studentId.trim()}`);
            const result = await response.json();

            if (result.success) {
                setAttendanceData(result);
            } else {
                setError(result.message || "No records found for this student.");
            }
        } catch (err) {
            setError("Network connectivity error.please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed relative py-12 px-4 flex flex-col items-center justify-center"
        style={{ backgroundImage: "url('/images/photo-2.jpg')"}}
        >
            {/* dark tint overlay layer*/}
            <div className="absolute inset-0 bg-black/70 pointer-events-none">
            </div>
            <div className="w-full max-w-4xl relative z-10 my-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-8 shadow-2xl">
             {/* Header */}
             <div className="text-center mb-8">
                <h1 className="text-3xlfont-extrabold tracking-tight text-white md:text-4xl drop-shadow-md">
                    Student Attendance Portal
                </h1>

                <p className="text-gray-200 mt-2 text-sm md:text-base drop-shadow-sm">
                    Parents: Enter your child's custom ID
                </p>
             </div>

             {/* form search */}
             <form onSubmit={handleAttendanceSearch} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="flex-1 px-5 py-3.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all text-sm font-medium"
                />

                <button
                type="submit"
                disabled={loading}
                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-98 transition rounded-xl font-bold text-sm tracking-wide text-white disabled:bg-gray-600 shadow-lg"
                >
                    {loading ? "Searching..." : "Track attendance"}
                </button>
             </form>

             {/* error alert box */}
             {error && (
                <p className="text-red-400 text-center mt-5 font-semibold text-sm bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-xl max-w-xl mx-auto">
                    {error}
                </p>
             )}

             {/* register metrics layout panel */}
             {attendanceData && (
                <div className="mt-10 pt-10 border-t border-white/10 space-y-8">
                    {/* term summsry grid stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-black/40 rounded-xl border border-white/10 backdrop-blur-sm">
                        <span className="text-xs text-gray-400 block uppercase font-bold tracking-wide">
                            Term Rate
                        </span>
                        <span className={`text-3xl font-black mt-1 block ${Number(attendanceData.percentage) >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {attendanceData.percentage}%
                            </span>
                </div>

                <div className="p-4 bg-blacl/40 rounded-xl order border-white/10 backdrop-blur-sm">
                <span className="text-xs text-gray-400 block uppercase font-bold tracking-wider">
                    Days Absent
                </span>
                <span className="text-3xl font-black text-red-400 mt-1 block">
                    {attendanceData.absent}
                </span>
                </div>
            </div>

            {/* Scrollable register register log window */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Weekly Register History (Monday - Friday)
            </h3>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {attendanceData.records.map((record: any) => {
                    const recordDate = new Date(record.date);
                    const weekdayName = recordDate.toLocaleDateString('en-US', { weekday: 'long' });
                    const calendarDate = recordDate.toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric' });

                    return (
                        <div
                        key={record._id}
                        className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all"
                        >
                            <div>
                                <p className="font-bold text-sm text-white">
                                    {weekdayName}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {calendarDate}
                                </p>
                                </div>

                        <div className="flex items-center gap-4">
                            {record.remarks && (
                                <span className="text-xs text-gray-400 italic hidden sm:inline max-w-xs truncate">
                                    "{record.remarks}"
                                </span>
                            )}

                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                                record.status === "Present" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                record.status === "Late" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}>
                                {record.status}
                            </span>
            </div>
            </div>
                    );
                })}
        </div>
        </div>
        </div>
        )}
        </div>
        </div>
        </div>
    );
}
    