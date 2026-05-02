import prisma from '../lib/prisma';

async function test() {
    try {
        const result = await prisma.double.updateMany({
            data: { group: null }
        });
        console.log('Success:', result);
    } catch (e) {
        console.error('Error:', e);
    }
}

test().finally(() => prisma.$disconnect());
