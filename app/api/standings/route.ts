import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
        return NextResponse.json({ error: "Missing categoryId" }, { status: 400 });
    }

    try {
        // Fetch all doubles for this category
        const doubles = await prisma.double.findMany({
            where: { categoryId },
            include: {
                team: true,
                player1: true,
                player2: true
            }
        });

        // Fetch all group stage matches that have been played
        const groupMatches = await prisma.match.findMany({
            where: {
                timelineMatch: {
                    categoryId: categoryId,
                    round: { name: "GROUP" }
                },
                winnerTeamId: { not: null } // Only finished matches
            },
            include: {
                setScores: true,
                doubleA: true,
                doubleB: true
            }
        });

        // Initialize standings object
        const standings: Record<string, any> = {};
        doubles.forEach(d => {
            standings[d.id] = {
                doubleId: d.id,
                teamName: d.team.name,
                player1Name: d.player1.name,
                player2Name: d.player2.name,
                group: d.group,
                matchesPlayed: 0,
                wins: 0,
                losses: 0,
                points: 0,
                pointsScored: 0, // Secondary criteria
                pointsConceded: 0
            };
        });

        // Calculate standings
        groupMatches.forEach(match => {
            const dA = match.doubleAId;
            const dB = match.doubleBId;
            const winnerDoubleId = match.winnerTeamId === match.doubleA.teamId ? dA : dB;
            const loserDoubleId = winnerDoubleId === dA ? dB : dA;

            if (standings[dA]) standings[dA].matchesPlayed++;
            if (standings[dB]) standings[dB].matchesPlayed++;

            if (standings[winnerDoubleId]) {
                standings[winnerDoubleId].wins++;
                standings[winnerDoubleId].points += 2; // 2 points per win
            }
            if (standings[loserDoubleId]) {
                standings[loserDoubleId].losses++;
            }

            // Calculate points scored from SetScores
            let aPoints = 0;
            let bPoints = 0;
            match.setScores.forEach(set => {
                aPoints += set.scoreA;
                bPoints += set.scoreB;
            });

            if (standings[dA]) {
                standings[dA].pointsScored += aPoints;
                standings[dA].pointsConceded += bPoints;
            }
            if (standings[dB]) {
                standings[dB].pointsScored += bPoints;
                standings[dB].pointsConceded += aPoints;
            }
        });

        const standingsArray = Object.values(standings);

        const groupA = standingsArray.filter(s => s.group === "A").sort(sortStandings);
        const groupB = standingsArray.filter(s => s.group === "B").sort(sortStandings);

        return NextResponse.json({ groupA, groupB });

    } catch (e) {
        console.error("Error fetching standings:", e);
        return NextResponse.json({ error: "Failed to fetch standings" }, { status: 500 });
    }
}

// Sorting function: 1. Points (Wins), 2. Points Scored
function sortStandings(a: any, b: any) {
    if (b.points !== a.points) {
        return b.points - a.points;
    }
    // Tie-breaker: Total points scored
    return b.pointsScored - a.pointsScored;
}
