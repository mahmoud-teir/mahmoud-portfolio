import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink, twoFactor } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import prisma from "./db";
import { Resend } from "resend";
import { recoveryEmailTemplate, magicLinkEmailTemplate } from "./email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://mahmoud-teir.vercel.app/",
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: ["http://localhost:3000", "http://127.0.0.1:3000", "https://mahmoud-teir.vercel.app"],
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
        resetPasswordTokenExpiresIn: 3600 * 24, // 24 hours
        autoSignIn: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            console.log("[RESET] Sending reset email to:", user.email);
            console.log("[RESET] Reset URL:", url);

            if (!process.env.RESEND_API_KEY) {
                console.warn("⚠️ RESEND_API_KEY not set. Password Reset URL:", url);
                return;
            }

            try {
                const result = await resend.emails.send({
                    from: "onboarding@resend.dev",
                    to: user.email,
                    subject: "MAHMOUD.DEV // Password Reset Protocol",
                    html: recoveryEmailTemplate(url),
                });
                console.log("[RESET] Email sent successfully:", result);
            } catch (error) {
                console.error("[RESET] Failed to send recovery email:", error);
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
    plugins: [
        magicLink({
            sendMagicLink: async ({ email, token, url }, request) => {
                if (!process.env.RESEND_API_KEY) {
                    console.warn("⚠️ RESEND_API_KEY not set. Magic Link URL:", url);
                    return;
                }

                try {
                    await resend.emails.send({
                        from: "onboarding@resend.dev",
                        to: email,
                        subject: "MAHMOUD.DEV // Magic Link Login",
                        html: magicLinkEmailTemplate(url),
                    });
                } catch (error) {
                    console.error("Failed to send magic link email via Resend:", error);
                }
            },
        }),
        twoFactor(),
        passkey(),
    ],
});
