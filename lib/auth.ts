import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { Resend } from "resend";
import { recoveryEmailTemplate } from "./email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
    user: {
        additionalFields: {
            cvUrl: {
                type: "string",
                required: false,
            }
        }
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            if (!process.env.RESEND_API_KEY) {
                console.warn("⚠️ RESEND_API_KEY not set. Password Reset URL:", url);
                return;
            }

            try {
                await resend.emails.send({
                    from: "onboarding@resend.dev", // Update this to your verified domain (e.g., admin@mahmoud.dev)
                    to: user.email,
                    subject: "MAHMOUD.DEV // Password Reset Protocol",
                    html: recoveryEmailTemplate(url),
                });
                console.log(`Recovery email successfully sent to ${user.email} via Resend.`);
            } catch (error) {
                console.error("Failed to send recovery email via Resend:", error);
            }
        },
        databaseHooks: {
            session: {
                create: {
                    after: async (session: any) => {
                        try {
                            await prisma.securityLog.create({
                                data: {
                                    event: 'ADMIN_LOGIN',
                                    level: 'SUCCESS',
                                    details: `Session active for user_id: ${session.userId}`,
                                },
                            });
                        } catch (e) { console.error('Failed to log login event') }
                    }
                },
                delete: {
                    after: async (session: any) => {
                        try {
                            await prisma.securityLog.create({
                                data: {
                                    event: 'ADMIN_LOGOUT',
                                    level: 'INFO',
                                    details: `Session terminated manually by user or expired.`,
                                },
                            });
                        } catch (e) { console.error('Failed to log logout event') }
                    }
                }
            }
        },
    },
});
