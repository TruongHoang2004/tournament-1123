import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/players?teamId=xxx — Lấy danh sách vận động viên
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");

    const players = await prisma.player.findMany({
      where: teamId ? { teamId } : {},
      include: { team: true },
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error("GET /api/players error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/players — Thêm vận động viên vào đội
export async function POST(request: Request) {
  try {
    const { teamId, name, gender, level } = await request.json();
    if (!teamId || !name || !gender || level == null) {
      return NextResponse.json(
        { error: "teamId, name, gender, level are required" },
        { status: 400 }
      );
    }

    const player = await prisma.player.create({
      data: { teamId, name, gender, level },
    });

    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error("POST /api/players error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
