// Import necessary modules
import { BetterAuth } from 'better-auth';
import { prismaAdapter } from './prisma';

const auth = BetterAuth({
    providers: {
        email: {
            ... // Your email provider configuration
        },
        // Other providers...
    },
    adapter: prismaAdapter,
    databaseHooks: {
        // Your database hooks
    },
    trustedOrigins: ["http://localhost:3000", "http://127.0.0.1:3000", "https://mahmoud-portfolio-phi.vercel.app"],
});

export const auth;