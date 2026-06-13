"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
    _id: string;
    fullName: string;
    class: string;
}

export default function AddPaymentPage() {
    const router = useRouter();

    const [students, setStudents] = useState<Student[]>([]);
    const [studentId, setStudentId] = useState("");

    const [totalFee, setTotalFee] = useState("");
    const [amountPaid, setAmountPaid] = useState("");
    const [ paymentMethod, setPaymentMethod] = useState("Manual");
    const [ loading, setLoading] = useState(false);
    const [session, setSession] = useState("");
    const [term, setTerm] = useState("");

    /* FETCH STUDENTS */
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                console.log("Fetching students...");
                const res = await fetch("/api/students");
                const data = await res.json();
                console.log("DATA:", data);
                setStudents(
                    Array.isArray(data.students)
                    ? data.students
                    : []
                );

            } catch (err) {
                console.log(err);
                setStudents([]);
            }
        };

        fetchStudents();
    }, []);

    /* SUBMIT PAYMENT */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/payments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId,
                    session,
                    term,
                    totalFee: Number(totalFee),
                    amountPaid: Number(amountPaid),
                    paymentMethod,
                }),
            });

            const data = await res.json();
            alert(data.message);
            router.push("/dashboard/payments");
        } catch (err) {
            console.log(err);
            alert("Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl bg-white p-6 rounded-xl shadow-md border">
            <h1 className="text-3xl font-bold text-black mb-6">
                Add Payment
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* STUDENT SELECT */}
                <div>
                    <label className="block text-black mb-2">
                        Select Student
                    </label>
                 
                    <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full border p-3 rounded text-black"
                    required
                    >
                        <option value="">Select Student</option>
                        {students.map((s) => (
                            <option
                             key={s._id} 
                            value={s._id}
                            className="text-black bg-white"
                            >
                                {s.fullName} - {s.class}
                            </option>
                        ))}
                    </select>
                </div>

               { /* TOTAL FEE */}
               <div>
                <label className="block text-black mb-2">
                    Total Fee
                </label>

                <input
                type="number"
                value={totalFee}
                onChange={(e) => setTotalFee(e.target.value)}
                className="w-full border p-2 rounded text-black outline-non focus:border-blue-500"
                placeholder="Enter total fee amount"
                required
                />
               </div>

               <div>
                <label className="block mb-1 text-black">Session</label>
                <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full border p-2 rounded text-black"
                >
                    <option value="">Select Session</option>
                {Array.from({ length: 3 }).map((_, index) => {
                    const startYear = new Date().getFullYear() + index
                    const endYear = startYear + 1
                    const sessionValue = `${startYear}/${endYear}`

                    return (
                    <option key={sessionValue}
                    value={sessionValue}>
                        {sessionValue}
                    </option>
                )
                })}
                </select>
                </div>
               

               <div>
                <label className="block mb-1 text-black">Term</label>
                <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full border p-2 rounded text-black"
                >
                    <option value="">Select Term</option>
                    <option value="1st Term">1st Term</option>
                    <option value="2nd Term">2nd Term</option>
                    <option value="3rd Term">3rd Term</option>
                </select>
               </div>

               {/* AMOUNT PAID */}
               <div>
                <label className="block text-black mb-2">
                    Amount Paid
                </label>

                <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="w-full border p-3 rounded text-black"
                required
                />
               </div>

               {/* PAYMENT METHOD*/}
               <div>
                <label className="block text-black mb-2">
                    Payment Method
                </label>

                <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border p-3 rounded text-black"
                >
                    <option value="">Manual</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="POS">POS</option>
                </select>
               </div>

               {/* SUBMIT */}
               <button
               type="submit"
               disabled={loading}
               className="bg-green-600 text-white px-6 py-3 rounded w-full"
               >
                {loading ? "processing..." : "Submit Payment"}
               </button>
            </form>
        </div>
    );
} 