import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { contactSchema } from "@/schemas/contactSchema";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        // Validate data
        const validation = contactSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                message: "Validation failed",
                errors: validation.error.format()
            }, { status: 400 });
        }

        const message = await ContactMessage.create(validation.data);

        return NextResponse.json({
            success: true,
            message: "Your message has been sent successfully!"
        }, { status: 201 });

    } catch (error) {
        console.error("CONTACT_API_ERROR:", error);
        return NextResponse.json({
            message: "Failed to send message. Please try again later."
        }, { status: 500 });
    }
}
