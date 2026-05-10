import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/teams/[id] — Chi tiết đội và lịch sử đấu
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        players: true,
        doubles: {
          include: { player1: true, player2: true, category: true },
        },
        matchResults: {
          include: {
            match: {
              include: {
                doubleA: {
                  include: {
                    team: true,
                    player1: true,
                    player2: true,
                  },
                },
                doubleB: {
                  include: {
                    team: true,
                    player1: true,
                    player2: true,
                  },
                },
                timelineMatch: { include: { round: true, category: true } },
                setScores: { orderBy: { setNumber: "asc" } },
              },
            },
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("GET /api/teams/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/teams/[id] — Cập nhật tên đội
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name } = await request.json();

    const team = await prisma.team.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("PATCH /api/teams/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/teams/[id] — Xóa đội
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.team.delete({ where: { id } });
    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/teams/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
