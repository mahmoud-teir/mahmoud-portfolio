import prisma from './lib/db';

async function main() {
    const user = await prisma.user.findFirst();
    console.log("User in DB:", user);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
