"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        alert("Thank you! Your message has been noted.");
        setFormData({ name: "", email: "", message: "", });
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center bg-zinc-950 py-12 px-4">

            {/* background image layer */}
            <div className="absolute inset-0 z-0">
                <Image
                src="/images/school-hallway.jpg"
                alt="Contact background"
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-75 object-center"
                />

                {/* subtle dark overlay */}
                <div className="absolute inset-0 bg-zinc-950/20" />
            </div>

            {/* contact form */}
    <div className="lg:col-span-5 bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl border border-zinc-800/80 text-white flex flex-col justify-between">
<div>
    <h1 className="text-3xl font-bold tracking-tight mb-2">
        Get in Touch
    </h1>
    <p className="text-zinc-400 text-sm mb-8">
        Have questions about admissions, academics? Reach out to our administration office directly.
    </p>

    <div className="space-y-6">
        {/* School Email */}
        <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75V10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 00 1-2.25-2.25v6.75m19.5" />
            </svg>
            </div>

            <div>
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Phone Number
                </h3>
                <p className="text-sm font-medium text-white mt-0.5">+234 8028751900</p>
                <p className="text-sm font-medium text-white mt-0.5">+234 8023228567</p>
            </div>
        </div>
    </div>
</div>

<div className="text-xs text-zinc-500 mt-8 pt-4 border-t border-zinc-800">
    School Hours: Monday -  Friday, 7:30 AM - 4:00 PM
</div>
    </div>

    {/* contact form */}
    <div className="lg:col-span-7 bg-zinc-800/60 backdrop-blur-md p-8 rounded-2xl border border-zinc-800/80 shadow-2xl text-white">
    <div className="mb-6">
       <h2 className="text-2xl font-bold tracking-tight">
        Send an Inquiry
       </h2>
       <p className="text-zinc-400 mt-2 text-sm">
        Click the button below to compose an email directly to our administration office.
       </p>
       </div>

       {/* this link triggers their emai*/}
       <a
       href="mailto:Tinaekpe.godspower@gmail.com?subject=School%20Portal%20Inquiry"
       className="inline-block w-full text-center bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150 text-sm mt-2 shadow-lg shadow-blue-600/20"
       >
        Open Email Client
       </a>
       </div>
       </main>
    );
}