import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/players/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const player = await prisma.player.findUnique({
      where: { id },
      include: { team: true },
    });

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Lấy các double ID mà player này là thành viên
    const doubles = await prisma.double.findMany({
      where: {
        OR: [
          { player1Id: id },
          { player2Id: id },
        ],
      },
      select: { id: true },
    });

    const doubleIds = doubles.map((d) => d.id);

    // Lấy tất cả các trận đấu liên quan đến các cặp đôi này
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { doubleAId: { in: doubleIds } },
          { doubleBId: { in: doubleIds } },
        ],
      },
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
        setScores: true,
        timelineMatch: {
          include: {
            round: true,
            category: true,
          },
        },
      },
      orderBy: {
        timelineMatch: {
          order: "asc",
        },
      },
    });

    return NextResponse.json({ player, matches });
  } catch (error) {
    console.error("GET /api/players/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/players/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const player = await prisma.player.update({
      where: { id },
      data,
    });
    return NextResponse.json(player);
  } catch (error) {
    console.error("PATCH /api/players/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/players/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.player.delete({ where: { id } });
    return NextResponse.json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/players/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
