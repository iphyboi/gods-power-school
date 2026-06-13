import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import Gallery from "@/models/Gallery";
import mongoose from "mongoose";
import connectDB from "@/lib/db";

// get all gallery items
export async function GET() {
    try {
        await connectDB();
        const items = await Gallery.find({}).sort({ createdAt: -1 });

        // return direct array 
        return NextResponse.json(items, { status: 200 });
    } catch (error: any) {
        console.error("Gallery GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
    }
}

// post upload image to cloudinary
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();
        const title = (formData.get("title") as string) || "Untitled Asset";
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ error: "No image file provided"}, { status: 400 });
        }

        // convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // upload to cloudinary
        const uploadResponse: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "school_gallery",
                    resource_type: "auto",
                 },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        const imageUrl = uploadResponse.secure_url;
        const mediaType = uploadResponse.resource_type;

        // save to mongoDb
        const newGalleryItem = await Gallery.create({
            title: title || "untitled Asset",
            imageUrl: imageUrl,
            mediaType: mediaType,
        });

        return NextResponse.json({ success: true, data: newGalleryItem}, { status: 201 });
    } catch (error: any) {
        console.error("Gallery POST Error:", error);
        return NextResponse.json({ error: error.message || "Upload process failed" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await connectDB();

        // parse the ?id=...
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, error: "Missing image record ID" }, { status: 400});
        }

        const deletedItem = await Gallery.findByIdAndDelete(id);

        if (!deletedItem) {
            return NextResponse.json({ success:false, error: "Image record not found" }, { status: 404});
        }

        return NextResponse.json({ success: true, message: "Photo removed successfully" }, { status:200});
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message}, { status: 500});
    }
}
