import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateBracketForCategory } from "@/services/match-generator";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession(request);
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { categoryId } = await request.json();

        if (!categoryId) {
            return NextResponse.json({ error: "Missing categoryId" }, { status: 400 });
        }

        const result = await generateBracketForCategory(categoryId);
        
        return NextResponse.json(result);

    } catch (e: any) {
        console.error("Error initializing bracket:", e);
        return NextResponse.json({ error: e.message || "Failed to initialize bracket" }, { status: 500 });
    }
}
