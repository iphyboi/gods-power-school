"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Announcements from "@/components/Announcements";
import { Span } from "next/dist/trace";

export default function HomePage() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false);
    const currentYear = new Date().getFullYear();
    const session = `${currentYear-1}/${currentYear}`;

    useEffect(() => {
        const hasTokenCookie = document.cookie
        .split(" ;")
        .find((row) => row.startsWith("token="));

        const userRole = localStorage.getItem("user_role");
        if (hasTokenCookie && userRole === "admin") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, []);

    return (
        <main className="w-full overflow-x-hidden">
            <section className="relative h-screen">
                <Image
                src="/images/school-building.jpg"
                alt="School Building"
                fill
                priority
                className="object-cover"
                />

                <div className="absolute inset-0 bg-black/70"></div>

                <div className="relative z-10 flex flex-col h-full">
                    <nav className="flex items-center justify-between px-6 md:px-12 py-5 text-white">
                        <div className="flex items-center gap-3">
                            <Image
                            src="/images/logo.png"
                            alt="School Logo"
                            width={50}
                            height={50}
                            style={{height: "auto" }}
                            className="rounded-full"
                            />

                            <h1 className="text-xl md:text-2xl font-bold">
                                GOD's Power International High School
                            </h1>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-0.5">
                                <span className="text-[10px] md:text-xs text-amber-400 font-bold tracking-wider uppercase">
                                    Govt. Approved for WAEC, NECO, NABTEB & JAMB CBT
                                    </span>
                                <span className="hidden sm:inline text-gray-400 text-xs">|</span>
                                <span className="text-[10px] md:text-xs text-blue-300 italic font-medium tracking-wide">
                                    "In God We Trust"
                                    </span>
                                    </div>
                        </div>

                        <div className="hidden md:flex items-center gap-8 text-lg">
                            <Link href="/">Home</Link>
                            <Link href="/about">About</Link>
                            <Link href="/contact">Contact</Link>
                            <Link href="/check-result">Check Result</Link>
                            

                            <div className="relative inline-block text-left">
                                <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                                className="hover:text-blue-200 transition-colors flex items-center gap-1 focus:outline-none">
                                    others <span className="text-xs ml-1">v</span>
                                </button>

                                {isDropdownOpen && (
                                    <>
                                <div className="fixed inset-0 z-40 bg-transparent cursor-default"
                                onClick={() => setIsDropdownOpen(false)}
                                />
                                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-2 origin-top-left">
                                    <Link    
                                    href="/upload-payment"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 hover:text-blue-600 rounded-xl font-medium transition-colors"
                                        >
                                            Upload payment proof
                                    </Link>

                                    <Link
                                    href="/attendance"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 hover:text-blue-600 transition border-t border-gray-100"
                                    >
                                        Track Attendance
                                    </Link>
                                </div>
                                </>
                                )}
                            </div>
                        </div>
                    </nav>

                    <div className="flex-1 flex items-center justify-center text-center px-6">
                        <div className="max-w-4xl text-white">
                            <h1 className="text-4xl md:text-7xl font-bold leading-tight mb-6">
                                Excellence Through Discipline and Learning
                            </h1>

                            <p className="text-lg md:text-2xl mb-8">
                                Raising future leaders through quality education,
                                academic Excellence, and moral discipline.
                            </p>

                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <Link
                                href="/login"
                                className="bg-blue-700 hover:bg-blue-800 px-8 py-4 rounded-lg text-lg font-semibold transition"
                                >
                                    Admin Login
                                </Link>

                                <Link
                                href="/contact"
                                className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold"
                                >
                                    Contact School
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* quick route link to the attendance  page */}
            <section className="bg-slate-900 py-12 px-6 text-center border-b border-white/5">
            <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">
                Track Student Attendance
            </h3>
            <p className="text-gray-400 text-sm mb-4">
                Parents can check daily terminal register attendance records using student ID
            </p>
            <Link
            href="/attendance"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-lg active:scale-95"
            >
                Open Attendance Portal
            </Link>
            </div>
            </section>

            <section className="bg-white py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between text-black mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-black">
                        Latest Announcement
                    </h2>

                    <Link
                    href="/dashboard/announcements"
                    className="text-blue-700 font-semibold">
                        View All
                    </Link>
                </div>

                {/* EMPTY ANNOUNCEMENT SPACE */}
                <Announcements />
            </div>
            </section>

            <section className="bg-gray-100 py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between text-black mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            School Gallery
                        </h2>

                        <Link
                        href="/gallery"
                        className="text-blue-700 font-semibold"
                        >
                            View Gallery
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl p-16 shadow text-center">
                        <p className="text-gray-500 text-lg">
                            Gallery photos
                        </p>
                    </div>
                </div>
            </section>


            {/* PAYMENT SECTION */}
            <section className="bg-gray-100 py-20 px-6 text-gray-900">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-center  text-gray-900 mb-10">
                        School Fees Payment Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 text-lg">
                        <div className="space-y-4">
                            <p className="text-black">
                                <span className="font-bold text-gray-900">
                                    Bank Name:
                                </span>{" "}
                                O'pay
                            </p>

                            <p className="text-black">
                                <span className="font-bold text-gray-900">
                                    Account Name:
                                </span>{" "}
                                TINA EKPE
                            </p>

                            <p className="text-black">
                                <span className="font-bold text-gray-900">
                                    Account Numer:
                                </span>{" "}
                                6141609967
                            </p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-black">
                                <span className="font-bold text-gray-900">
                                    session:
                                </span>{" "}
                                {session}
                            </p>

                            <p className="text-black">
                                <span className="font-bold text-gray-900">
                                    Payment Notice:
                                </span>{" "}
                                Parent should upload proof of payment
                                through the student portal after transfer.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {isAdmin && (
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Quick Access
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Link
                        href="/dashboard/students"
                        className="bg-blue-700 text-white p-10 rounded-2xl text-center hover:scale-105 transition"
                        >
                            <h3 className="text-2xl font-bold mb-3">
                                Student Management
                            </h3>

                            <p>
                                Manage student record and classes
                            </p>
                        </Link>

                        <Link
                        href="/dashboard/payments"
                        className="bg-black text-white p-10 rounded-2xl text-center hover:scale-105 transition"
                        >
                            <h3 className="text-2xl font-bold mb-3">
                                Payment Portal
                            </h3>

                            <p>
                                View School Fee Payment Records
                            </p>
                        </Link>

                        <Link
                        href="/dashboard"
                        className="bg-gray-800 text-white p-10 rounded-2xl text-center hover:scale-105 transition"
                        >
                            <h3 className="text-2xl font-bold mb-3">
                                School Dashboard
                            </h3>

                            <p>
                                Access school administrative dashboard
                            </p>
                        </Link>
                    </div>
                </div>
            </section>
            )}

            <footer className="bg-black text-white py-10 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        GOD'S Power International High School
                    </h2>
                    <p className="mb-2 text-black">
                        Excellence Through Discipline and Learning
                    </p>
                </div>
            </footer>
        </main>
    );
}