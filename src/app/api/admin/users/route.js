import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const users = await User.find({}).sort({ createdAt: -1 }).select("-passwordHash").lean();

        return NextResponse.json(users);
    } catch (error) {
        console.error("ADMIN_USERS_GET_ERROR:", error);
        return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
    }
}
