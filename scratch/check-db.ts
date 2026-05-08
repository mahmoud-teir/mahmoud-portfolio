import prisma from '../lib/db';

async function main() {
    const user = await prisma.user.findFirst();
    console.log('Current user image:', user?.image);
}

main();
