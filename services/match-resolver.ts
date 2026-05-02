import prisma from "@/lib/prisma";

export async function endGroupStage(categoryId: string) {
    // 1. Fetch standings (we can fetch it internally or via API, but let's calculate directly here to be safe)
    const host = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${host}/api/standings?categoryId=${categoryId}`);
    if (!res.ok) throw new Error("Failed to calculate standings");
    const { groupA, groupB } = await res.json();

    if (groupA.length < 2 || groupB.length < 2) {
        throw new Error("Not enough teams to proceed to Semi-finals");
    }

    const a1 = groupA[0].doubleId;
    const a2 = groupA[1].doubleId;
    const b1 = groupB[0].doubleId;
    const b2 = groupB[1].doubleId;

    // 2. Find the Semi-final TimelineMatches
    const semiRound = await prisma.round.findUnique({ where: { name: "SEMI" } });
    if (!semiRound) throw new Error("SEMI round not found");

    const semiTimelines = await prisma.timelineMatch.findMany({
        where: {
            categoryId,
            roundId: semiRound.id
        },
        include: {
            slots: true,
            matches: true
        }
    });

    if (semiTimelines.length !== 2) {
        throw new Error("Semi-final timelines not configured properly (expected 2)");
    }

    // 3. Create Runtime Matches for Semi-finals
    for (const tm of semiTimelines) {
        if (tm.matches.length > 0) continue; // Already created

        const slotA = tm.slots.find(s => s.side === "A");
        const slotB = tm.slots.find(s => s.side === "B");

        if (!slotA || !slotB) continue;

        let doubleAId = "";
        let doubleBId = "";

        // Resolve static keys
        const resolveKey = (key: string | null) => {
            if (key === "GROUP_A_1") return a1;
            if (key === "GROUP_A_2") return a2;
            if (key === "GROUP_B_1") return b1;
            if (key === "GROUP_B_2") return b2;
            return key || "";
        };

        doubleAId = resolveKey(slotA.staticKey);
        doubleBId = resolveKey(slotB.staticKey);

        if (doubleAId && doubleBId) {
            await prisma.match.create({
                data: {
                    timelineMatchId: tm.id,
                    doubleAId,
                    doubleBId
                }
            });
        }
    }

    return { success: true, message: "Semi-finals generated successfully" };
}

export async function checkAndResolveNextMatch(finishedMatchId: string) {
    // When a match finishes (e.g. Semi-final), check if it flows into another match (e.g. Final)
    const match = await prisma.match.findUnique({
        where: { id: finishedMatchId },
        include: { timelineMatch: true, doubleA: true, doubleB: true }
    });

    if (!match || !match.winnerTeamId) return;

    const winnerDoubleId = match.winnerTeamId === match.doubleA.teamId ? match.doubleAId : match.doubleBId;

    // Find slots that depend on this match
    const dependentSlots = await prisma.matchSlot.findMany({
        where: {
            sourceMatchId: match.timelineMatchId
        },
        include: {
            timelineMatch: {
                include: {
                    slots: true,
                    matches: true
                }
            }
        }
    });

    for (const slot of dependentSlots) {
        const nextTM = slot.timelineMatch;
        if (nextTM.matches.length > 0) continue; // Match already created

        // To create the next runtime match, BOTH slots of nextTM must be resolved.
        // We know `slot` is resolved (it is the winner of `match`).
        // What about the other slot?
        const otherSlot = nextTM.slots.find(s => s.id !== slot.id);
        if (!otherSlot) continue;

        let otherDoubleId = null;

        if (otherSlot.sourceType === "STATIC" && otherSlot.staticKey) {
            otherDoubleId = otherSlot.staticKey;
        } else if (otherSlot.sourceType === "FROM_MATCH" && otherSlot.sourceMatchId) {
            // Check if the source match is finished
            const sourceRuntimeMatch = await prisma.match.findFirst({
                where: {
                    timelineMatchId: otherSlot.sourceMatchId,
                    winnerTeamId: { not: null }
                },
                include: { doubleA: true, doubleB: true }
            });

            if (sourceRuntimeMatch) {
                otherDoubleId = sourceRuntimeMatch.winnerTeamId === sourceRuntimeMatch.doubleA.teamId 
                    ? sourceRuntimeMatch.doubleAId 
                    : sourceRuntimeMatch.doubleBId;
            }
        }

        if (winnerDoubleId && otherDoubleId) {
            // Both sides resolved! Create the runtime match
            const sideA_id = slot.side === "A" ? winnerDoubleId : otherDoubleId;
            const sideB_id = slot.side === "B" ? winnerDoubleId : otherDoubleId;

            await prisma.match.create({
                data: {
                    timelineMatchId: nextTM.id,
                    doubleAId: sideA_id,
                    doubleBId: sideB_id
                }
            });
        }
    }
}
