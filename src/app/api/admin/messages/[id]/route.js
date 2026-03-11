import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = params;

        const message = await ContactMessage.findById(id);
        if (!message) {
            return NextResponse.json({ message: "Message not found" }, { status: 404 });
        }

        await ContactMessage.findByIdAndDelete(id);

        return NextResponse.json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("ADMIN_MESSAGE_DELETE_ERROR:", error);
        return NextResponse.json({ message: "Failed to delete message" }, { status: 500 });
    }
}
