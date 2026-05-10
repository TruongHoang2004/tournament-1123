import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/rankings — Lấy bảng xếp hạng tổng điểm của các team
export async function GET() {
  try {
    // Lấy tất cả teams với matchResults và doubles (kèm setScores)
    const teams = await prisma.team.findMany({
      include: {
        players: true,
        matchResults: true,
        doubles: {
          include: {
            category: true,
            // Lấy tất cả các trận đấu mà double này tham gia (cả bên A và B)
            matchA: { include: { setScores: true } },
            matchB: { include: { setScores: true } },
          },
        },
      },
    });

    const rankings = teams.map((team) => {
      // Tổng điểm = sum tất cả MatchResultLog.points của team
      const totalPoints = team.matchResults.reduce(
        (sum, log) => sum + log.points,
        0
      );
      const totalWins = team.matchResults.filter(
        (log) => log.result === "WIN"
      ).length;
      const totalLosses = team.matchResults.filter(
        (log) => log.result === "LOSS"
      ).length;
      const totalMatches = totalWins + totalLosses;

      // Tính tổng điểm set (tiebreaker): tổng điểm mà các double ghi được trong set
      let totalSetPoints = 0;
      team.doubles.forEach((d) => {
        // Khi double là team A → điểm ghi được = scoreA
        d.matchA.forEach((match) => {
          match.setScores.forEach((s) => {
            totalSetPoints += s.scoreA;
          });
        });
        // Khi double là team B → điểm ghi được = scoreB
        d.matchB.forEach((match) => {
          match.setScores.forEach((s) => {
            totalSetPoints += s.scoreB;
          });
        });
      });

      // Các hạng mục team tham gia
      const categories = [
        ...new Set(team.doubles.map((d) => d.category.name)),
      ];

      return {
        id: team.id,
        name: team.name,
        players: team.players.map((p) => p.name),
        totalPoints,
        totalMatches,
        totalWins,
        totalLosses,
        totalSetPoints, // Điểm phụ (tiebreaker)
        categories,
        doublesCount: team.doubles.length,
      };
    });

    // Sắp xếp: 1. Tổng điểm giảm dần → 2. Tổng điểm set giảm dần → 3. Thắng nhiều hơn
    rankings.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.totalSetPoints !== a.totalSetPoints) return b.totalSetPoints - a.totalSetPoints;
      if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
      return a.totalLosses - b.totalLosses;
    });

    return NextResponse.json(rankings);
  } catch (error) {
    console.error("GET /api/rankings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
