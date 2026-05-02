import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/categories/[id] — Cập nhật tên nội dung thi đấu
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
    console.error("PATCH /api/categories/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}