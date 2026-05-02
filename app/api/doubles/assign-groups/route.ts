import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession(request);
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { categoryId, assignments } = await request.json();
        // assignments is an array of { doubleId: string, group: "A" | "B" | null }

        if (!categoryId || !Array.isArray(assignments)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // We use a transaction to update all doubles at once
        const updatePromises = assignments.map((assignment: { doubleId: string, group: string | null }) => {
            return prisma.double.update({
                where: { id: assignment.doubleId },
                data: { group: assignment.group }
            });
        });

        await prisma.$transaction(updatePromises);

        return NextResponse.json({ success: true, message: "Groups assigned successfully" });

    } catch (e) {
        console.error("Error assigning groups:", e);
        return NextResponse.json({ error: "Failed to assign groups" }, { status: 500 });
    }
}
