import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// DELETE /api/doubles/[id] — Xóa bộ đôi và tự động reset lịch đấu/kết quả của nội dung liên quan
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession(request);
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Không có quyền: Cần quyền quản trị viên" }, { status: 401 });
        }

        const { id } = await params;

        // Tìm bộ đôi để lấy categoryId
        const double = await prisma.double.findUnique({
            where: { id }
        });

        if (!double) {
            return NextResponse.json({ error: "Không tìm thấy bộ đôi" }, { status: 404 });
        }

        const categoryId = double.categoryId;

        // Thực hiện xóa cascade toàn bộ lịch đấu, điểm số, log kết quả của category này
        await prisma.$transaction([
            // Xóa điểm số các set đấu thuộc nội dung này
            prisma.setScore.deleteMany({
                where: { match: { timelineMatch: { categoryId } } }
            }),
            // Xóa log kết quả trận đấu thuộc nội dung này
            prisma.matchResultLog.deleteMany({
                where: { match: { timelineMatch: { categoryId } } }
            }),
            // Xóa các trận đấu runtime thuộc nội dung này
            prisma.match.deleteMany({
                where: { timelineMatch: { categoryId } }
            }),
            // Xóa các slot trận đấu thuộc nội dung này
            prisma.matchSlot.deleteMany({
                where: { timelineMatch: { categoryId } }
            }),
            // Xóa timeline trận đấu thuộc nội dung này
            prisma.timelineMatch.deleteMany({
                where: { categoryId }
            }),
            // Cuối cùng, xóa bộ đôi
            prisma.double.delete({
                where: { id }
            })
        ]);

        return NextResponse.json({ success: true, message: "Đã xóa bộ đôi và reset lịch thi đấu liên quan." });

    } catch (e: any) {
        console.error("Error deleting double:", e);
        return NextResponse.json({ error: e.message || "Không thể xóa bộ đôi" }, { status: 500 });
    }
}
