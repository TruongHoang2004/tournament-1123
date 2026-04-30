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
      include: { team: true, doublesAsPlayer1: true, doublesAsPlayer2: true },
    });
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
    return NextResponse.json(player);
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
