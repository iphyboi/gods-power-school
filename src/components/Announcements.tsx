"use client";

import { useEffect, useState } from "react";

export default function Announcements() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                const res = await fetch("/api/announcements", {
                    cache: "no-store",
                });

                if (res.ok) {
                    const result = await res.json();
                    setAnnouncements(result.data || []);
                }
            } catch (error) {
                console.error("Error loading announcements:", error)
            } finally {
                setLoading(false);
            } 
        }

        fetchAnnouncements();
    }, []);

    if (loading) {
        return <p className="text-gray-500">Loading announcements...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-4 text-left">
            {announcements.length === 0 ? (
                <p className="text-gray-500 text-lg">No announcements available</p>
            ) : (
                announcements.map((item: any) => (
                    <div key={item._id} className="border p-5 rounded-lg bg-white shadow-sm">
                        <h3 className="text-xl font-bold text-black">{item.title}</h3>
                        <p className="mt-2 text-gray-700">{item.content}</p>
                        </div>
                ))
            )}
        </div>
    );
}