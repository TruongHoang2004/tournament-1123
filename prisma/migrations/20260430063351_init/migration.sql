-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "MatchResult" AS ENUM ('WIN', 'LOSS');

-- CreateEnum
CREATE TYPE "RoundType" AS ENUM ('GROUP', 'SEMI', 'FINAL');

-- CreateEnum
CREATE TYPE "CategoryCode" AS ENUM ('MEN_ADVANCED', 'MEN_MIXED', 'MEN_INTERMEDIATE', 'MIXED_ADVANCED', 'MIXED_INTERMEDIATE', 'WOMEN_DOUBLE');

-- CreateEnum
CREATE TYPE "SlotSide" AS ENUM ('A', 'B');

-- CreateEnum
CREATE TYPE "SlotSourceType" AS ENUM ('STATIC', 'FROM_MATCH');

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "level" INTEGER NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Double" (
    "id" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Double_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "code" "CategoryCode" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" TEXT NOT NULL,
    "name" "RoundType" NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "pointWin" INTEGER NOT NULL,
    "pointLoss" INTEGER NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineMatch" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "roundOrder" INTEGER NOT NULL,

    CONSTRAINT "TimelineMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchSlot" (
    "id" TEXT NOT NULL,
    "timelineMatchId" TEXT NOT NULL,
    "side" "SlotSide" NOT NULL,
    "sourceType" "SlotSourceType" NOT NULL,
    "staticKey" TEXT,
    "sourceMatchId" TEXT,
    "sourceResult" "MatchResult",

    CONSTRAINT "MatchSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "timelineMatchId" TEXT NOT NULL,
    "doubleAId" TEXT NOT NULL,
    "doubleBId" TEXT NOT NULL,
    "winnerTeamId" TEXT,
    "playedAt" TIMESTAMP(3),

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetScore" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "scoreA" INTEGER NOT NULL,
    "scoreB" INTEGER NOT NULL,

    CONSTRAINT "SetScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchResultLog" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "result" "MatchResult" NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "MatchResultLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tournament_date_idx" ON "Tournament"("date");

-- CreateIndex
CREATE INDEX "Team_tournamentId_idx" ON "Team"("tournamentId");

-- CreateIndex
CREATE INDEX "Player_teamId_idx" ON "Player"("teamId");

-- CreateIndex
CREATE INDEX "Double_teamId_idx" ON "Double"("teamId");

-- CreateIndex
CREATE INDEX "Double_categoryId_idx" ON "Double"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_code_key" ON "Category"("code");

-- CreateIndex
CREATE INDEX "Round_tournamentId_idx" ON "Round"("tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "Round_tournamentId_name_key" ON "Round"("tournamentId", "name");

-- CreateIndex
CREATE INDEX "TimelineMatch_roundId_idx" ON "TimelineMatch"("roundId");

-- CreateIndex
CREATE INDEX "TimelineMatch_categoryId_idx" ON "TimelineMatch"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "TimelineMatch_roundId_categoryId_order_key" ON "TimelineMatch"("roundId", "categoryId", "order");

-- CreateIndex
CREATE INDEX "MatchSlot_timelineMatchId_idx" ON "MatchSlot"("timelineMatchId");

-- CreateIndex
CREATE INDEX "MatchSlot_sourceMatchId_idx" ON "MatchSlot"("sourceMatchId");

-- CreateIndex
CREATE INDEX "Match_tournamentId_idx" ON "Match"("tournamentId");

-- CreateIndex
CREATE INDEX "Match_timelineMatchId_idx" ON "Match"("timelineMatchId");

-- CreateIndex
CREATE INDEX "SetScore_matchId_idx" ON "SetScore"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "SetScore_matchId_setNumber_key" ON "SetScore"("matchId", "setNumber");

-- CreateIndex
CREATE INDEX "MatchResultLog_matchId_idx" ON "MatchResultLog"("matchId");

-- CreateIndex
CREATE INDEX "MatchResultLog_teamId_idx" ON "MatchResultLog"("teamId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Double" ADD CONSTRAINT "Double_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Double" ADD CONSTRAINT "Double_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Double" ADD CONSTRAINT "Double_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Double" ADD CONSTRAINT "Double_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineMatch" ADD CONSTRAINT "TimelineMatch_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineMatch" ADD CONSTRAINT "TimelineMatch_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchSlot" ADD CONSTRAINT "MatchSlot_timelineMatchId_fkey" FOREIGN KEY ("timelineMatchId") REFERENCES "TimelineMatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchSlot" ADD CONSTRAINT "MatchSlot_sourceMatchId_fkey" FOREIGN KEY ("sourceMatchId") REFERENCES "TimelineMatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_timelineMatchId_fkey" FOREIGN KEY ("timelineMatchId") REFERENCES "TimelineMatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_doubleAId_fkey" FOREIGN KEY ("doubleAId") REFERENCES "Double"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_doubleBId_fkey" FOREIGN KEY ("doubleBId") REFERENCES "Double"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerTeamId_fkey" FOREIGN KEY ("winnerTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetScore" ADD CONSTRAINT "SetScore_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchResultLog" ADD CONSTRAINT "MatchResultLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchResultLog" ADD CONSTRAINT "MatchResultLog_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
