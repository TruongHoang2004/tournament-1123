import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MatchResult } from "@prisma/client";

function validateBadmintonScore(scoreA: number, scoreB: number): { isValid: boolean; error?: string } {
  if (scoreA < 0 || scoreB < 0) {
    return { isValid: false, error: "Điểm số không được là số âm." };
  }
  const maxScore = Math.max(scoreA, scoreB);
  const minScore = Math.min(scoreA, scoreB);
  const diff = maxScore - minScore;

  if (maxScore > 30) {
    return { isValid: false, error: "Điểm số tối đa của một set đấu không được vượt quá 30." };
  }

  if (maxScore < 21) {
    return { isValid: false, error: "Điểm số của đội thắng phải đạt tối thiểu 21 điểm (hoặc đánh dấu bỏ cuộc nếu có đội chấn thương)." };
  }

  if (maxScore < 30 && diff < 2) {
    return { isValid: false, error: "Tỉ số thắng phải có cách biệt tối thiểu 2 điểm (ví dụ: 21-19, 22-20). Vui lòng điều chỉnh lại điểm hoặc đánh dấu bỏ cuộc." };
  }

  if (maxScore === 30 && diff < 1) {
    return { isValid: false, error: "Tỉ số không hợp lệ." };
  }

  return { isValid: true };
}

// GET /api/matches/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        timelineMatch: { include: { round: true, category: true } },
        doubleA: { include: { player1: true, player2: true, team: true } },
        doubleB: { include: { player1: true, player2: true, team: true } },
        setScores: { orderBy: { setNumber: "asc" } },
        resultLogs: { include: { team: true } },
      },
    });
    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }
    return NextResponse.json(match);
  } catch (error) {
    console.error("GET /api/matches/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/matches/[id] — Cập nhật tỉ số hoặc chốt kết quả
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 1. Cập nhật tỉ số set
    if (body.action === "updateScore") {
      const { setNumber, scoreA, scoreB } = body;
      await prisma.setScore.upsert({
        where: { matchId_setNumber: { matchId: id, setNumber } },
        update: { scoreA, scoreB },
        create: { matchId: id, setNumber, scoreA, scoreB },
      });
      const match = await prisma.match.findUnique({
        where: { id },
        include: { setScores: { orderBy: { setNumber: "asc" } } },
      });
      return NextResponse.json(match);
    }

    // 2. Chốt kết quả trận đấu (Finalize)
    if (body.action === "finalize") {
      // 2.1 Tự động lưu điểm số nếu có truyền kèm theo trong payload
      if (body.scores && Array.isArray(body.scores)) {
        for (const s of body.scores) {
          await prisma.setScore.upsert({
            where: { matchId_setNumber: { matchId: id, setNumber: s.setNumber } },
            update: { scoreA: s.scoreA, scoreB: s.scoreB },
            create: { matchId: id, setNumber: s.setNumber, scoreA: s.scoreA, scoreB: s.scoreB },
          });
        }
      }

      const match = await prisma.match.findUnique({
        where: { id },
        include: {
          setScores: true,
          doubleA: true,
          doubleB: true,
          timelineMatch: { include: { round: true } },
        },
      });

      if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

      // 2.2 Kiểm tra tính hợp lệ: Phải có điểm số khác 0 mới được chốt kết quả
      const hasValidScores = match.setScores.some(s => s.scoreA > 0 || s.scoreB > 0);
      if (!hasValidScores) {
        return NextResponse.json({ error: "Trận đấu chưa có tỉ số hợp lệ. Vui lòng ghi điểm trước khi chốt kết quả." }, { status: 400 });
      }

      // Kiểm tra luật điểm số cầu lông chặt chẽ (nếu không phải trường hợp bỏ cuộc)
      const isForfeit = !!body.isForfeit;
      if (!isForfeit) {
        const set1 = match.setScores.find(s => s.setNumber === 1);
        if (!set1) {
          return NextResponse.json({ error: "Trận đấu chưa có tỉ số set 1." }, { status: 400 });
        }
        const validation = validateBadmintonScore(set1.scoreA, set1.scoreB);
        if (!validation.isValid) {
          return NextResponse.json({ error: validation.error }, { status: 400 });
        }
      }

      // Tính toán người thắng tự động từ điểm số
      let setsWonA = 0;
      let setsWonB = 0;
      match.setScores.forEach((s) => {
        if (s.scoreA > s.scoreB) setsWonA++;
        else if (s.scoreB > s.scoreA) setsWonB++;
      });

      // Cho phép ghi nhận đội thắng thủ công (Ví dụ: đối thủ bỏ cuộc / chấn thương)
      let winnerDoubleId = setsWonA > setsWonB ? match.doubleAId : match.doubleBId;
      if (body.winnerTeamId) {
        if (body.winnerTeamId === match.doubleA.teamId) {
          winnerDoubleId = match.doubleAId;
        } else if (body.winnerTeamId === match.doubleB.teamId) {
          winnerDoubleId = match.doubleBId;
        }
      } else if (body.winnerDoubleId) {
        if (body.winnerDoubleId === match.doubleAId || body.winnerDoubleId === match.doubleBId) {
          winnerDoubleId = body.winnerDoubleId;
        }
      }

      const loserDoubleId = winnerDoubleId === match.doubleAId ? match.doubleBId : match.doubleAId;
      const winnerDouble = winnerDoubleId === match.doubleAId ? match.doubleA : match.doubleB;
      const loserDouble = winnerDoubleId === match.doubleAId ? match.doubleB : match.doubleA;
      const round = match.timelineMatch.round;

      // Transaction chốt kết quả
      await prisma.$transaction([
        prisma.match.update({
          where: { id },
          data: { winnerTeamId: winnerDouble.teamId, playedAt: new Date() },
        }),
        prisma.double.update({
          where: { id: winnerDoubleId },
          data: { point: { increment: round.pointWin } },
        }),
        ...(round.pointLoss > 0
          ? [
            prisma.double.update({
              where: { id: loserDoubleId },
              data: { point: { increment: round.pointLoss } },
            }),
          ]
          : []),
        prisma.matchResultLog.create({
          data: {
            matchId: id,
            teamId: winnerDouble.teamId,
            result: MatchResult.WIN,
            points: round.pointWin,
          },
        }),
        prisma.matchResultLog.create({
          data: {
            matchId: id,
            teamId: loserDouble.teamId,
            result: MatchResult.LOSS,
            points: round.pointLoss,
          },
        }),
      ]);

      const finalMatch = await prisma.match.findUnique({
        where: { id },
        include: { resultLogs: true },
      });

      // Auto-propagate the winner to the next slot in the bracket if applicable
      const { checkAndResolveNextMatch } = await import("@/services/match-resolver");
      await checkAndResolveNextMatch(id);

      return NextResponse.json(finalMatch);
    }

    // 3. Bắt đầu trận đấu (Set status to Live)
    if (body.action === "startMatch") {
      const match = await prisma.match.update({
        where: { id },
        data: { playedAt: new Date() },
      });
      return NextResponse.json(match);
    }

    // 4. Reset trận đấu (Set back to Upcoming)
    if (body.action === "resetMatch") {
      await prisma.$transaction([
        prisma.match.update({
          where: { id },
          data: { winnerTeamId: null, playedAt: null },
        }),
        prisma.setScore.deleteMany({ where: { matchId: id } }),
        prisma.matchResultLog.deleteMany({ where: { matchId: id } }),
      ]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/matches/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/matches/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.match.delete({ where: { id } });
    return NextResponse.json({ message: "Match deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/matches/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
