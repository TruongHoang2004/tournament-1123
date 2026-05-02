import prisma from "./prisma";
import { CategoryCode, RoundType, MatchResult } from "@/prisma/client";

// ─── TOURNAMENT ───────────────────────────────────────────────────────

export async function getTournament(id: string) {
  return prisma.tournament.findUnique({
    where: { id },
    include: {
      teams: {
        include: {
          players: true,
          doubles: {
            include: {
              player1: true,
              player2: true,
              category: true,
            },
          },
        },
      },
      rounds: true,
    },
  });
}

export async function getActiveTournament() {
  return prisma.tournament.findFirst({
    orderBy: { date: "desc" },
    include: {
      teams: {
        include: {
          players: true,
          doubles: {
            include: {
              player1: true,
              player2: true,
              category: true,
            },
          },
        },
      },
      rounds: true,
    },
  });
}

export async function createTournament(name: string, date: Date) {
  return prisma.tournament.create({
    data: {
      name,
      date,
      rounds: {
        create: [
          { name: RoundType.GROUP, pointWin: 2, pointLoss: 0 },
          { name: RoundType.SEMI, pointWin: 3, pointLoss: 1 },
          { name: RoundType.FINAL, pointWin: 4, pointLoss: 2 },
        ],
      },
    },
    include: { rounds: true },
  });
}

// ─── TEAMS ────────────────────────────────────────────────────────────

export async function updateTournament(id: string, data: { name?: string; date?: Date }) {
  return prisma.tournament.update({
    where: { id },
    data,
  });
}

export async function deleteTournament(id: string) {
  return prisma.tournament.delete({
    where: { id },
  });
}

// ─── TEAMS ────────────────────────────────────────────────────────────

export async function getTeams(tournamentId: string) {
  return prisma.team.findMany({
    where: { tournamentId },
    include: {
      players: true,
      doubles: {
        include: {
          player1: true,
          player2: true,
          category: true,
        },
      },
    },
  });
}

export async function getTeamById(id: string) {
  return prisma.team.findUnique({
    where: { id },
    include: {
      players: true,
      doubles: {
        include: {
          player1: true,
          player2: true,
          category: true,
        },
      },
    },
  });
}

export async function createTeam(tournamentId: string, name: string) {
  return prisma.team.create({
    data: { name, tournamentId },
  });
}

export async function updateTeam(id: string, name: string) {
  return prisma.team.update({
    where: { id },
    data: { name },
  });
}

export async function deleteTeam(id: string) {
  return prisma.team.delete({
    where: { id },
  });
}

// ─── PLAYERS ──────────────────────────────────────────────────────────

export async function getPlayers(teamId?: string) {
  return prisma.player.findMany({
    where: teamId ? { teamId } : {},
    include: { team: true },
  });
}

export async function addPlayer(
  teamId: string,
  name: string,
  gender: "MALE" | "FEMALE",
  level: number
) {
  return prisma.player.create({
    data: { name, gender, level, teamId },
  });
}

export async function updatePlayer(
  id: string,
  data: { name?: string; gender?: "MALE" | "FEMALE"; level?: number; teamId?: string }
) {
  return prisma.player.update({
    where: { id },
    data,
  });
}

export async function deletePlayer(id: string) {
  return prisma.player.delete({
    where: { id },
  });
}

// ─── CATEGORIES ───────────────────────────────────────────────────────

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      doubles: {
        include: { player1: true, player2: true, team: true },
      },
    },
  });
}

