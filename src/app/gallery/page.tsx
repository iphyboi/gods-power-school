"use client";

import { useEffect, useState } from "react";
interface GalleryItem {
    _id: string;
    title: string;
    imageUrl: string;
    mediaType?: string;
}

export default function PublicGalleryPage() {
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchGallery = async () => {
        try {
            const res = await fetch("/api/gallery");
            const data = await res.json();
            if (Array.isArray(data)) {
                setImages(data);
            } else if (data && Array.isArray(data.data)) {
                setImages(data.data);
            }

        } catch (err) {
            console.error("Error fetching gallery:", err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    return (
        <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed relative py-12 px-4"
        style={{ backgroundImage: "url('/images/student-2.jpg')" }}
        >
            <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                        School Gallery
                    </h1>
                    <p className="mt-3 text-lg text-gray-200 drop-shadow-sm">
                        View our latest events and school highlights
                    </p>
                </header>
                  { loading ? (
                    <div className="text-center text-white text-xl font-medium mt-12">
                        Loading Gallery
            </div>

                  ) : images.length === 0 ? (
                    <div className="text-center text-gray-300 text-lg bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 max-w-xl mx-auto">
                        No gallery items available right now.
        </div>
    ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {images.map((img) => (
                    <div key={img._id}
                    className="overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
                        <div className="h-64 w-full bg-gray-900">
                            {img.mediaType === "video" ? (
                                <video
                                src={img.imageUrl}
                                className="w-full h-full object-contain bg-blackr"
                                controls
                                preload="metadata"
                                />
                            ) : (
                            <img
                            src={img.imageUrl}
                            alt={img.title || "Gallery item"}
                            className="w-full h-full object-contain bg-gray-900/50 transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            />
                            )}
                        </div>
                        {img.title && (
                            <div className="p-4 text-sm font-semibold text-white bg-black/40 backdrop-blur-xs">
                                {img.title}
                                </div>
                        )}
                        </div>
                  ))}
        </div>
        )}
    </div>
    </div>
    );
}