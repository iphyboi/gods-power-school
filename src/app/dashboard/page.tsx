"use client";
import React, { useEffect, useState } from "react";
interface DashboardStats {
    totalStudents: number;
    totalPayments: number;
    totalResults: number;
    totalClasses: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        totalPayments: 0,
        totalResults: 0,
        totalClasses: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);

    //gallery upoad state variables
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/dashboard-stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    // format payments automatically
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }).format(amount)
    };

    // image upload handle function
    const handleGalleryUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Please select a photo first!");

        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", "School activity Image");
        try {
            setUploading(true);
            const res = await fetch("/api/gallery", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                alert("Photo uploaded successfully to the homepage gallery!");
                setFile(null);
                const fileInput = document.getElementById("galleryInput") as HTMLInputElement;
                if (fileInput) fileInput.value = "";
            } else {
                alert (`Upload failed: ${data.error}`);
            }
        } catch (err) {
            console.error("Error uploading:", err);
            alert("something went wrong during the upload process.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                {/* TOTAL STUDENTS CARD */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-gray-600 text-sm font-medium">Total Students</h2>
                        <p className="text-3xl font-border text-black">
                            {loading ? "..." : stats.totalStudents}
                        </p>
                    </div>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                        Active Students
                    </span>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-gray-600 text-sm font-medium">Total Classes</h2>
                        <p className="text-3xl font-bold text-black">
                            {loading ? "..." : stats.totalClasses}
                        </p>
                    </div>
                    <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                        Classrooms
                    </span>
                </div>

                {/*payments cards*/}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-gray-600 text-sm font-medium">Payments</h2>
                        <p className="text-3xl font-bold text-black">
                            {loading ? "..." : formatCurrency(stats.totalPayments)}
                        </p>
                    </div>

                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        Collection Total
                    </span>
                </div>

                 {/* RESULT UPLOAD CARD*/}
                 <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-gray-600 text-sm font-medium">Result Upload</h2>
                        <p className="text-3xl font-bold text-black">
                            {loading ? "..." : stats.totalResults}
                        </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                        Academic Records
                    </span>
                 </div>
            </div>

           
                        <button
                        type="submit"
                        disabled={uploading}
                        className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        >
                            {uploading ? "processing Cloudinary Stream..." : "Publish to homepage"}
                        </button>
            </div>
    );
}