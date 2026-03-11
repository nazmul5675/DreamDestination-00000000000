import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ConsultationRequest from "@/models/ConsultationRequest";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { adminReplySchema } from "@/schemas/consultationSchema";

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = params;

        const consultation = await ConsultationRequest.findById(id).lean();

        if (!consultation) {
            return NextResponse.json({ message: "Consultation not found" }, { status: 404 });
        }

        // Security: Normal users can only see their own consultations
        if (session.user.role !== "admin" && consultation.userId.toString() !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(consultation);
    } catch (error) {
        console.error("GET_CONSULTATION_DETAIL_ERROR:", error);
        return NextResponse.json({ message: "Error fetching consultation details" }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        // Only admins can update consultations (reply/status)
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = params;
        const body = await req.json();

        // Validate
        const validation = adminReplySchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                message: "Validation failed",
                errors: validation.error.format()
            }, { status: 400 });
        }

        const updateData = {
            ...validation.data,
            repliedAt: body.adminReply ? new Date() : undefined
        };

        const updatedConsultation = await ConsultationRequest.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedConsultation) {
            return NextResponse.json({ message: "Consultation not found" }, { status: 404 });
        }

        return NextResponse.json(updatedConsultation);
    } catch (error) {
        console.error("PATCH_CONSULTATION_ERROR:", error);
        return NextResponse.json({ message: "Error updating consultation" }, { status: 500 });
    }
}
