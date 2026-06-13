"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Payment {
    _id: string;
    studentId: {
        name: string;
        class: string;
    };

    totalFee: number;
    amountPaid: number;
    balance: number;
    status: string;
    paymentMethod: string;
    session: string;
    term: string;
}

interface Student {
    _id: string;
    fullName: string;
    class?: string;
}

export default function PaymentsPage() {
    const [activeTab, setActiveTab] = useState<"view" | "add">("view");
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState("2025/2026");
    const [term, setTerm] = useState("First Term");
    const [file, setFile] = useState<File | null>(null);

    //Form handling states for creating new records
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [formTotalFee, setFormTotalFee] = useState("");
    const [formAmountPaid, setFormAmountPaid] = useState("");
    const [formPaymentMethod, setFormPaymentMethod] = useState("Cash");
    const router = useRouter();
    

        const fetchPayments = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/payments");
                const data = await res.json();
                setPayments(data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchStudents = async () => {
        try {
        const res = await fetch("/api/students");
        if (res.ok) {
        const data = await res.json();
        const studentArray = Array.isArray(data) ? data : data.students || [];
        setStudents(studentArray);
        }
    } catch (err) {
        console.log("Error loading students:", err);
        setStudents([]);
    }
};

useEffect(() => {
    fetchPayments();
    fetchStudents();
}, [activeTab]);

const handleAddNewPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const total = Number(formTotalFee);
    const paid = Number(formAmountPaid);
    const calculatedBalance = total - paid;
    const computedStatus = calculatedBalance <= 0 ? "Paid" : "Part Payment";

    try {
        const res = await fetch("/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                studentId: selectedStudent._id,
                totalFee: total,
                amountPaid: paid,
                balance: calculatedBalance,
                status: computedStatus,
                paymentMethod: formPaymentMethod,
                session: session,
                term: term,
            }),
        });

        if (res.ok) {
            alert(`Payment log recorded cleanly for ${selectedStudent.fullName}!`);
            setSelectedStudent(null);
            setFormTotalFee("");
            setFormAmountPaid("");
            setActiveTab("view");
        } else {
            alert("Failed to record new payment record.");
        }
    } catch (error) {
        console.error(error);
    }
};

