"use client";
import { useEffect, useState } from "react";

interface Announcement {
    _id: string;
    title: string;
    content: string;
    audience: string;
    createdAt: string;
}

export default function AnnouncementsPage() {
    const [ announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [title, setTitle] = useState("");
    const [ content, setContent] = useState("");
    const [ audience, setAudience] = useState("all");
    const [loading, setLoading] = useState(false);

    // FETCH ANNOUNCEMENTS
    const fetchAnnouncements = async () => {
        const res = await fetch("/api/announcements");
        const result = await res.json();
        setAnnouncements(result.data || []);
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    // CREATE ANNOUNCEMENT
    const handlesubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        setLoading(true);

        await fetch("/api/announcements", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                content,
                audience,
            }),
        });

        setTitle("");
        setContent("");
        setAudience("all");
        fetchAnnouncements();
        setLoading(false);
    };

    // DELETE ANNOUNCEMENT
    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("Delete this announcement?");
        if (!confirmDelete) return;

        await fetch(`/api/announcements/${id}`, {
            method: "DELETE",
        });

        fetchAnnouncements();
    };

    return (
        <div className="p-6 bg-transparent min-h-screen">
            <h1 className="text-3xl font-bold text-black mb-6">
                Announcement Management
            </h1>

            {/* FORM */}
            <form
            onSubmit={handlesubmit}
            className="w-full max-w-2xl bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg mb-8 space-y-4"
            >
                <input
                type="text"
                placeholder="Announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/90 border border-gray/300 p-3 rounded-md text-black placeholder-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />

                <textarea
                placeholder="Announcement content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-white/90 border border-gray/300 p-3 rounded-md text-black placeholder-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />

                <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-white/90 border border-gray/300 p-3 rounded-md text-black placeholder-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Everyone</option>
                    <option value="students">Students</option>
                    <option value="teachers">Teachers</option>
                    <option value="parents">Parents</option>
                </select>

                <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                >
                    {loading
                    ? "Publishing..."
                : "Publish Announcement"}
                </button>
            </form>

            {/* Announce list */}
            <div className="space-y-4">
                {Array.isArray(announcements) && announcements.map((item: any) => (
                    <div
                    key={item._id}
                    className="bg-transparent p-5 rounded-xl"
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-black">
                                    {item.title}
                                </h2>

                                <p className="text-gray-600 mt-2">
                                    {item.content}
                                </p>

                                <div className="mt-3 flex gap-3 text-sm">
                                    <span className="bg-gray-100 px-3 py-1 rounded">
                                        {item.audience}
                                    </span>
                                    <span className="text-gray-500">
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                            </div>
                            </div>
                ))}
            </div>
        </div>
    );
}