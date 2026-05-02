import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // 1. Find user in database
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 2. Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 3. Create token
        const token = await createToken({
            userId: user.id,
            username: user.username,
            role: user.role
        });

        const response = NextResponse.json({ 
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;

    } catch (e) {
        console.error("Auth error:", e);
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }
}