const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment receipt?")) return;
    try {
        const res = await fetch(`/api/payment/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            alert("payment record deleted successfully!");
            window.location.reload();
        } else {
            const data = await res.json();
            alert (`Failed to delete: ${data.error || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error deleting payment receipt:", error);
        alert("An error occurred while deleting the payment.");
    }
}

    return (
        <div className="p-2">
            {/* HEADER SECTION */}
            <div className="flex flex-cols md:flex-row justify-between items-start md:items-center border-b pb-4 mb-6 gap-4">
                <div>
            <h1 className="text-3xl font-bold text-black mb-6">Payments</h1>
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md mt-1 border border-slate-800">
                <span className="text-blue-400 font-extrabold uppercase tracking-wider text-10px]">Active Selection</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-white">{session}</span>
                <span className="text-slate-600">|</span>
                <span className="text-yellow-400">{term}</span>
            </div>
            </div>

            <div className="flex flex-wrap gap-3 items-cente">
                <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm font-medium text-black bg-white shadow-sm focus:outline-none"
                >
                    {Array.from({ length: 4}, (_, index) => {
                        const startYear = new Date().getFullYear() - 2 + index;
                        const endYear = startYear + 1;
                        const sessionString = `${startYear}/${endYear}`;
                        return (
                            <option key={sessionString} value={sessionString}>
                                {sessionString}
                            </option>
                        );
                    })}
                </select>

                <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm text-black bg-white shadow-sm focus:outline-none"
                >
                    <option value="First Term" className="text-black bg-white">First Term</option>
                    <option value="Second Term" className="text-black bg-white">Second Term</option>
                    <option value="Third Term" className="text-black bg-white">Third Term</option>
                </select>

                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg border">
                    <button
                    onClick={() => setActiveTab("view")}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${
                        activeTab === "view" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
                    }`}
                    >
                        View
                    </button>

                    <button
                    onClick={() =>setActiveTab("add")}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${
                        activeTab === "add" ? "bg-white text-blue=600 shadow-sm" : "text-gray-600"
                    }`}
                    >
                        + Add New
                    </button>
                </div>
                </div>
                </div>

                { activeTab === "view" && (
                    <div className="bg-white rounded-xl shadow-md border overflow-hidden">
                {loading ? (
                    <p className="p-5 text-black">Loading...</p>
                ) : payments.length === 0 ? (
                    <p className="p-5 text-black">No payments found</p>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-left text-black">Student</th>
                                    <th className="p-4 text-left text-black">Class</th>
                                    <th className="p-4 text-left text-black">Total Fee</th>
                                    <th className="p-4 text-left text-black">Paid</th>
                                    <th className="p-4 text-left text-black">Balance</th>
                                    <th className="p-4 text-left text-black">Action</th>
                                    <th className="p-4 text-left text-black">Status</th>
                                    <th className="p-4 text-left text-black">Method</th>
                                    <th className="p-4 text-left text-black">Session</th>
                                    <th className="p-4 text-left text-black">Term</th>
                                    <th className="p-4 text-left text-black">Receipt proof</th>
                            </tr>

                        </thead>

                        <tbody>
                            {payments.map((p) => (
                                <tr key={p._id} className="border-t">
                                    <td className="p-4 text-black">
                                        {(p.studentId as any)?.fullName || "Unknown Student"}
                                    </td>

                                    <td className="p-4 text-black font-bold text-base tracking-wide">
                                        {p.studentId?.class}
                                    </td>

                                    <td className="p-4 text-black font-semibold text-base">
                                        &#8358;{p.totalFee}
                                    </td>

                                    <td className="p-4 text-green-700 font-bold text-base">
                                        &#8358;{p.amountPaid}
                                    </td>

                                    <td className="p-4 text-red-600 font-bold text-base">
                                        &#8358;{p.balance}
                                    </td>

                                    <td className="p-4 text-red-600 font-bold text-base">
                                        <button
                                        onClick={() => handleDelete(p._id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition duration-200"
                                        >
                                            Delete
                                        </button>
                                    </td>

                                    <td className="p-4 text-base">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            p.status === "Fully paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                        {p.status}
                                        </span>
                                    </td>

                                    <td className="p-4 text-slate-800 font-medium text-base">
                                        {p.paymentMethod}
                                    </td>

                                    <td className="p-4 text-black font-bold text-base">
                                        {p.session}
                                    </td>

                                    <td className="p-4 text-black font-bold text-base">
                                    {p.term}
                                    </td>

                                    <td className="p-4">
                                        {(p as any).receiptUrl ? (
                                            <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden bg-gray-50 hover:opacity-80 transition-opacity">
                                                <a
                                                 href={(p as any).receiptUrl}
                                                 target="_blank"
                                                 rel="noopener noreferrer"
                                                 className="block w-full h-full"
                                                 >
                                                <img
                                                src={(p as any).receiptUrl}
                                                alt="Receipt thumb"
                                                className="w-full h-full object-cover cursor-pointer"
                                                />
                                                </a>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">No file (cash)</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>
                )}

            {activeTab === "add" && (
                <div className="grid grid-cols-1 md;grid-cols-2 gap-6 items-start">
                    <div className="bg-white p-4 rounded-xl shadow-md border">
                        <h3 className="font-semibold mb-3 text-black text-lg">Select Registered Student</h3>
                        {students.length === 0 ? (
                            <p className="text-gray-500 text-sm">No registered students available.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
                                {students.map((student) => (
                                    <li
                                     key={student._id}
                                     onClick={() => setSelectedStudent(student)} 
                                    className={`py-3 flex justify-between items-center cursor-pointer rounded-lg transition my-1 ${
                                        selectedStudent?._id === student._id
                                        ? "bg-blue-50 border border-blue-200"
                                        : "hover:bg-gray-50 bg-white"
                                    }`}
                                    >
                                        <div>
                                            <p className="font-medium text-black">{student.fullName}</p>
                                            <p className="text-xs text-gray-500">Class: {student.class || "Unassigned"}</p>
                                            </div>

                                        <button
                                        type="button"
                                        onClick={() => setSelectedStudent(student)}
                                        className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
                                            selectedStudent?._id === student._id ? "bg-green-600 text-white" : "bg-lue-600 text-white"
                                        }`}
                                        >
                                            {selectedStudent?._id === student._id ? "Selected" : "Collected"}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border">
                        {selectedStudent ? (
                            <form onSubmit={handleAddNewPayment} className="space-y-4">
                                <h3 className="font-semibold text-lg text-black border-b pb-2">
                                    Recording Bill for: <span className="text-blue-600">{selectedStudent.fullName}</span>
                                </h3>

                                <div className="p-3 bg-blue-50 text-blue-800 text-xs font-medium rounded-md">
                                    Applying transaction to: <strong>{session} ({term})</strong>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-black mb-1">Total Expected Fee (&#8358;)</label>
                                    <input
                                    type="number"
                                    required
                                    placeholder="0"
                                    value={formTotalFee}
                                    onChange={(e) => setFormTotalFee(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm text-black focus:outline-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-black mb-1">Amount Paid (&#8358;)</label>
                                    <input
                                    type="number"
                                    required
                                    placeholder="0"
                                    value={formAmountPaid}
                                    onChange={(e) => setFormAmountPaid(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm text-black focus:outline-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-blue mb-1 text-black">
                                        Payment Method
                                    </label>
                                    <select
                                    value={formPaymentMethod}
                                    onChange={(e) => setFormPaymentMethod(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm text-black focus:outline-blue-500"
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="POS">POS</option>
                                    </select>
                                </div>

                                <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-md text-sm transition"
                                >
                                    Save Payment & View History
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-20 text-gray-400">
                                <p className="text-sm">Please Select a student from the action list to populate the collection form layout.</p>
                                </div>
                        )}
                    </div>
                </div>
            )}
            </div>
);
}