export async function updateCategory(id: string, name: string) {
  return prisma.category.update({
    where: { id },
    data: { name },
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({
    where: { id },
  });
}

export async function seedCategories() {
  const categories = [
    { code: CategoryCode.MEN_ADVANCED, name: "Advanced Men's Doubles" },
    { code: CategoryCode.MEN_MIXED, name: "Mixed-Level Men's Doubles" },
    { code: CategoryCode.MEN_INTERMEDIATE, name: "Intermediate Men's Doubles" },
    { code: CategoryCode.MIXED_ADVANCED, name: "Advanced Mixed Doubles" },
    { code: CategoryCode.MIXED_INTERMEDIATE, name: "Intermediate Mixed Doubles" },
    { code: CategoryCode.WOMEN_DOUBLE, name: "Women's Doubles" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { code: cat.code },
      update: { name: cat.name },
      create: cat,
    });
  }
}

// ─── DOUBLES ──────────────────────────────────────────────────────────

export async function getDoubles(categoryId?: string, teamId?: string) {
  const where: Record<string, unknown> = {};
  if (categoryId) where.categoryId = categoryId;
  if (teamId) where.teamId = teamId;

  return prisma.double.findMany({
    where,
    include: { player1: true, player2: true, team: true, category: true },
  });
}

export async function createDouble(
  teamId: string,
  player1Id: string,
  player2Id: string,
  categoryCode: CategoryCode
) {
  const category = await prisma.category.findUnique({
    where: { code: categoryCode },
  });
  if (!category) throw new Error(`Category ${categoryCode} not found`);

  return prisma.double.create({
    data: {
      point: 0,
      player1Id,
      player2Id,
      teamId,
      categoryId: category.id,
    },
    include: { player1: true, player2: true, category: true },
  });
}

export async function updateDouble(
  id: string,
  data: { point?: number; player1Id?: string; player2Id?: string; categoryId?: string }
) {
  return prisma.double.update({
    where: { id },
    data,
  });
}

export async function deleteDouble(id: string) {
  return prisma.double.delete({
    where: { id },
  });
}

// ─── TIMELINE & BRACKETS ─────────────────────────────────────────────

export async function getTimeline(tournamentId: string, categoryCode?: CategoryCode) {
  const where: Record<string, unknown> = {};
  if (categoryCode) {
    const category = await prisma.category.findUnique({ where: { code: categoryCode } });
    if (category) where.categoryId = category.id;
  }
  // Filter by rounds belonging to this tournament
  const rounds = await prisma.round.findMany({ where: { tournamentId } });
  where.roundId = { in: rounds.map((r) => r.id) };

  return prisma.timelineMatch.findMany({
    where,
    include: {
      round: true,
      category: true,
      slots: {
        include: { sourceMatch: true },
      },
      matches: {
        include: {
          doubleA: { include: { player1: true, player2: true, team: true } },
          doubleB: { include: { player1: true, player2: true, team: true } },
          setScores: { orderBy: { setNumber: "asc" } },
          resultLogs: { include: { team: true } },
        },
      },
    },
    orderBy: [{ roundOrder: "asc" }, { order: "asc" }],
  });
}

export async function createTimelineMatch(
  roundId: string,
  categoryCode: CategoryCode,
  order: number,
  roundOrder: number
) {
  const category = await prisma.category.findUnique({ where: { code: categoryCode } });
  if (!category) throw new Error(`Category ${categoryCode} not found`);

  return prisma.timelineMatch.create({
    data: {
      roundId,
      categoryId: category.id,
      order,
      roundOrder,
    },
  });
}

export async function deleteTimelineMatch(id: string) {
  return prisma.timelineMatch.delete({
    where: { id },
  });
}

export async function createMatchSlot(
  timelineMatchId: string,
  side: "A" | "B",
  sourceType: "STATIC" | "FROM_MATCH",
  options?: { staticKey?: string; sourceMatchId?: string; sourceResult?: MatchResult }
) {
  return prisma.matchSlot.create({
    data: {
      timelineMatchId,
      side,
      sourceType,
      staticKey: options?.staticKey,
      sourceMatchId: options?.sourceMatchId,
      sourceResult: options?.sourceResult,
    },
  });
}

// ─── MATCHES (RUNTIME) ───────────────────────────────────────────────

export async function getMatches(tournamentId: string) {
  return prisma.match.findMany({
    where: { tournamentId },
    include: {
      timelineMatch: {
        include: { round: true, category: true },
      },
      doubleA: { include: { player1: true, player2: true, team: true } },
      doubleB: { include: { player1: true, player2: true, team: true } },
      setScores: { orderBy: { setNumber: "asc" } },
      resultLogs: { include: { team: true } },
    },
  });
}

export async function getMatchById(id: string) {
  return prisma.match.findUnique({
    where: { id },
    include: {
      timelineMatch: {
        include: { round: true, category: true },
      },
      doubleA: { include: { player1: true, player2: true, team: true } },
      doubleB: { include: { player1: true, player2: true, team: true } },
      setScores: { orderBy: { setNumber: "asc" } },
      resultLogs: { include: { team: true } },
    },
  });
}

export async function createMatch(
  tournamentId: string,
  timelineMatchId: string,
  doubleAId: string,
  doubleBId: string
) {
  return prisma.match.create({
    data: {
      tournamentId,
      timelineMatchId,
      doubleAId,
      doubleBId,
    },
  });
}

export async function deleteMatch(id: string) {
  return prisma.match.delete({
    where: { id },
  });
}

// ─── SCORING ──────────────────────────────────────────────────────────

export async function updateSetScore(
  matchId: string,
  setNumber: number,
  scoreA: number,
  scoreB: number
) {
  return prisma.setScore.upsert({
    where: { matchId_setNumber: { matchId, setNumber } },
    update: { scoreA, scoreB },
    create: { matchId, setNumber, scoreA, scoreB },
  });
}

export async function finalizeMatch(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      setScores: true,
      doubleA: true,
      doubleB: true,
      timelineMatch: { include: { round: true } },
    },
  });
  if (!match) throw new Error("Match not found");

  // Determine winner by sets won
  let setsWonA = 0;
  let setsWonB = 0;
  for (const set of match.setScores) {
    if (set.scoreA > set.scoreB) setsWonA++;
    else if (set.scoreB > set.scoreA) setsWonB++;
  }

  const winnerDoubleId = setsWonA > setsWonB ? match.doubleAId : match.doubleBId;
  const loserDoubleId = setsWonA > setsWonB ? match.doubleBId : match.doubleAId;
  const winnerDouble = setsWonA > setsWonB ? match.doubleA : match.doubleB;
  const loserDouble = setsWonA > setsWonB ? match.doubleB : match.doubleA;

  const round = match.timelineMatch.round;

  // Transaction: update match winner, award points, create result logs
  await prisma.$transaction([
    // Set match winner
    prisma.match.update({
      where: { id: matchId },
      data: {
        winnerTeamId: winnerDouble.teamId,
        playedAt: new Date(),
      },
    }),

    // Award points to winner's double
    prisma.double.update({
      where: { id: winnerDoubleId },
      data: { point: { increment: round.pointWin } },
    }),

    // Award points to loser's double (if any)
    ...(round.pointLoss > 0
      ? [
        prisma.double.update({
          where: { id: loserDoubleId },
          data: { point: { increment: round.pointLoss } },
        }),
      ]
      : []),

    // Result logs
    prisma.matchResultLog.create({
      data: {
        matchId,
        teamId: winnerDouble.teamId,
        result: MatchResult.WIN,
        points: round.pointWin,
      },
    }),
    prisma.matchResultLog.create({
      data: {
        matchId,
        teamId: loserDouble.teamId,
        result: MatchResult.LOSS,
        points: round.pointLoss,
      },
    }),
  ]);

  return getMatchById(matchId);
}

// ─── LEADERBOARD ──────────────────────────────────────────────────────

export async function getLeaderboard(tournamentId: string) {
  const teams = await prisma.team.findMany({
    where: { tournamentId },
    include: {
      doubles: {
        include: {
          category: true,
          player1: true,
          player2: true,
        },
      },
      matchResults: true,
    },
  });

  return teams
    .map((team) => ({
      id: team.id,
      name: team.name,
      totalPoints: team.doubles.reduce((sum, d) => sum + d.point, 0),
      wins: team.matchResults.filter((r) => r.result === "WIN").length,
      losses: team.matchResults.filter((r) => r.result === "LOSS").length,
      doublesBreakdown: team.doubles.map((d) => ({
        id: d.id,
        category: d.category.name,
        categoryCode: d.category.code,
        player1: d.player1.name,
        player2: d.player2.name,
        points: d.point,
      })),
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);
}

