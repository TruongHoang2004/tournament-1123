import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/doubles — Lấy danh sách đôi trong giải đấu
export async function GET(request: NextRequest) {
    try {
        const doubles = await prisma.double.findMany({
            include: {
                player1: true,
                player2: true,
                category: true,
            },
        });

        return NextResponse.json(doubles);
    } catch (e) {
        console.error("Error fetching doubles:", e);
        return NextResponse.json({ error: "Failed to fetch doubles" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { teamAId, teamBId, tournamentId } = await request.json();

        // Validate input
        if (!teamAId || !teamBId || !tournamentId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
    } catch (e) {
        console.error("Error creating double:", e);
        return NextResponse.json({ error: "Failed to create double" }, { status: 500 });
    }
}