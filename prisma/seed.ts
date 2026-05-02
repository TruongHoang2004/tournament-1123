import "dotenv/config";
import { PrismaClient, Gender, CategoryCode, RoundType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
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
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Cleaned existing data");

    // ─── Seed Categories ──────────────────────────────────────────────
    const categories = await Promise.all([
        prisma.category.create({ data: { code: CategoryCode.MEN_ADVANCED, name: "Đôi nam trình độ nâng cao" } }),
        prisma.category.create({ data: { code: CategoryCode.MEN_MIXED, name: "Đôi nam trình độ hỗn hợp" } }),
        prisma.category.create({ data: { code: CategoryCode.MEN_INTERMEDIATE, name: "Đôi nam trình độ trung cấp" } }),
        prisma.category.create({ data: { code: CategoryCode.MIXED_ADVANCED, name: "Đôi nam nữ trình độ nâng cao" } }),
        prisma.category.create({ data: { code: CategoryCode.MIXED_INTERMEDIATE, name: "Đôi nam nữ trình độ trung cấp" } }),
        prisma.category.create({ data: { code: CategoryCode.WOMEN_DOUBLE, name: "Đôi nữ" } }),
    ]);
    console.log(`✅ Seeded ${categories.length} categories`);

    // ─── Seed Users ──────────────────────────────────────────────────
    const hashedAdminPassword = await bcrypt.hash("1123", 10);
    const hashedUserPassword = await bcrypt.hash("user123", 10);

    const users = await Promise.all([
        prisma.user.create({
            data: {
                username: "admin",
                password: hashedAdminPassword,
                role: Role.ADMIN
            }
        }),
        prisma.user.create({
            data: {
                username: "truonghoang",
                password: hashedUserPassword,
                role: Role.USER
            }
        })
    ]);
    console.log(`✅ Seeded ${users.length} users (admin/1123, truonghoang/user123)`);

    // ─── Create Rounds ────────────────────────────────────────────────
    const [groupRound, semiRound, finalRound] = await Promise.all([
        prisma.round.create({ data: { name: RoundType.GROUP, pointWin: 2, pointLoss: 0 } }),
        prisma.round.create({ data: { name: RoundType.SEMI, pointWin: 3, pointLoss: 1 } }),
        prisma.round.create({ data: { name: RoundType.FINAL, pointWin: 4, pointLoss: 2 } }),
    ]);
    console.log("✅ Created rounds: GROUP, SEMI, FINAL");

    // ─── Team Roster Data ─────────────────────────────────────────────
    const teamsData = [
        {
            name: "Team A",
            players: [
                { name: "Toàn (Út)", gender: Gender.MALE, level: 1 },
                { name: "Nga KM", gender: Gender.FEMALE, level: 2 },
                { name: "Hoa", gender: Gender.FEMALE, level: 1 },
                { name: "Tùng", gender: Gender.MALE, level: 2 },
                { name: "Long E", gender: Gender.MALE, level: 3 },
                { name: "Đạt", gender: Gender.MALE, level: 4 },
            ],
        },
        {
            name: "Team B",
            players: [
                { name: "Kiên", gender: Gender.MALE, level: 1 },
                { name: "Nhiệm", gender: Gender.MALE, level: 2 },
                { name: "Phượng", gender: Gender.FEMALE, level: 1 },
                { name: "Tuấn", gender: Gender.MALE, level: 2 },
                { name: "Trường", gender: Gender.MALE, level: 3 },
                { name: "Hợp", gender: Gender.MALE, level: 4 },
            ],
        },
        {
            name: "Team C",
            players: [
                { name: "Luân", gender: Gender.MALE, level: 1 },
                { name: "Hường KM", gender: Gender.FEMALE, level: 2 },
                { name: "Hường", gender: Gender.FEMALE, level: 1 },
                { name: "Toàn (Bé)", gender: Gender.MALE, level: 2 },
                { name: "Minh (HP)", gender: Gender.MALE, level: 3 },
                { name: "Long (Tóc đỏ)", gender: Gender.MALE, level: 4 },
            ],
        },
        {
            name: "Team D",
            players: [
                { name: "Hà KM", gender: Gender.MALE, level: 1 },
                { name: "Chi", gender: Gender.FEMALE, level: 2 },
                { name: "An", gender: Gender.MALE, level: 1 },
                { name: "Mạnh KM", gender: Gender.MALE, level: 2 },
                { name: "Hiền", gender: Gender.FEMALE, level: 3 },
                { name: "Tiến (Lớn)", gender: Gender.MALE, level: 4 },
            ],
        },
        {
            name: "Team E",
            players: [
                { name: "Đức", gender: Gender.MALE, level: 1 },
                { name: "Trang", gender: Gender.FEMALE, level: 2 },
                { name: "Mai KM", gender: Gender.FEMALE, level: 1 },
                { name: "Tiến (Em)", gender: Gender.MALE, level: 2 },
                { name: "Sơn", gender: Gender.MALE, level: 3 },
                { name: "Bình", gender: Gender.MALE, level: 4 },
            ],
        },
        {
            name: "Team F",
            players: [
                { name: "Thường", gender: Gender.MALE, level: 1 },
                { name: "Yến", gender: Gender.FEMALE, level: 2 },
                { name: "Thúy", gender: Gender.FEMALE, level: 1 },
                { name: "Huy", gender: Gender.MALE, level: 2 },
                { name: "Linh", gender: Gender.FEMALE, level: 3 },
                { name: "Toàn (Lớn)", gender: Gender.MALE, level: 4 },
            ],
        },
    ];

    // ─── Create Teams & Players ───────────────────────────────────────
    for (const teamData of teamsData) {
        const team = await prisma.team.create({
            data: {
                name: teamData.name,
                players: { create: teamData.players },
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
    console.log(`   Teams: ${totalTeams}`);
    console.log(`   Players: ${totalPlayers}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Rounds: GROUP (W:${groupRound.pointWin}/L:${groupRound.pointLoss}), SEMI (W:${semiRound.pointWin}/L:${semiRound.pointLoss}), FINAL (W:${finalRound.pointWin}/L:${finalRound.pointLoss})`);
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });