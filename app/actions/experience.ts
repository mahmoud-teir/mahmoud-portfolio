"use server"

import prisma from "@/lib/db"
import { revalidatePath, revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/lib/queries"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { experienceSchema } from "@/lib/validations/experience"

async function requireAuth() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) throw new Error("Unauthorized")
    return session
}

export async function getExperience() {
    return prisma.experience.findMany({ orderBy: { order: "asc" } })
}

export async function createExperience(data: FormData) {
    try {
        await requireAuth()

        const parsed = experienceSchema.safeParse({
            company: data.get("company"),
            role: data.get("role"),
            startDate: data.get("startDate"),
            endDate: data.get("endDate") || null,
            current: data.get("current") === "true",
            description: data.get("description") || "",
            order: Number(data.get("order") || 0)
        })

        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" }
        }

        const experience = await prisma.experience.create({
            data: parsed.data,
        })

        revalidatePath("/admin/experience")
        revalidatePath("/")
        // @ts-ignore - Next.js types mismatch
        revalidateTag(CACHE_TAGS.EXPERIENCES)
        return { success: true, experience }
    } catch (error) {
        console.error("Failed to create experience:", error)
        return { success: false, error: "Failed to create experience" }
    }
}

export async function updateExperience(id: string, data: FormData) {
    try {
        await requireAuth()

        const parsed = experienceSchema.safeParse({
            company: data.get("company"),
            role: data.get("role"),
            startDate: data.get("startDate"),
            endDate: data.get("endDate") || null,
            current: data.get("current") === "true",
            description: data.get("description") || "",
            order: Number(data.get("order") || 0)
        })

        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" }
        }

        const experience = await prisma.experience.update({
            where: { id },
            data: parsed.data,
        })

        revalidatePath("/admin/experience")
        revalidatePath("/")
        // @ts-ignore - Next.js types mismatch
        revalidateTag(CACHE_TAGS.EXPERIENCES)
        return { success: true, experience }
    } catch (error) {
        console.error("Failed to update experience:", error)
        return { success: false, error: "Failed to update experience" }
    }
}

export async function deleteExperience(id: string) {
    try {
        await requireAuth()
        await prisma.experience.delete({ where: { id } })
        revalidatePath("/admin/experience")
        revalidatePath("/")
        // @ts-ignore - Next.js types mismatch
        revalidateTag(CACHE_TAGS.EXPERIENCES)
        return { success: true }
    } catch (error) {
        console.error("Failed to delete experience:", error)
        return { success: false, error: "Failed to delete experience" }
    }
}
