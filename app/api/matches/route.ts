import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/matches?tournamentId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get("tournamentId");
    if (!tournamentId) {
      return NextResponse.json({ error: "tournamentId is required" }, { status: 400 });
    }

    const matches = await prisma.match.findMany({
      where: { tournamentId },
      include: {
        timelineMatch: { include: { round: true, category: true } },
        doubleA: { include: { player1: true, player2: true, team: true } },
        doubleB: { include: { player1: true, player2: true, team: true } },
        setScores: { orderBy: { setNumber: "asc" } },
        resultLogs: { include: { team: true } },
      },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error("GET /api/matches error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/matches — Tạo trận đấu mới
export async function POST(request: Request) {
  try {
    const { tournamentId, timelineMatchId, doubleAId, doubleBId } = await request.json();
    if (!tournamentId || !timelineMatchId || !doubleAId || !doubleBId) {
      return NextResponse.json(
        { error: "tournamentId, timelineMatchId, doubleAId, doubleBId are required" },
        { status: 400 }
      );
    }

    const match = await prisma.match.create({
      data: { tournamentId, timelineMatchId, doubleAId, doubleBId },
      include: {
        doubleA: { include: { team: true } },
        doubleB: { include: { team: true } },
      },
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error("POST /api/matches error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
