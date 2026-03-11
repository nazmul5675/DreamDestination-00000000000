import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
    // Auth Version: 1.4 (Role-Based Auth)
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();

                const user = await User.findOne({ email: credentials.email, provider: 'credentials' });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role || "user",
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google") {
                await dbConnect();
                let existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    existingUser = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: "google",
                        role: "user",
                    });
                }
                // Attach details to the user object for the jwt callback
                user.id = existingUser._id.toString();
                user.role = existingUser.role || "user";
            }
            return true;
        },
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};