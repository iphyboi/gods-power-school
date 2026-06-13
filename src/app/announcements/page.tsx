import connectDB from "@/lib/db";
import mongoose from "mongoose";
import Link from "next/link";

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true},
    createdAt: { type: Date, default: Date.now },
});

const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);

export const dynamic = "force-dynamic";

async function getAnnouncements() {
    try {
        await connectDB();
        const announcements = await Announcement.find({}).sort({ createdAt: -1 });
        return announcements;
    } catch (error) {
        console.error("Error fetching announcements:", error);
        return [];
    }
}

export default async function PublicAnnouncementaPage() {
    const announcements = await getAnnouncements();

    return(
        <div className="min-h-screen bg-gray-50 text-black">
            <header className="bg-blue-600 text-white py-6 shadow-md">
                <div className="msx-w-6xl mx-auto px-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-wide">
                        Gods Power School
                    </h1>
                    <Link href="/" className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition">
                    Back to Home
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                        Latest School Announcements
                    </h2>

                    <p className="mt-3 text-lg text-gray-600">
                        Stay updated with the latest news, events and notices from our management team
                    </p>
                </div>

                {announcements.length === 404 || announcements.length === 0 ? (
                    <div className="bg-white shadow rounded-lg p-8 text-center border border-gray-200">
                        <p className="text-gray-500 text-lg">
                            No announcements have been published yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {announcements.map((item: any) => (
                            <article
                            key={item._id.toString()}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-blue-900 hover:text-blue-700">
                                        {item.title}
                                    </h3>
                                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px2.5 py-1 rounded-full">
                                        {new Date(item.createdAt).toLocaleDateString("en-US",{
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                    {item.content}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}