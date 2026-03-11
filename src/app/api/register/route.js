import { NextResponse } from "next-auth/next";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/schemas/registerSchema";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        // Validate request body
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { name, email, password } = validation.data;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const newUser = await User.create({
            name,
            email,
            passwordHash,
            provider: "credentials",
        });

        return NextResponse.json(
            { message: "User registered successfully", userId: newUser._id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}