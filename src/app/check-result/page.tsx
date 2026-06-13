"use client";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


export default function CheckResultPage() {
    const [studentId, setStudentId] = useState("");

    const [result, setResult] = useState<any>(null);

    const handleCheck = async () => {
        if (!studentId.trim()) {
            alert("please enter a student ID");
            return;
        }
        try {
          setResult(null);
        const res = await fetch(`/api/results/${studentId}`);

        const data = await res.json();
        if (!res.ok) {
            alert(data.message || "error occured while fetching the result.");
            return;
        }
        console.log("Data received successfully:", data);
        setResult(data)
    } catch (error) {
        console.error("frontend fetch error:", error);
        alert("Failed to connect to the server.");
    }
    };

    const downloadPDF = async () => {
        const input = document.getElementById("result-card");

        if(!input) return;

        try {
        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
            onclone: (clonedDocument) => {
                const clonedInput = clonedDocument.getElementById("result-card");
                if (clonedInput) {
                    clonedInput.style.fontFeatureSettings = "unset";
                
                    const allElements = clonedInput.getElementsByTagName("*");
                    for (let i = 0; i < allElements.length; i++) {
                        const el = allElements[i] as HTMLElement;
                        const style = window.getComputedStyle(el);

                        if (
                            style.backgroundColor.includes("oklch") ||
                            style.backgroundColor.includes("lab")
                        ) {
                            el.style.backgroundColor = "transparent";
                        }

                        if (
                            style.color.includes("oklch") ||
                            style.color.includes("lab")
                        ) {
                            el.style.color = "#333333";
                        }
                    }
                }
                        }
                    });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${result.fullName}-result.pdf`);
    } catch (error) {
        console.error("PDF generation error:", error);
        alert("Failed to download PDF.");
    }
};

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-black">
                    check Result
                </h1>

                <div className="flex gap-4 mb-8 text-black">
                    <input
                    type="text"
                    placeholder="Enter ID Number"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="border p-3 rounded w-full"
                    />

                    <button
                    onClick={handleCheck}
                    className="bg-blue-600 text-white px-6 rounded"
                    >
                        check
                    </button>
                </div>

                {result && result.studentName && (
                    <div id="result-card" className="border p-6 rounded-lg">

                        <div>
                            <h2 className="text-2xlfont-bold text-black">
                                {result.studentName}
                            </h2>

                            <p className="text-black">
                                Student ID:
                                {" "}
                                {result.studentId}
                            </p>

                            <p className="text-black">
                                Class:
                                {" "}
                                {result.class}
                            </p>

                            <p className="text-black">
                                Term:
                                {" "}
                                {result.term}
                            </p>

                            <p className="text-black">
                                Session:
                                {" "}
                                {result.session}
                            </p>
                            </div>

                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200 text-black">
                                        <th className="border p-3">Subject</th>
                                        <th className="border p-3">CA</th>
                                        <th className="border p-3">Exam</th>
                                        <th className="border p-3">Total</th>
                                        <th className="border p-3">Grade</th>
                                        
                                    </tr>
                                </thead>

                                <tbody>
                                    {result.subjects.map(
                                        (
                                            subject: any,
                                            index: number
                                        ) => (
                                            <tr key={index}>
                                                <td className="border p-3 text-black">
                                                    {
                                                        subject.subjectName
                                                    }
                                                </td>

                                                <td className="border p-3 text-black">
                                                    {subject.ca}
                                                </td>

                                                <td className="border p-3 text-black">
                                                    {
                                                        subject.exam
                                                    }
                                                </td>

                                                <td className="border p-3 text-black">
                                                   {subject.total}
                                                </td>

                                                <td className="border p-3 text-black">
                                                     {subject.grade}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>

                            <div className="space-y-2 pt-4 border-t">
                                <p className="font-bold text-black">
                                    Grand Total
                                       {" "}
                                    {result.average}
                                </p>

                                <button
                                 onClick={downloadPDF}
                                 className="bg-green-600 text-white px-4 py-2 rounded mt-4"
                                 >
                                    Download Result PDF
                                 </button>
                                </div>
                                </div>
                )}
            </div>
        </div>
    );
}