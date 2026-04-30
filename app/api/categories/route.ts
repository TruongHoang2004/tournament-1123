import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/categories — Danh sách các nôi dung thi đấu
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        doubles: {
          include: { player1: true, player2: true, team: true },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/categories/[id] — Cập nhật tên nôi dung
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name } = await request.json();
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error("PATCH /api/categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
