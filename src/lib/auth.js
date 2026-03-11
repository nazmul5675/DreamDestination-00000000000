import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export function auth(...args) {
    return getServerSession(...args, authOptions);
}