import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/teams — Lấy danh sách đội trong giải đấu
export async function GET() {
  try {
    const teams = await prisma.team.findMany({
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
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const team = await prisma.team.create({
      data: { name },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("POST /api/teams error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
