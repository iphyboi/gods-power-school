import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Announcement from "@/models/Announcement";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{id: string}>}
) {
    try {
        await connectDB();
        const body = await req.json();
        const { id } = await params;
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            id,
            body,
            { returnDocument: "after" }
        );

        return NextResponse.json(updatedAnnouncement);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update announcement" },
            { status: 500 }
        );
    }
}

// DELETE
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string}>}
) {
    try {
        await connectDB();
        const { id } = await params;
        await Announcement.findByIdAndDelete(id);

        return NextResponse.json({
            message: "Announcement deleted",
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to delete announcement" },
            { status: 500 }
        );
    }
}