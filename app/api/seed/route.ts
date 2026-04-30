import { NextResponse } from "next/server";
import { seedCategories } from "@/lib/db";

// POST /api/seed — seed initial data (categories, etc.)
export async function POST() {
  try {
    await seedCategories();
    return NextResponse.json({ message: "Seeded categories successfully" });
  } catch (error) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
