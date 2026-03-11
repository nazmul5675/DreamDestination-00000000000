import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json(messages);
    } catch (error) {
        console.error("ADMIN_MESSAGES_GET_ERROR:", error);
        return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 });
    }
}
