"use client";
import { useState } from "react"

export default function UploadPayment() {
    const [file, setFile] = useState<File | null>(null);

    // track all missing field required
    const [studentId, setStudentId] = useState("");
    const [totalFee, setTotalFee] = useState("");
        const [amountPaid, setAmountPaid] = useState("");
        const [session, setSession] = useState("2025/2026");
        const [term, setTerm] = useState("First Term");
    

    const upload = async () => {
        if (!file || !studentId || !totalFee || !amountPaid) {
            alert("Please fill in all required fields and select a receipt file.");
         return;
        }

        const formData = new FormData();
        formData.append("file", file);

        // append the extra text data
        formData.append("studentId", studentId);
        formData.append("totalFee", totalFee);
        formData.append("amountPaid", amountPaid);
        formData.append("session", session);
        formData.append("term", term);

        try {
        const response = await fetch("/api/payment/upload", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();

        if (response.ok) {
        alert("Uploaded successfully");
    
        // reset form fields
        setFile(null);
        setStudentId("");
        setTotalFee("");
        setAmountPaid("");
        } else {
            alert(`Upload failed: ${data.error || "Uknown backend error"}`);
        }
    } catch (error) {
        console.error("Error upoading:", error);
        alert("An error occurred during upload");
    }
};

    return (
        <div className="min-h-screen w-full flex flex-cols items-center justify-center bg-cover bg-center bg-no-reseat px-4 py-10"
        style={{
            backgroundImage: "url('/images/photo-4.jpg')"
        }}
        >

            <div className="bg-black/75 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/10 text-white max-w-md w-full">
            <h1 className="text-2xl font-bold mb-6 text-center tracking-wide border-b border-white/10 pb-3">
                Upload Payment Receipt
            </h1>

          <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Student Id</label>
            <input
            type="text"
            placeholder="STU-2069"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                    Total Fee
                </label>
                <input
                type="number"
                placeholder="0"
                value={totalFee}
                onChange={(e) => setTotalFee(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                    Amount Paid
                </label>
                <input
                type="number"
                placeholder="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-no-ne focus:border-blue-500 text-white placeholder-gray-400"
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                    Academic session
                    </label>
                    <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-white/20 rounded-md focus:outline-none focus:border-blue-500 text-white"
                    >
                        <option value="">Select Session</option>
                        {Array.from({ length: 5 }, (_, i) => {
                            const startYear = new Date().getFullYear() - 1 + i;
                            const endYear = startYear + 1;
                            const sessionString = `${startYear}/${endYear}`;
                            return (
                                <option key = {sessionString} value={sessionString}>
                                    {sessionString}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                        Term
                    </label>
                    <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-white/20 rounded-md focus:outline-none focus:border-blue-500 text-white"
                    >
                        <option value="First Term">First Term</option>
                        <option value="Second Term">Second Term</option>
                        <option value="Third Term">Third Term</option>
                    </select>
                </div>
            </div>

          <div className="mt-2">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Receipt Document
          </label>
            <input
            type="file"
            key={file ? "file-selected" : "file-cleared"}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
            </div>
        
        <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-white/10">
        {file && (
          <button
          onClick={() => setFile(null)}
          className="bg-red-600 hover:bg-red-700 text-white px-py-2 rounded-md font-medium transition duration-200"
          >
            Delete
          </button>
        )}

            <button
            onClick={upload}
            className="bg-blue-600 text-white px-4 py-2 ml-3"
            >
                Upload
            </button>
        </div>
        </div>
        </div>
        </div>
    );
}