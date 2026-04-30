import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CategoryCode } from "@prisma/client";

// GET /api/timeline?tournamentId=xxx&category=xxx — Lấy sơ đồ thi đấu
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get("tournamentId");
    const categoryCode = searchParams.get("category") as CategoryCode | null;

    if (!tournamentId) {
      return NextResponse.json({ error: "tournamentId is required" }, { status: 400 });
    }

    const where: Record<string, any> = {};
    if (categoryCode) {
      const category = await prisma.category.findUnique({ where: { code: categoryCode } });
      if (category) where.categoryId = category.id;
    }

    const rounds = await prisma.round.findMany({ where: { tournamentId } });
    where.roundId = { in: rounds.map((r) => r.id) };

    const timeline = await prisma.timelineMatch.findMany({
      where,
      include: {
        round: true,
        category: true,
        slots: { include: { sourceMatch: true } },
        matches: {
          include: {
            doubleA: { include: { player1: true, player2: true, team: true } },
            doubleB: { include: { player1: true, player2: true, team: true } },
            setScores: { orderBy: { setNumber: "asc" } },
            resultLogs: { include: { team: true } },
          },
        },
      },
      orderBy: [{ roundOrder: "asc" }, { order: "asc" }],
    });

    return NextResponse.json(timeline);
  } catch (error) {
    console.error("GET /api/timeline error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/timeline — Tạo trận đấu trong sơ đồ
export async function POST(request: Request) {
  try {
    const { roundId, categoryCode, order, roundOrder, slots } = await request.json();

    const category = await prisma.category.findUnique({ where: { code: categoryCode } });
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const timelineMatch = await prisma.timelineMatch.create({
      data: {
        roundId,
        categoryId: category.id,
        order,
        roundOrder,
        slots: {
          create: slots?.map((s: any) => ({
            side: s.side,
            sourceType: s.sourceType,
            staticKey: s.staticKey,
            sourceMatchId: s.sourceMatchId,
            sourceResult: s.sourceResult,
          })),
        },
      },
      include: { slots: true },
    });

    return NextResponse.json(timelineMatch, { status: 201 });
  } catch (error) {
    console.error("POST /api/timeline error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
