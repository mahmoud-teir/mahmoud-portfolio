import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Enable WebSocket support for serverless environments (needed for transactions)
neonConfig.webSocketConstructor = ws;

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL || ""

    if (!connectionString) {
        console.warn("DATABASE_URL is not set!")
    }

    console.log("Prisma initialized with Neon WebSocket transport (transactions supported).")
    const adapter = new PrismaNeon({ connectionString })
    return new PrismaClient({ adapter })
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma


