import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/teams?tournamentId=xxx — Lấy danh sách đội trong giải đấu
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get("tournamentId");

    if (!tournamentId) {
      return NextResponse.json({ error: "tournamentId is required" }, { status: 400 });
    }

    const teams = await prisma.team.findMany({
      where: { tournamentId },
      include: {
        players: true,
        doubles: {
          include: { player1: true, player2: true, category: true },
        },
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("GET /api/teams error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/teams — Tạo đội mới
export async function POST(request: Request) {
  try {
    const { tournamentId, name } = await request.json();
    if (!tournamentId || !name) {
      return NextResponse.json({ error: "tournamentId and name are required" }, { status: 400 });
    }

    const team = await prisma.team.create({
      data: { name, tournamentId },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("POST /api/teams error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
