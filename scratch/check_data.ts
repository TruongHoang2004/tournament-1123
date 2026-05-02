import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const rounds = await prisma.round.findMany();
    const categories = await prisma.category.findMany();
    const timelineMatches = await prisma.timelineMatch.findMany();
    const matches = await prisma.match.findMany();
    const doubles = await prisma.double.findMany();
    const teams = await prisma.team.findMany();

    console.log('Rounds:', rounds.length);
    console.log('Categories:', categories.length);
    console.log('TimelineMatches:', timelineMatches.length);
    console.log('Matches:', matches.length);
    console.log('Doubles:', doubles.length);
    console.log('Teams:', teams.length);
    
    if (timelineMatches.length > 0) {
        console.log('Sample TimelineMatch:', JSON.stringify(timelineMatches[0], null, 2));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
