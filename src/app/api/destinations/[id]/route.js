import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Destination from "@/models/Destination";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const destination = await Destination.findById(id).lean();

        if (!destination) {
            return NextResponse.json({ message: "Destination not found" }, { status: 404 });
        }

        return NextResponse.json(destination);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching destination" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = params;

        const destination = await Destination.findById(id);
        if (!destination) {
            return NextResponse.json({ message: "Destination not found" }, { status: 404 });
        }

        // Only allow creator or admin to delete
        if (destination.createdByEmail !== session.user.email && session.user.role !== "admin") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await Destination.findByIdAndDelete(id);

        return NextResponse.json({ message: "Destination deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting destination" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = params;
        const body = await req.json();

        const destination = await Destination.findById(id);
        if (!destination) {
            return NextResponse.json({ message: "Destination not found" }, { status: 404 });
        }

        // Only allow creator or admin to update
        if (destination.createdByEmail !== session.user.email && session.user.role !== "admin") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const updatedDestination = await Destination.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        );

        return NextResponse.json(updatedDestination);
    } catch (error) {
        console.error("UPDATE_DESTINATION_ERROR:", error);
        return NextResponse.json({ message: `Error updating destination: ${error.message}` }, { status: 500 });
    }
}

