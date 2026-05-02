import prisma from "@/lib/prisma";

export async function generateBracketForCategory(categoryId: string) {
    // 1. Get all doubles for this category
    const doubles = await prisma.double.findMany({
        where: { categoryId }
    });

    if (doubles.length !== 6) {
        throw new Error("A category must have exactly 6 doubles to generate a bracket.");
    }

    const groupA = doubles.filter(d => d.group === "A");
    const groupB = doubles.filter(d => d.group === "B");

    if (groupA.length !== 3 || groupB.length !== 3) {
        throw new Error("Doubles must be assigned evenly: 3 in Group A, 3 in Group B.");
    }

    // 2. Get Round IDs
    const rounds = await prisma.round.findMany();
    const groupRound = rounds.find(r => r.name === "GROUP");
    const semiRound = rounds.find(r => r.name === "SEMI");
    const finalRound = rounds.find(r => r.name === "FINAL");

    if (!groupRound || !semiRound || !finalRound) {
        throw new Error("Rounds are not properly configured in the database.");
    }

    // Clear existing timeline matches for this category if any (to regenerate)
    await prisma.matchSlot.deleteMany({
        where: { timelineMatch: { categoryId } }
    });
    // Runtime matches will cascade or we should delete them first? 
    // Usually we only generate once. If we need to regenerate, we delete.
    await prisma.match.deleteMany({
        where: { timelineMatch: { categoryId } }
    });
    await prisma.timelineMatch.deleteMany({
        where: { categoryId }
    });

    let globalOrder = 1;

    // --- GROUP STAGE ---
    const createGroupMatches = async (group: any[], groupName: string) => {
        const matchups = [
            [group[0], group[1]],
            [group[0], group[2]],
            [group[1], group[2]]
        ];

        for (let i = 0; i < matchups.length; i++) {
            const tm = await prisma.timelineMatch.create({
                data: {
                    categoryId,
                    roundId: groupRound.id,
                    order: globalOrder++,
                    roundOrder: i + 1,
                    slots: {
                        create: [
                            { side: "A", sourceType: "STATIC", staticKey: matchups[i][0].id },
                            { side: "B", sourceType: "STATIC", staticKey: matchups[i][1].id }
                        ]
                    }
                }
            });

            // For group stage, we immediately create the Runtime Match because the teams are known
            await prisma.match.create({
                data: {
                    timelineMatchId: tm.id,
                    doubleAId: matchups[i][0].id,
                    doubleBId: matchups[i][1].id
                }
            });
        }
    };

    await createGroupMatches(groupA, "A");
    await createGroupMatches(groupB, "B");

    // --- SEMI-FINALS ---
    // Semi 1: 1A vs 2B
    const semi1 = await prisma.timelineMatch.create({
        data: {
            categoryId,
            roundId: semiRound.id,
            order: globalOrder++,
            roundOrder: 1,
            slots: {
                create: [
                    { side: "A", sourceType: "STATIC", staticKey: "GROUP_A_1" },
                    { side: "B", sourceType: "STATIC", staticKey: "GROUP_B_2" }
                ]
            }
        }
    });

    // Semi 2: 1B vs 2A
    const semi2 = await prisma.timelineMatch.create({
        data: {
            categoryId,
            roundId: semiRound.id,
            order: globalOrder++,
            roundOrder: 2,
            slots: {
                create: [
                    { side: "A", sourceType: "STATIC", staticKey: "GROUP_B_1" },
                    { side: "B", sourceType: "STATIC", staticKey: "GROUP_A_2" }
                ]
            }
        }
    });

    // --- FINAL ---
    await prisma.timelineMatch.create({
        data: {
            categoryId,
            roundId: finalRound.id,
            order: globalOrder++,
            roundOrder: 1,
            slots: {
                create: [
                    { side: "A", sourceType: "FROM_MATCH", sourceMatchId: semi1.id },
                    { side: "B", sourceType: "FROM_MATCH", sourceMatchId: semi2.id }
                ]
            }
        }
    });

    return { success: true, message: "Bracket generated successfully" };
}
