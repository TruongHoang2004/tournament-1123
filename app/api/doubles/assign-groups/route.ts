import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { SlotSourceType, RoundType } from "@prisma/client";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession(request);
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { groupA, groupB } = await request.json();
        // groupA and groupB are arrays of team IDs (3 each)

        if (!Array.isArray(groupA) || !Array.isArray(groupB) || groupA.length !== 3 || groupB.length !== 3) {
            return NextResponse.json({ error: "Phải chọn đúng 3 đội cho mỗi bảng" }, { status: 400 });
        }

        // Get Round IDs
        const rounds = await prisma.round.findMany();
        const groupRound = rounds.find(r => r.name === RoundType.GROUP);
        const semiRound = rounds.find(r => r.name === RoundType.SEMI);
        const finalRound = rounds.find(r => r.name === RoundType.FINAL);

        if (!groupRound || !semiRound || !finalRound) {
            return NextResponse.json({ error: "Hệ thống thiếu cấu hình các vòng đấu (GROUP, SEMI, FINAL)" }, { status: 500 });
        }

        // Use a transaction for everything
        await prisma.$transaction(async (tx) => {
            // 1. Assign groups to doubles based on team
            // Reset all first
            await tx.double.updateMany({
                data: { group: null }
            });

            await tx.double.updateMany({
                where: { teamId: { in: groupA } },
                data: { group: "A" }
            });

            await tx.double.updateMany({
                where: { teamId: { in: groupB } },
                data: { group: "B" }
            });

            // 2. Generate matches and timeline for each category
            const categories = await tx.category.findMany();

            for (const category of categories) {
                // Clear EVERYTHING for this category to reset the timeline
                const existingTMs = await tx.timelineMatch.findMany({
                    where: { categoryId: category.id }
                });
                const tmIds = existingTMs.map(tm => tm.id);

                if (tmIds.length > 0) {
                    await tx.matchResultLog.deleteMany({ where: { match: { timelineMatchId: { in: tmIds } } } });
                    await tx.setScore.deleteMany({ where: { match: { timelineMatchId: { in: tmIds } } } });
                    await tx.match.deleteMany({ where: { timelineMatchId: { in: tmIds } } });
                    await tx.matchSlot.deleteMany({ where: { timelineMatchId: { in: tmIds } } });
                    await tx.timelineMatch.deleteMany({ where: { id: { in: tmIds } } });
                }

                // --- GROUP STAGE ---

                // Get doubles for Group A
                const doublesA = await tx.double.findMany({
                    where: { categoryId: category.id, group: "A" },
                    orderBy: { teamId: 'asc' }
                });

                if (doublesA.length === 3) {
                    const pairings = [[doublesA[0], doublesA[1]], [doublesA[1], doublesA[2]], [doublesA[2], doublesA[0]]];
                    for (let i = 0; i < pairings.length; i++) {
                        const [dA, dB] = pairings[i];
                        const tm = await tx.timelineMatch.create({
                            data: {
                                categoryId: category.id,
                                roundId: groupRound.id,
                                order: i + 1,
                                roundOrder: 1,
                                slots: {
                                    create: [
                                        { side: "A", sourceType: SlotSourceType.STATIC, staticKey: `GA-${i + 1}-A` },
                                        { side: "B", sourceType: SlotSourceType.STATIC, staticKey: `GA-${i + 1}-B` }
                                    ]
                                }
                            }
                        });
                        await tx.match.create({ data: { timelineMatchId: tm.id, doubleAId: dA.id, doubleBId: dB.id } });
                    }
                }

                // Get doubles for Group B
                const doublesB = await tx.double.findMany({
                    where: { categoryId: category.id, group: "B" },
                    orderBy: { teamId: 'asc' }
                });

                if (doublesB.length === 3) {
                    const pairings = [[doublesB[0], doublesB[1]], [doublesB[1], doublesB[2]], [doublesB[2], doublesB[0]]];
                    for (let i = 0; i < pairings.length; i++) {
                        const [dA, dB] = pairings[i];
                        const tm = await tx.timelineMatch.create({
                            data: {
                                categoryId: category.id,
                                roundId: groupRound.id,
                                order: i + 4,
                                roundOrder: 1,
                                slots: {
                                    create: [
                                        { side: "A", sourceType: SlotSourceType.STATIC, staticKey: `GB-${i + 1}-A` },
                                        { side: "B", sourceType: SlotSourceType.STATIC, staticKey: `GB-${i + 1}-B` }
                                    ]
                                }
                            }
                        });
                        await tx.match.create({ data: { timelineMatchId: tm.id, doubleAId: dA.id, doubleBId: dB.id } });
                    }
                }

                // --- KNOCKOUT STAGE (Timeline Placeholders) ---

                // Semi-final 1: 1st Group A vs 2nd Group B
                const semi1 = await tx.timelineMatch.create({
                    data: {
                        categoryId: category.id,
                        roundId: semiRound.id,
                        order: 7,
                        roundOrder: 2,
                        slots: {
                            create: [
                                { side: "A", sourceType: SlotSourceType.STATIC, staticKey: "GROUP_A_1" },
                                { side: "B", sourceType: SlotSourceType.STATIC, staticKey: "GROUP_B_2" }
                            ]
                        }
                    }
                });

                // Semi-final 2: 1st Group B vs 2nd Group A
                const semi2 = await tx.timelineMatch.create({
                    data: {
                        categoryId: category.id,
                        roundId: semiRound.id,
                        order: 8,
                        roundOrder: 2,
                        slots: {
                            create: [
                                { side: "A", sourceType: SlotSourceType.STATIC, staticKey: "GROUP_B_1" },
                                { side: "B", sourceType: SlotSourceType.STATIC, staticKey: "GROUP_A_2" }
                            ]
                        }
                    }
                });

                // Final: Winner Semi 1 vs Winner Semi 2
                await tx.timelineMatch.create({
                    data: {
                        categoryId: category.id,
                        roundId: finalRound.id,
                        order: 9,
                        roundOrder: 3,
                        slots: {
                            create: [
                                { side: "A", sourceType: SlotSourceType.FROM_MATCH, sourceMatchId: semi1.id },
                                { side: "B", sourceType: SlotSourceType.FROM_MATCH, sourceMatchId: semi2.id }
                            ]
                        }
                    }
                });
            }
        }, {
            timeout: 30000 // Increase timeout for many operations
        });

        return NextResponse.json({ success: true, message: "Bốc bảng, tạo trận đấu và sơ đồ thi đấu thành công" });

    } catch (e) {
        console.error("Error assigning groups:", e);
        return NextResponse.json({ error: "Lỗi bốc bảng: " + (e as Error).message }, { status: 500 });
    }
}
