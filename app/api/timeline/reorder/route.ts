import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession(request);
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { timelineMatchId, direction } = await request.json();
        // direction: "up" | "down"

        if (!timelineMatchId || !direction) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const currentTM = await prisma.timelineMatch.findUnique({
            where: { id: timelineMatchId }
        });

        if (!currentTM) {
            return NextResponse.json({ error: "Match not found" }, { status: 404 });
        }

        // Find the match to swap with (same category and round)
        const targetOrder = direction === "up" ? currentTM.order - 1 : currentTM.order + 1;
        
        const targetTM = await prisma.timelineMatch.findFirst({
            where: {
                categoryId: currentTM.categoryId,
                roundId: currentTM.roundId,
                order: targetOrder
            }
        });

        if (!targetTM) {
            return NextResponse.json({ error: "No match to swap with" }, { status: 400 });
        }

        // Swap orders in a transaction
        await prisma.$transaction([
            prisma.timelineMatch.update({
                where: { id: currentTM.id },
                data: { order: targetOrder }
            }),
            prisma.timelineMatch.update({
                where: { id: targetTM.id },
                data: { order: currentTM.order }
            })
        ]);

        return NextResponse.json({ success: true });

    } catch (e) {
        console.error("Error reordering matches:", e);
        return NextResponse.json({ error: "Failed to reorder matches" }, { status: 500 });
    }
}
