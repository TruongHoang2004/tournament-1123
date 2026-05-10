import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { endGroupStage } from "@/services/match-resolver";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession(request);
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { categoryId, overrides } = await request.json();

        if (!categoryId) {
            return NextResponse.json({ error: "Missing categoryId" }, { status: 400 });
        }

        const result = await endGroupStage(categoryId, overrides);
        
        return NextResponse.json(result);

    } catch (e: any) {
        console.error("Error ending group stage:", e);
        return NextResponse.json({ error: e.message || "Failed to end group stage" }, { status: 500 });
    }
}
