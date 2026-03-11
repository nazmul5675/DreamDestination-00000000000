import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ConsultationRequest from "@/models/ConsultationRequest";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { consultationSchema } from "@/schemas/consultationSchema";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Validate body
        const validation = consultationSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                message: "Validation failed",
                errors: validation.error.format()
            }, { status: 400 });
        }

        const consultation = await ConsultationRequest.create({
            ...validation.data,
            userId: session.user.id,
            userName: session.user.name,
            userEmail: session.user.email,
        });

        return NextResponse.json(consultation, { status: 201 });
    } catch (error) {
        console.error("CREATE_CONSULTATION_ERROR:", error);
        return NextResponse.json({
            message: `Failed to submit request: ${error.message}`
        }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        let query = {};

        // If user is not admin, they can only see their own requests
        if (session.user.role !== "admin") {
            query.userId = session.user.id;
        }

        const consultations = await ConsultationRequest.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(consultations);
    } catch (error) {
        console.error("GET_CONSULTATIONS_ERROR:", error);
        return NextResponse.json({ message: "Error fetching consultations" }, { status: 500 });
    }
}
