import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Destination from "@/models/Destination";
import ContactMessage from "@/models/ContactMessage";
import ConsultationRequest from "@/models/ConsultationRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const [userCount, destinationCount, messageCount, consultationCount] = await Promise.all([
            User.countDocuments(),
            Destination.countDocuments(),
            ContactMessage.countDocuments(),
            ConsultationRequest.countDocuments(),
        ]);

        return NextResponse.json({
            stats: {
                users: userCount,
                destinations: destinationCount,
                messages: messageCount,
                consultations: consultationCount,
            }
        });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
    }
}
