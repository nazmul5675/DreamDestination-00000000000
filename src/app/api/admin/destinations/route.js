import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Destination from "@/models/Destination";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (category && category !== "All") query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ];
        }

        const totalCount = await Destination.countDocuments(query);
        const destinations = await Destination.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            destinations,
            meta: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error("ADMIN_DESTINATIONS_GET_ERROR:", error);
        return NextResponse.json({ message: "Failed to fetch destinations" }, { status: 500 });
    }
}
