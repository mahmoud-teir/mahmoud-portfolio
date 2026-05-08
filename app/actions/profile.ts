"use server"

import prisma from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath, revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/lib/queries"

export async function revalidateUserCache() {
    revalidatePath("/")
    revalidatePath("/admin/profile")
    // @ts-ignore
    revalidateTag(CACHE_TAGS.USER)
}

export async function updateAdminProfile(data: { name: string, email: string, bio?: string }) {
    let session;
    try {
        session = await auth.api.getSession({
            headers: await headers()
        })
    } catch (e) {
        console.warn("Failed to get session during profile update:", e)
        return { success: false, error: "Authentication error. Your session might be invalid." }
    }

    if (!session?.user) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                email: data.email,
                bio: data.bio
            }
        })

        await prisma.securityLog.create({
            data: {
                event: 'UPDATE_PROFILE',
                level: 'INFO',
                details: `Admin profile details updated.`,
            }
        })

        await revalidateUserCache()
        return { success: true }
    } catch (error) {
        console.error("Profile update error:", error)
        return { success: false, error: "Failed to update profile" }
    }
}

export async function getProfileStats() {
    try {
        const adminUser = await prisma.user.findFirst({ orderBy: { updatedAt: 'desc' } })
        const projectCount = await prisma.project.count()

        return {
            memberSince: adminUser?.createdAt ? adminUser.createdAt.toISOString() : null,
            projectsLive: projectCount
        }
    } catch (e) {
        console.warn("Failed to fetch profile stats:", e)
        return { memberSince: null, projectsLive: 0 }
    }
}
