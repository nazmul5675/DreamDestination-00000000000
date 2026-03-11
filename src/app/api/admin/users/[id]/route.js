import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
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

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Prevent self-deletion
        if (user.email === session.user.email) {
            return NextResponse.json({ message: "You cannot delete your own admin account" }, { status: 400 });
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("ADMIN_USER_DELETE_ERROR:", error);
        return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = params;
        const { role } = await req.json();

        if (!['user', 'admin'].includes(role)) {
            return NextResponse.json({ message: "Invalid role" }, { status: 400 });
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Prevent self-role-change to ensure at least one admin exists
        if (user.email === session.user.email) {
            return NextResponse.json({ message: "You cannot change your own role" }, { status: 400 });
        }

        user.role = role;
        await user.save();

        return NextResponse.json({ message: "User role updated successfully" });
    } catch (error) {
        console.error("ADMIN_USER_PATCH_ERROR:", error);
        return NextResponse.json({ message: "Failed to update user role" }, { status: 500 });
    }
}
