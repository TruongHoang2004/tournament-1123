import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { RoundType } from "@prisma/client";

// GET /api/tournament — Lấy thông tin giải đấu mới nhất và leaderboard
export async function GET() {
  try {
    const tournament = await prisma.tournament.findFirst({
      orderBy: { date: "desc" },
      include: {
        rounds: true,
        teams: {
          include: {
            players: true,
            doubles: {
              include: {
                category: true,
                player1: true,
                player2: true,
              },
            },
          },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    // Tính Leaderboard trực tiếp
    const teams = await prisma.team.findMany({
      where: { tournamentId: tournament.id },
      include: {
        doubles: {
          include: { category: true, player1: true, player2: true },
        },
        matchResults: true,
      },
    });

    const leaderboard = teams
      .map((team) => ({
        id: team.id,
        name: team.name,
        totalPoints: team.doubles.reduce((sum, d) => sum + d.point, 0),
        wins: team.matchResults.filter((r) => r.result === "WIN").length,
        losses: team.matchResults.filter((r) => r.result === "LOSS").length,
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return NextResponse.json({ tournament, leaderboard });
  } catch (error) {
    console.error("GET /api/tournament error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/tournament — Tạo giải đấu mới cùng các vòng đấu mặc định
export async function POST(request: Request) {
  try {
    const { name, date } = await request.json();
    if (!name || !date) {
      return NextResponse.json({ error: "name and date are required" }, { status: 400 });
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        date: new Date(date),
        rounds: {
          create: [
            { name: RoundType.GROUP, pointWin: 2, pointLoss: 0 },
            { name: RoundType.SEMI, pointWin: 3, pointLoss: 1 },
            { name: RoundType.FINAL, pointWin: 4, pointLoss: 2 },
          ],
        },
      },
      include: { rounds: true },
    });

    return NextResponse.json(tournament, { status: 201 });
  } catch (error) {
    console.error("POST /api/tournament error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
