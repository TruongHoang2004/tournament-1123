import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getSession(request);
        if (!session) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }
        return NextResponse.json({ authenticated: true, user: session });
    } catch (error) {
        console.error("GET /api/auth/me error:", error);
        return NextResponse.json({ authenticated: false, error: "Internal server error" }, { status: 500 });
    }
}
