"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 md:px-12 py-4 bg-slate-900 text-white border-b border-slate-800">
            {/* brand & logo */}
            <div className="flex items-center gap-3">
                <Image
                src="/images/logo.png"
                 alt="/School Logo"
                 width={50}
                 height={50}
                 style={{ height: "auto" }}
                 className="rounded-full"
                 />
                 <div>
                    <h1 className="text-xl md:text-2xl font-bold">
                        GOD'S Power International High School
                    </h1>
                    <div className="flex flex-col items-center md:items-start gap-1 mt-1 text-center md:text-left">
                        <span className="text-[10px] md:text-xs text-amber-400 font-bold tracking-wider">
                            Govt. Approved for WAEC, NECO, NABTEB & JAMB CBT
                        </span>
                        <span className="text-[10px] md:text-xs text-blue-300 italic font-medium tracking-wide">
                            "In God We Trust"
                        </span>
                    </div>
                 </div>
            </div>
            {/* navigation links */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4">
                <Link href="/" className="hover:text-blue-400 transition-colors">
                Home
                </Link>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                About
                </Link>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                Contact
                </Link>
                <Link
                href="/check-result"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition-colors"
                >
                    Check Result
                </Link>
                {/* Dropdown Menu*/}
                <div className="relative inline-block text-left">
                    <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="hover:text-blue-200 transition-colors flex items-center gap-1 focus:outline-none cursor-pointer"
                    >
                        others <span className="text-xs ml-1">V</span>
                    </button>

                    {isDropdownOpen && (
                        <>
                        <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setIsDropdownOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 py-2">
                            <Link
                            href="/upload-payment"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                            >
                                Upload Payment Proof
                            </Link>
                            <Link
                            href="/attendance"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                            >
                                Track Attendance
                            </Link>
                        </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
