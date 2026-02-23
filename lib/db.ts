import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'

// Use a custom fetch function to bypass Next.js 15+ aggressive fetch caching/interception
// which can cause "TypeError: fetch failed" with Neon HTTP
if (globalThis.fetch) {
    neonConfig.fetchFunction = globalThis.fetch;
}

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL || ""

    if (!connectionString) {
        console.warn("DATABASE_URL is not set!")
    }

    console.log("Prisma initialized with Neon HTTP transport.")
    const adapter = new PrismaNeonHttp(connectionString, {})
    return new PrismaClient({ adapter })
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
