import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
        return NextResponse.json({ error: "Missing categoryId" }, { status: 400 });
    }

    try {
        const knockoutMatches = await prisma.timelineMatch.findMany({
            where: {
                categoryId,
                round: {
                    name: { in: ["SEMI", "FINAL"] }
                }
            },
            include: {
                round: true,
                slots: true,
                matches: {
                    include: {
                        setScores: true,
                        doubleA: { include: { player1: true, player2: true, team: true } },
                        doubleB: { include: { player1: true, player2: true, team: true } }
                    }
                }
            },
            orderBy: { order: "asc" }
        });

        // Format for frontend
        const semis = knockoutMatches.filter(m => m.round.name === "SEMI");
        const final = knockoutMatches.find(m => m.round.name === "FINAL");

        const formatMatch = (tm: any) => {
            if (!tm) return null;
            const runtimeMatch = tm.matches[0]; // Currently 1 match per timeline
            if (!runtimeMatch) {
                return {
                    id: tm.id,
                    status: "UPCOMING",
                    team1: "TBD",
                    team2: "TBD",
                    score1: 0,
                    score2: 0
                };
            }

            let score1 = 0;
            let score2 = 0;
            runtimeMatch.setScores.forEach((set: any) => {
                if (set.scoreA > set.scoreB) score1++;
                else if (set.scoreB > set.scoreA) score2++;
            });

            return {
                id: runtimeMatch.id,
                status: runtimeMatch.winnerTeamId ? "FINISHED" : "LIVE",
                team1: runtimeMatch.doubleA.team.name + " (" + runtimeMatch.doubleA.player1.name + ")",
                team2: runtimeMatch.doubleB.team.name + " (" + runtimeMatch.doubleB.player1.name + ")",
                score1,
                score2,
                winnerTeamId: runtimeMatch.winnerTeamId,
                teamAId: runtimeMatch.doubleA.teamId,
                teamBId: runtimeMatch.doubleB.teamId,
            };
        };

        return NextResponse.json({
            semi1: formatMatch(semis[0]),
            semi2: formatMatch(semis[1]),
            final: formatMatch(final)
        });

    } catch (e) {
        console.error("Error fetching brackets:", e);
        return NextResponse.json({ error: "Failed to fetch brackets" }, { status: 500 });
    }
}
