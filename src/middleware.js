import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { nextUrl, nextauth } = req;
        const role = nextauth.token?.role;

        // Check if the route is an admin route
        if (nextUrl.pathname.startsWith("/admin")) {
            if (role !== "admin") {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/add-destination", "/manage-destinations", "/api/upload-image"],
};

