"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface GalleryItem {
    id?: string;
    _id: string;
    title: string;
    imageUrl: string;
}

export default function AdminGalleryPage() {
    const router = useRouter();
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/gallery");
            const data = await res.json();
            if (Array.isArray(data)) {
                setImages(data);
            } else if (data && Array.isArray(data.data)) {
                setImages(data.data);
            } else if (data && Array.isArray(data.images)) {
                setImages(data.images);
            } else {
                console.warn("API responded, but no array structure was found:", data);
            }
        } catch (err) {
            console.error("Error fetching gallery:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!file) return alert("Please select an image file first");

      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);

      try {
        const res = await fetch("/api/gallery", {
             method: "POST",
              body: formData,
             });
        const data = await res.json();

        if (data.success || res.ok) {
            setTitle("");
            setFile(null);
            const fileInput = document.getElementById("fileInput") as HTMLInputElement;
            if (fileInput) fileInput.value = "";

            alert("photo uploaded successfully!");
            await fetchGallery();
        } else {
            alert("An error occurred during upload");
        }
    } catch (err) {
        console.error("Upload error:", err);
        alert("An error occurred during upload");
    
        } finally {
            setUploading(false);
        }
        };

        const handleDelete = async (id: string) => {
            if (!id) return alert("Invalid image ID");
            if (!confirm("Are you sure you want to delete this photo?")) return;

            try {
                const res = await fetch(`/api/gallery/${id}`, { 
                    method: "DELETE",
                });
                const data = await res.json();

                if (res.ok) {
                    alert("Photo deleted successfully!");

                    setImages((prev) => prev.filter((img) => (img._id || img.id) !== id));
                } else {
                    alert("Failed to delete image");
                }
            } catch (err) {
                console.error("Delete error:", err);
                alert("An error occurred during deletion");
            }
        };

        return (
            <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed relative py-12 px-4 flex flex-col items-center justify-start gap-8"
            style={{ backgroundImage: "url('/images/student-1.jpg')"}}
            >
                <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <header className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                            Admin Gallery Management
                        </h1>
                        <p className="mt-3 text-lg text-gray-200 drop-shadow-sm">
                            Upload new content or remove existing photos from homepage view
                        </p>
                    </header>

                    {/* upload form layout*/}
                    <div className="max-w-xl mx-auto bg-black/60 border border-white/10 p-6 rounded-xl shadow-2xl">
                    <h2 className="text-xl font-bold mb-4 text-white">Upload New School Media</h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Image Title</label>
                            <input
                            type="text"
                            placeholder="e.g. inter-class debate"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                         className="w-full px-4 py-2.5 rounded-xl bg-black/30 text-white border border-white/10 focus: outline-none"
                         />
                        </div>
                        <div>
                            <label className="bock text-sm font-medium text-gray-200 mb-1">Choose Photo</label>
                            <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white"
                            />
                        </div>

                        <button 
                        type="submit" 
                        disabled={uploading} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl"
                        >
                            {uploading ? "Uploading to cloudinary..." : "Upload photo to Gallery"}
                        </button>
                    </form>
                    </div>

                    {/* dynamic items inventory*/}
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Current Gallery Inventory</h3>
                        {loading ? (
                            <div className="text-center text-white">Loading...</div>
                        ) : !images || images.length === 0 ? (
                            <div className="text-center text-gray-300 py-8 bg-white/5 rounded-xl border border-white/10">
                                No images found.
                                </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {images.map((img: any) => {
                                    const imageId = img._id || img.id;
                                    return (
                                    <div
                                     key={imageId} 
                                     className="group relative h-64 w-full rounded-xl bg-black/40 border border-white/20 overflow-hidden shadow-lg"
                                     >
                                        {img.mediaType === "video" ? (
                                            <video
                                            src={img.imageUrl}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            controls
                                            preload="metadata"
                                            />
                                        ) : (
                                            <img
                                             src={img.imageUrl} 
                                             alt={img.title || "Gallery photo"} 
                                             className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                              />
                                        )}
                                            
                                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/70 backdrop-blur-sm text-white flex justify-between items-center z-10">
                                            <span className="truncate text-sm font-medium mr-2">
                                                {img.title || "Untitled Image"}
                                                </span>
                                            <button
                                            type="button"
                                             onClick={() => handleDelete(imageId)} 
                                             className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                                             >
                                                Delete
                                            </button>
                                            </div>
                                            </div>
                                    );
})}
                                </div>
                       )}
                    </div>
                    </div>
            </div>
        );
      }
    