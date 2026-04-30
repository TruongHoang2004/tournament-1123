import "dotenv/config";
import { PrismaClient, Gender, CategoryCode, RoundType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Defined" : "Undefined");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding database...");

    // ─── Clean existing data ──────────────────────────────────────────
    await prisma.matchResultLog.deleteMany();
    await prisma.setScore.deleteMany();
    await prisma.match.deleteMany();
    await prisma.matchSlot.deleteMany();
    await prisma.timelineMatch.deleteMany();
    await prisma.double.deleteMany();
    await prisma.player.deleteMany();
    await prisma.round.deleteMany();
    await prisma.team.deleteMany();
    await prisma.tournament.deleteMany();
    await prisma.category.deleteMany();

    console.log("✅ Cleaned existing data");

    // ─── Seed Categories ──────────────────────────────────────────────
    const categories = await Promise.all([
        prisma.category.create({ data: { code: CategoryCode.MEN_ADVANCED, name: "Advanced Men's Doubles" } }),
        prisma.category.create({ data: { code: CategoryCode.MEN_MIXED, name: "Mixed-Level Men's Doubles" } }),
        prisma.category.create({ data: { code: CategoryCode.MEN_INTERMEDIATE, name: "Intermediate Men's Doubles" } }),
        prisma.category.create({ data: { code: CategoryCode.MIXED_ADVANCED, name: "Advanced Mixed Doubles" } }),
        prisma.category.create({ data: { code: CategoryCode.MIXED_INTERMEDIATE, name: "Intermediate Mixed Doubles" } }),
        prisma.category.create({ data: { code: CategoryCode.WOMEN_DOUBLE, name: "Women's Doubles" } }),
    ]);
    console.log(`✅ Seeded ${categories.length} categories`);

    // ─── Create Tournament ────────────────────────────────────────────
    const tournament = await prisma.tournament.create({
        data: {
            name: "Giải Mùa Hè 2026",
            date: new Date("2026-05-17"),
        },
    });
    console.log(`✅ Created tournament: ${tournament.name}`);

    // ─── Create Rounds ────────────────────────────────────────────────
    const [groupRound, semiRound, finalRound] = await Promise.all([
        prisma.round.create({
            data: { name: RoundType.GROUP, tournamentId: tournament.id, pointWin: 2, pointLoss: 0 },
        }),
        prisma.round.create({
            data: { name: RoundType.SEMI, tournamentId: tournament.id, pointWin: 3, pointLoss: 1 },
        }),
        prisma.round.create({
            data: { name: RoundType.FINAL, tournamentId: tournament.id, pointWin: 4, pointLoss: 2 },
        }),
    ]);
    console.log("✅ Created rounds: GROUP, SEMI, FINAL");

    // ─── Team Roster Data (from image) ────────────────────────────────
    // DANH SÁCH CHIA ĐỘI ĐẤU GIẢI MÙA HÈ 2026
    const teamsData = [
        {
            name: "Team A",
            players: [
                { name: "Toàn (Út)", gender: Gender.MALE, level: 3 },
                { name: "Nga KM", gender: Gender.FEMALE, level: 3 },
                { name: "Hoa", gender: Gender.FEMALE, level: 3 },
                { name: "Tùng", gender: Gender.MALE, level: 3 },
                { name: "Long E", gender: Gender.MALE, level: 3 },
                { name: "Đạt", gender: Gender.MALE, level: 3 },
            ],
        },
        {
            name: "Team B",
            players: [
                { name: "Kiên", gender: Gender.MALE, level: 3 },
                { name: "Nhiệm", gender: Gender.MALE, level: 3 },
                { name: "Phượng", gender: Gender.FEMALE, level: 3 },
                { name: "Tuấn", gender: Gender.MALE, level: 3 },
                { name: "Trường", gender: Gender.MALE, level: 3 },
                { name: "Hợp", gender: Gender.MALE, level: 3 },
            ],
        },
        {
            name: "Team C",
            players: [
                { name: "Luân", gender: Gender.MALE, level: 3 },
                { name: "Hường KM", gender: Gender.FEMALE, level: 3 },
                { name: "Hường", gender: Gender.FEMALE, level: 3 },
                { name: "Toàn (Bé)", gender: Gender.MALE, level: 3 },
                { name: "Minh (HP)", gender: Gender.MALE, level: 3 },
                { name: "Long (Tóc đỏ)", gender: Gender.MALE, level: 3 },
            ],
        },
        {
            name: "Team D",
            players: [
                { name: "Hà KM", gender: Gender.FEMALE, level: 3 },
                { name: "Chi", gender: Gender.FEMALE, level: 3 },
                { name: "An", gender: Gender.MALE, level: 3 },
                { name: "Mạnh KM", gender: Gender.MALE, level: 3 },
                { name: "Hiền", gender: Gender.FEMALE, level: 3 },
                { name: "Tiến (Lớn)", gender: Gender.MALE, level: 3 },
            ],
        },
        {
            name: "Team E",
            players: [
                { name: "Đức", gender: Gender.MALE, level: 3 },
                { name: "Trang", gender: Gender.FEMALE, level: 3 },
                { name: "Mai KM", gender: Gender.FEMALE, level: 3 },
                { name: "Tiến (Em)", gender: Gender.MALE, level: 3 },
                { name: "Sơn", gender: Gender.MALE, level: 3 },
                { name: "Bình", gender: Gender.MALE, level: 3 },
            ],
        },
        {
            name: "Team F",
            players: [
                { name: "Thường", gender: Gender.MALE, level: 3 },
                { name: "Yến", gender: Gender.FEMALE, level: 3 },
                { name: "Thúy", gender: Gender.FEMALE, level: 3 },
                { name: "Huy", gender: Gender.MALE, level: 3 },
                { name: "Linh", gender: Gender.FEMALE, level: 3 },
                { name: "Toàn (Lớn)", gender: Gender.MALE, level: 3 },
            ],
        },
    ];

    // ─── Create Teams & Players ───────────────────────────────────────
    for (const teamData of teamsData) {
        const team = await prisma.team.create({
            data: {
                name: teamData.name,
                tournamentId: tournament.id,
                players: {
                    create: teamData.players,
                },
            },
            include: { players: true },
        });
        console.log(
            `✅ Created ${team.name} with ${team.players.length} players: ${team.players.map((p) => p.name).join(", ")}`
        );
    }

    // ─── Summary ──────────────────────────────────────────────────────
    const totalPlayers = await prisma.player.count();
    const totalTeams = await prisma.team.count();
    console.log(`\n🏸 Seed complete!`);
    console.log(`   Tournament: ${tournament.name}`);
    console.log(`   Teams: ${totalTeams}`);
    console.log(`   Players: ${totalPlayers}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Rounds: GROUP (W:${groupRound.pointWin}/L:${groupRound.pointLoss}), SEMI (W:${semiRound.pointWin}/L:${semiRound.pointLoss}), FINAL (W:${finalRound.pointWin}/L:${finalRound.pointLoss})`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
