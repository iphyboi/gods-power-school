"use client";
import { useEffect, useState } from "react";

export default function BroadaheetPage() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResults() {
        try {
            const res = await fetch("/api/results", { cache: "no-store" });
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error("Error fetching broadsheet data:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchResults();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
                <p className="text-xl font-semibold">Loading Broadsheet data...</p>
            </div>
        );
    }

    const handleDelete = async (id: string) => {

        const confirmDelete = confirm("Delete this result?");

        if (!confirmDelete) return;

        try {
            await fetch(`/api/results/${id}`, {
                method: "DELETE",
            });
            window.location.reload();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    

    return (
        <div className="min-h-screen p-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/photo-2.jpg')"}}>
            {/* OVERLAY */}
            <div className="bg-black/50 min-h-screen p-6 rounded-2xl text-white">
            <h1 className="text-4xl font-bold text-white mb-8">Result Broadsheet</h1>

            {results.length === 0 ? (
                <p className="text-white">No results uploaded yet</p>
            ) : (
                <div className="space-y-10">
                    {results.map((result: any) => (
                        <div key={result._id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">

                            {/* STUDENT INFO */}
                            <div className="mb-6 text-white space-y-2">
                                {/* FIXED FROM studentName to fullNam */}
                                <h2 className="text-2xl font-bold">{result.studentName}</h2>
                                <p>Class: {result.class}</p>
                                {result.department && <p>Department: {result.department}</p>}
                                <p>Term: {result.term}</p>
                                <p>Session: {result.session}</p>
                                </div>

                                {/* TABLE */}
                                <table className="w-full border-collapse text-white">
                                    <thead>
                                        <tr className="bg-white/20">
                                        <th className="border border-white/20 p-3 text-left">Subject</th>
                                        <th className="border border-white/20 p-3 text-left">CA</th>
                                        <th className="border border-white/20 p-3 text-left">Exam</th>
                                        <th className="border border-white/20 p-3 text-left">Total</th>
                                        <th className="border border-white/20 p-3 text-left">Grade</th>
                                        </tr>
                                    </thead>

                                <tbody>
                                {result.subjects?.map((subject: any, index: number) => (
                                    <tr key={index} className="hover: bg-white/10">
                                        <td className="border border-white/20 p-3">{subject.subjectName}</td>
                                        <td className="border border-white/20 p-3">{subject.ca}</td>
                                        <td className="border border-white/20 p-3">{subject.exam}</td>
                                        <td className="border border-white/20 p-3">{subject.total}</td>
                                        <td className="border border-white/20 p-3">{subject.grade}</td>
                                    </tr>
                                ))}
                                </tbody>
                                </table>

                                {/* TOTAL */}
                                <div className="mt-6 text-white space-y-2">
                                    <p className="font-bold">Grand Total</p>
                                    {/* Fixed .toFixed implementation safely checks if average exists */}
                                    <p className="font-bold">
                                        Average: {typeof result.average === "number" ? result.average.toFixed(2) : result.average}
                                    </p>

                                    <button
                                    onClick={() =>
                                        handleDelete(
                                            result._id
                                        )
                                    }
                                    className="bg-red-600 text-white px-5 py-2 rounded-lg mt-4"
                                    >
                                        Delete Result
                                    </button>
                                    </div>
                                    </div>
                    ))}
                    </div>
            )}
            </div>
        </div>
    );
}