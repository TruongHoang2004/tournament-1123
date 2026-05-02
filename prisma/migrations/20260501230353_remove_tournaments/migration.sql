/*
  Warnings:

  - You are about to drop the column `tournamentId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentId` on the `Round` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `Tournament` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Round` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_tournamentId_fkey";

-- DropIndex
DROP INDEX "Match_tournamentId_idx";

-- DropIndex
DROP INDEX "Round_tournamentId_idx";

-- DropIndex
DROP INDEX "Round_tournamentId_name_key";

-- DropIndex
DROP INDEX "Team_tournamentId_idx";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "tournamentId";

-- AlterTable
ALTER TABLE "Round" DROP COLUMN "tournamentId";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "tournamentId";

-- DropTable
DROP TABLE "Tournament";

-- CreateIndex
CREATE UNIQUE INDEX "Round_name_key" ON "Round"("name");
