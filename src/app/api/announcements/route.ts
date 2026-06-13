import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Announcement from "@/models/Announcement";

// GET ALL ANNOUNCEMENTS
export async function GET() {
    try {
        await connectDB();

        const announcements = await Announcement.find().sort({
            createdAt: -1,
        });
        console.log("API DB FETCHED DATA:", announcements);

        return NextResponse.json({ success: true, data: announcements}, { status: 200 });
    } catch (error) {
        console.error("GET API Error:", error);
        return NextResponse.json(
            { message: "Failed to fetch announcements" },
            { status: 500 }
        );
    }
}

// CREATE ANNOUNCEMENT
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const announcement = await Announcement.create(body);

        return NextResponse.json({ success: true, data: announcement}, { status: 201});
    } catch (error) {
        console.error("POST API Error:", error);
        return NextResponse.json(
            { message: "Failed to create announcement" },
            { status: 500 }
        );
    }
}