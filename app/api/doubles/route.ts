import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// GET /api/doubles — Lấy danh sách đôi trong giải đấu
export async function GET(request: NextRequest) {
    try {
        const doubles = await prisma.double.findMany({
            include: {
                player1: true,
                player2: true,
                category: true,
            },
        });

        return NextResponse.json(doubles);
    } catch (e) {
        console.error("Error fetching doubles:", e);
        return NextResponse.json({ error: "Không thể tải danh sách cặp đấu" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        // 1. Check admin role
        const session = await getSession(request);
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Không có quyền: Cần quyền quản trị viên" }, { status: 401 });
        }

        const { player1Id, player2Id, teamId, categoryId, point } = await request.json();

        // Validate basic input
        if (!player1Id || !player2Id || !teamId || !categoryId) {
            return NextResponse.json({ error: "Thiếu các trường bắt buộc" }, { status: 400 });
        }

        if (player1Id === player2Id) {
            return NextResponse.json({ error: "Một cặp đấu phải bao gồm hai vận động viên khác nhau" }, { status: 400 });
        }

        // 2. Validate players and team
        const [p1, p2] = await Promise.all([
            prisma.player.findUnique({ where: { id: player1Id } }),
            prisma.player.findUnique({ where: { id: player2Id } }),
        ]);

        if (!p1 || !p2) {
            return NextResponse.json({ error: "Không tìm thấy một hoặc cả hai vận động viên" }, { status: 404 });
        }

        // 2.1 Players must be in the same team
        if (p1.teamId !== teamId || p2.teamId !== teamId) {
            return NextResponse.json({ error: "Cả hai vận động viên phải thuộc về cùng một đội" }, { status: 400 });
        }

        // 3. Each player can only participate in at most 1 double
        const existingDoublePlayer1 = await prisma.double.findFirst({
            where: {
                OR: [{ player1Id: player1Id }, { player2Id: player1Id }]
            }
        });
        const existingDoublePlayer2 = await prisma.double.findFirst({
            where: {
                OR: [{ player1Id: player2Id }, { player2Id: player2Id }]
            }
        });

        if (existingDoublePlayer1 || existingDoublePlayer2) {
            return NextResponse.json({
                error: "Một trong hai vận động viên đã có trong một trận đấu khác."
            }, { status: 400 });
        }

        // 4. In a team, each category only allows one double
        const existingDoubleCategory = await prisma.double.findFirst({
            where: {
                teamId: teamId,
                categoryId: categoryId
            }
        });

        if (existingDoubleCategory) {
            return NextResponse.json({
                error: "Đội này đã có một cặp đấu được đăng ký cho hạng mục này"
            }, { status: 400 });
        }

        // 5. Create the double
        const newDouble = await prisma.double.create({
            data: {
                player1Id,
                player2Id,
                teamId,
                categoryId,
                point: point || 0
            },
            include: {
                player1: true,
                player2: true,
                category: true,
                team: true
            }
        });

        return NextResponse.json(newDouble, { status: 201 });

    } catch (e) {
        console.error("Error creating double:", e);
        return NextResponse.json({ error: "Không thể tạo cặp đấu" }, { status: 500 });
    }
}