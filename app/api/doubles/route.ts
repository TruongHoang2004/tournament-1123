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
        return NextResponse.json({ error: "Không thể tải danh sách bộ đôi" }, { status: 500 });
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
            return NextResponse.json({ error: "Một bộ đôi phải bao gồm hai vận động viên khác nhau" }, { status: 400 });
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

        // 3. Mỗi vận động viên được tham gia tối đa 2 nội dung thi đấu
        const player1DoublesCount = await prisma.double.count({
            where: {
                OR: [{ player1Id: player1Id }, { player2Id: player1Id }]
            }
        });
        
        if (player1DoublesCount >= 2) {
            return NextResponse.json({
                error: `Vận động viên ${p1.name} đã tham gia tối đa 2 nội dung thi đấu.`
            }, { status: 400 });
        }

        const player2DoublesCount = await prisma.double.count({
            where: {
                OR: [{ player1Id: player2Id }, { player2Id: player2Id }]
            }
        });

        if (player2DoublesCount >= 2) {
            return NextResponse.json({
                error: `Vận động viên ${p2.name} đã tham gia tối đa 2 nội dung thi đấu.`
            }, { status: 400 });
        }

        // 4. Kiểm tra giới hạn hạng mục thi đấu và trình độ của vận động viên
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return NextResponse.json({ error: "Không tìm thấy hạng mục thi đấu" }, { status: 404 });
        }

        const cCode = category.code;
        if (cCode === "MIXED_ADVANCED") {
            const hasMale12 = (p1.gender === "MALE" && [1, 2].includes(p1.level)) || (p2.gender === "MALE" && [1, 2].includes(p2.level));
            const hasFemale1 = (p1.gender === "FEMALE" && p1.level === 1) || (p2.gender === "FEMALE" && p2.level === 1);
            if (!hasMale12 || !hasFemale1) {
                return NextResponse.json({
                    error: "Đôi nam nữ nâng cao yêu cầu: 1 VĐV Nam (trình 1 hoặc 2) kết hợp với 1 VĐV Nữ (trình 1)."
                }, { status: 400 });
            }
        } else if (cCode === "MIXED_INTERMEDIATE") {
            const hasMale35 = (p1.gender === "MALE" && [3, 4, 5].includes(p1.level)) || (p2.gender === "MALE" && [3, 4, 5].includes(p2.level));
            const hasFemale2 = (p1.gender === "FEMALE" && p1.level === 2) || (p2.gender === "FEMALE" && p2.level === 2);
            if (!hasMale35 || !hasFemale2) {
                return NextResponse.json({
                    error: "Đôi nam nữ trung cấp yêu cầu: 1 VĐV Nam (trình 3, 4 hoặc 5) kết hợp với 1 VĐV Nữ (trình 2)."
                }, { status: 400 });
            }
        } else if (cCode === "MEN_MIXED") {
            const isP1Male12 = p1.gender === "MALE" && [1, 2].includes(p1.level);
            const isP2Male12 = p2.gender === "MALE" && [1, 2].includes(p2.level);
            const isP1Male34 = p1.gender === "MALE" && [3, 4].includes(p1.level);
            const isP2Male34 = p2.gender === "MALE" && [3, 4].includes(p2.level);
            
            const isValidMenMixed = (isP1Male12 && isP2Male34) || (isP2Male12 && isP1Male34);
            if (!isValidMenMixed) {
                return NextResponse.json({
                    error: "Đôi nam hỗn hợp yêu cầu: 1 VĐV Nam (trình 1 hoặc 2) kết hợp với 1 VĐV Nam (trình 3 hoặc 4)."
                }, { status: 400 });
            }
        } else {
            return NextResponse.json({
                error: "Hạng mục này hiện đã bị loại bỏ việc tạo cặp đấu. Chỉ cho phép đăng ký Đôi nam nữ nâng cao, Đôi nam nữ trung cấp, và Đôi nam hỗn hợp."
            }, { status: 400 });
        }

        // 5. In a team, each category only allows one double
        const existingDoubleCategory = await prisma.double.findFirst({
            where: {
                teamId: teamId,
                categoryId: categoryId
            }
        });

        if (existingDoubleCategory) {
            return NextResponse.json({
                error: "Đội này đã có một bộ đôi được đăng ký cho hạng mục này"
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
        return NextResponse.json({ error: "Không thể tạo bộ đôi" }, { status: 500 });
    }
}