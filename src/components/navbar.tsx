"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [studentServicesOpen, setStudentServicesOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    setStudentServicesOpen(false);
    setAttendanceOpen(false);
  };

  return (
    <header className="relative z-50 bg-slate-950 text-white">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo + School Name */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex min-w-0 items-center gap-3"
          >
            <Image
              src="/images/logo.png"
              alt="God's Power International High School Logo"
              width={52}
              height={52}
              priority
              className="h-12 w-12 shrink-0 rounded-full object-cover"
            />

            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold sm:text-base md:text-lg">
                GOD'S Power International High School
              </h1>

              <p className="mt-1 hidden text-[10px] font-bold tracking-wide text-amber-400 sm:block">
                Govt. Approved for WAEC, NECO, NABTEB & JAMB CBT
              </p>

              <p className="hidden text-[10px] italic text-blue-300 sm:block">
                "In God We Trust"
              </p>
            </div>
          </Link>

          {/* Hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {menuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Menu */}
        {menuOpen && (
          <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900 p-3 shadow-2xl">
            
            {/* Home */}
            <Link
              href="/"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 font-medium transition hover:bg-slate-800 hover:text-blue-400"
            >
              Home
            </Link>

            {/* About */}
            <Link
              href="/about"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 font-medium transition hover:bg-slate-800 hover:text-blue-400"
            >
              About
            </Link>

            {/* Announcements */}
            <Link
              href="/announcements"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 font-medium transition hover:bg-slate-800 hover:text-blue-400"
            >
              Announcements
            </Link>

            {/* Gallery */}
            <Link
              href="/gallery"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 font-medium transition hover:bg-slate-800 hover:text-blue-400"
            >
              Gallery
            </Link>

            {/* Student Services */}
            <div className="border-t border-slate-800">
              <button
                type="button"
                onClick={() =>
                  setStudentServicesOpen((prev) => !prev)
                }
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 font-medium transition hover:bg-slate-800 hover:text-blue-400"
              >
                <span>Student Services</span>

                <span
                  className={`text-sm transition-transform ${
                    studentServicesOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {studentServicesOpen && (
                <div className="ml-3 border-l border-slate-700 pl-3">
                  <Link
                    href="/upload-payment"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Upload Payment Proof
                  </Link>

                  <Link
                    href="/upload-payment"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Check Payment Status
                  </Link>
                </div>
              )}
            </div>

            {/* Attendance */}
            <div className="border-t border-slate-800">
              <button
                type="button"
                onClick={() =>
                  setAttendanceOpen((prev) => !prev)
                }
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 font-medium transition hover:bg-slate-800 hover:text-blue-400"
              >
                <span>Attendance</span>

                <span
                  className={`text-sm transition-transform ${
                    attendanceOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {attendanceOpen && (
                <div className="ml-3 border-l border-slate-700 pl-3">
                  <Link
                    href="/attendance"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Track Attendance
                  </Link>

                  <Link
                    href="/attendance"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Attendance Portal
                  </Link>
                </div>
              )}
            </div>

            {/* Check Result */}
            <Link
              href="/check-result"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 font-medium transition hover:bg-slate-800 hover:text-blue-400"
            >
              Check Result
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 font-medium transition hover:bg-slate-800 hover:text-blue-400"
            >
              Contact
            </Link>

            {/* Admin Login */}
            <div className="border-t border-slate-800 pt-2">
              <Link
                href="/login"
                onClick={closeMenu}
                className="block rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold transition hover:bg-blue-700"
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}