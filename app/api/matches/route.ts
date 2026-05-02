import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/matches
export async function GET(request: Request) {
  try {

    const matches = await prisma.match.findMany({
      include: {
        timelineMatch: { include: { round: true, category: true } },
        doubleA: { include: { player1: true, player2: true, team: true } },
        doubleB: { include: { player1: true, player2: true, team: true } },
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
    const {  timelineMatchId, doubleAId, doubleBId } = await request.json();
    if ( !timelineMatchId || !doubleAId || !doubleBId) {
      return NextResponse.json(
        { error: "timelineMatchId, doubleAId, doubleBId are required" },
        { status: 400 }
      );
    }

    const match = await prisma.match.create({
      data: { timelineMatchId, doubleAId, doubleBId },
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
