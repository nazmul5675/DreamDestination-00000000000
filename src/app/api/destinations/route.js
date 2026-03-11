import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Destination from "@/models/Destination";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { destinationSchema } from "@/schemas/destinationSchema";


export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const featured = searchParams.get("featured");
        const userOnly = searchParams.get("userOnly");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        const session = await getServerSession(authOptions);

        if (featured === "true") {
            // Featured logic (usually small fixed set, skip complex pagination for now but keep limit)
            const userPosts = await Destination.find({
                createdByEmail: { $ne: "admin@dreamdestination.com" }
            }).sort({ createdAt: -1 }).limit(limit).lean();

            let result = [...userPosts];

            if (result.length < limit) {
                const remaining = limit - result.length;
                const adminPosts = await Destination.find({
                    createdByEmail: "admin@dreamdestination.com"
                }).sort({ createdAt: -1 }).limit(remaining).lean();
                result = [...result, ...adminPosts];
            }

            return NextResponse.json(result);
        }

        let query = {};
        if (category && category !== "All") query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ];
        }

        // Handle userOnly filter (requires session)
        if (userOnly === "true") {
            if (!session || !session.user) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }
            query.createdByEmail = session.user.email;
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
        console.error("GET_DESTINATIONS_ERROR:", error);
        return NextResponse.json({ message: "Error fetching destinations" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({
                message: "Unauthorized: Invalid Session."
            }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Validate body
        const validation = destinationSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                message: "Validation failed",
                errors: validation.error.format()
            }, { status: 400 });
        }

        const destination = await Destination.create({
            ...validation.data,
            createdBy: session.user.id,
            createdByEmail: session.user.email,
        });


        return NextResponse.json(destination, { status: 201 });
    } catch (error) {
        console.error("CREATE_DESTINATION_ERROR:", error);
        return NextResponse.json({
            message: `Failed: ${error.message}`
        }, { status: 500 });
    }
}