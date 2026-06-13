import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Gallery from "@/models/Gallery";
import { Types } from "mongoose";

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string}> }
) {
try {

    await connectDB();

    // get the dynamic id from the URL
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json({ error: "Missing image ID" }, { status: 400});
    }

    const objectId = new Types.ObjectId(id);

    const deletedImage = await Gallery.findByIdAndDelete(objectId);

    if (!deletedImage) {
        return NextResponse.json(
            { error: "Image not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { message: "Photo removed successfully from dashboard" },
        { status: 200 }
    );
} catch (error: any) {
    console.error("Delete API Error:", error);
    return NextResponse.json(
        { error: "Failed to delete photo", details: error.message },
        { status: 500 }
    );
}
}
