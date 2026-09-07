"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

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

  const [loading, setLoading] = useState(true);

  // Gallery upload
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleGalleryUpload = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a photo first!");
      return;
    }

    const formData = new FormData();

    formData.append("image", file);
    formData.append("title", "School Activity Image");

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

        const fileInput = document.getElementById(
          "galleryInput"
        ) as HTMLInputElement;

        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Something went wrong during the upload process.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your school activities and monitor important statistics.
        </p>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* STUDENTS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Students
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {loading ? "..." : stats.totalStudents}
              </h2>

              <p className="mt-2 text-xs text-blue-600 font-medium">
                Active Students
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
              👨‍🎓
            </div>

          </div>
        </div>

        {/* CLASSES */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Classes
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {loading ? "..." : stats.totalClasses}
              </h2>

              <p className="mt-2 text-xs text-purple-600 font-medium">
                Active Classrooms
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">
              🏫
            </div>

          </div>
        </div>

        {/* PAYMENTS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Payments
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {loading
                  ? "..."
                  : formatCurrency(stats.totalPayments)}
              </h2>

              <p className="mt-2 text-xs text-emerald-600 font-medium">
                Total Collection
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl">
              ₦
            </div>

          </div>
        </div>

        {/* RESULTS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Results
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {loading ? "..." : stats.totalResults}
              </h2>

              <p className="mt-2 text-xs text-amber-600 font-medium">
                Academic Records
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">
              📊
            </div>

          </div>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Quick Actions
            </h2>

            <p className="text-sm text-gray-500">
              Quickly access common administrative tasks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <Link
            href="/dashboard/students/add"
            className="bg-blue-600 text-white rounded-xl p-5 hover:bg-blue-700 transition"
          >
            <div className="text-2xl mb-3">👨‍🎓</div>

            <h3 className="font-semibold">
              Add Student
            </h3>

            <p className="text-sm text-blue-100 mt-1">
              Register a new student
            </p>
          </Link>

          <Link
            href="/dashboard/payments/add"
            className="bg-emerald-600 text-white rounded-xl p-5 hover:bg-emerald-700 transition"
          >
            <div className="text-2xl mb-3">💳</div>

            <h3 className="font-semibold">
              Record Payment
            </h3>

            <p className="text-sm text-emerald-100 mt-1">
              Register a student payment
            </p>
          </Link>

          <Link
            href="/dashboard/results/broadsheet"
            className="bg-purple-600 text-white rounded-xl p-5 hover:bg-purple-700 transition"
          >
            <div className="text-2xl mb-3">📋</div>

            <h3 className="font-semibold">
              Manage Results
            </h3>

            <p className="text-sm text-purple-100 mt-1">
              View academic records
            </p>
          </Link>

          <Link
            href="/dashboard/attendance"
            className="bg-orange-500 text-white rounded-xl p-5 hover:bg-orange-600 transition"
          >
            <div className="text-2xl mb-3">✓</div>

            <h3 className="font-semibold">
              Attendance
            </h3>

            <p className="text-sm text-orange-100 mt-1">
              Manage student attendance
            </p>
          </Link>

        </div>

      </div>

      {/* GALLERY UPLOAD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        <div className="mb-5">

          <h2 className="text-xl font-bold text-gray-900">
            Homepage Gallery
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Upload a school activity photo to the homepage gallery.
          </p>

        </div>

        <form
          onSubmit={handleGalleryUpload}
          className="flex flex-col md:flex-row gap-4 md:items-end"
        >

          <div className="flex-1">

            <label
              htmlFor="galleryInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Photo
            </label>

            <input
              id="galleryInput"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading
              ? "Uploading..."
              : "Publish to Homepage"}
          </button>

        </form>

      </div>

      {/* SYSTEM OVERVIEW */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        <h2 className="text-xl font-bold text-gray-900">
          System Overview
        </h2>

        <p className="text-sm text-gray-500 mt-1 mb-6">
          Current school management modules.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          <Link
            href="/dashboard/students"
            className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-center"
          >
            <div className="text-2xl mb-2">👥</div>
            <p className="text-sm font-medium text-gray-700">
              Students
            </p>
          </Link>

          <Link
            href="/dashboard/results/broadsheet"
            className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-center"
          >
            <div className="text-2xl mb-2">📚</div>
            <p className="text-sm font-medium text-gray-700">
              Results
            </p>
          </Link>

          <Link
            href="/dashboard/payments"
            className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-center"
          >
            <div className="text-2xl mb-2">💰</div>
            <p className="text-sm font-medium text-gray-700">
              Payments
            </p>
          </Link>

          <Link
            href="/dashboard/attendance"
            className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-center"
          >
            <div className="text-2xl mb-2">✓</div>
            <p className="text-sm font-medium text-gray-700">
              Attendance
            </p>
          </Link>

          <Link
            href="/dashboard/announcements"
            className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-center"
          >
            <div className="text-2xl mb-2">📢</div>
            <p className="text-sm font-medium text-gray-700">
              Announcements
            </p>
          </Link>

          <Link
            href="/dashboard/gallery"
            className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-center"
          >
            <div className="text-2xl mb-2">🖼️</div>
            <p className="text-sm font-medium text-gray-700">
              Gallery
            </p>
          </Link>

        </div>

      </div>

    </div>
  );
}