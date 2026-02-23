"use server"

import prisma from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

const SETTINGS_ID = "global"

export async function getSiteSettings() {
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { id: SETTINGS_ID }
        })

        // Return default settings if none exist yet
        if (!settings) {
            return await prisma.siteSettings.create({
                data: { id: SETTINGS_ID }
            })
        }

        return settings
    } catch (error) {
        console.error("Error fetching site settings:", error)
        return null
    }
}

export async function updateSiteSettings(data: {
    heroTitle?: string
    heroSubtitle?: string
    marqueeText?: string
    aboutSkills?: string[]
    contactText?: string
    githubUrl?: string
    linkedinUrl?: string
    twitterUrl?: string
    displayEmail?: string
    bioHeadline?: string
    bioEst?: string
}) {
    let session;
    try {
        session = await auth.api.getSession({
            headers: await headers()
        })
    } catch (e) {
        console.warn("Failed to get session during settings update:", e)
        return { success: false, error: "Authentication error. Your session might be invalid." }
    }

    if (!session?.user) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const settings = await prisma.siteSettings.upsert({
            where: { id: SETTINGS_ID },
            update: data,
            create: {
                id: SETTINGS_ID,
                ...data
            }
        })

        await prisma.securityLog.create({
            data: {
                event: 'UPDATE_SETTINGS',
                level: 'INFO',
                details: `Site settings updated by admin.`,
            }
        })

        revalidatePath("/")
        revalidatePath("/admin/settings")
        return { success: true, settings }
    } catch (error) {
        console.error("Site settings update error:", error)
        return { success: false, error: "Failed to update site settings" }
    }
}
