import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, message: "Unauthorized. Please login again." },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const image = formData.get("image");

        if (!image) {
            return NextResponse.json({ message: "No image provided" }, { status: 400 });
        }

        const apiKey = process.env.IMGBB_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ message: "ImgBB API Key is missing" }, { status: 500 });
        }

        // Convert file to base64 for more reliable upload
        const arrayBuffer = await image.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        const imgbbFormData = new FormData();
        imgbbFormData.append("image", base64);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: imgbbFormData,
        });

        const data = await res.json();

        if (data.success) {
            return NextResponse.json({
                success: true,
                imageUrl: data.data.url,
                displayUrl: data.data.display_url,
            });
        } else {
            console.error("ImgBB Error:", data);
            return NextResponse.json({
                success: false,
                message: data.error?.message || "Upload failed"
            }, { status: 500 });
        }
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ message: "Internal Server Error during upload" }, { status: 500 });
    }
}
