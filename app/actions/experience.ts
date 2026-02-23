"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

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

        const company = data.get("company") as string
        const role = data.get("role") as string
        const startDate = data.get("startDate") as string
        const endDate = data.get("endDate") as string | null
        const current = data.get("current") === "true"
        const description = (data.get("description") as string) || ""
        const order = Number(data.get("order") || 0)

        if (!company || !role || !startDate) {
            return { success: false, error: "Company, role, and start date are required" }
        }

        const experience = await prisma.experience.create({
            data: {
                company,
                role,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                current,
                description,
                order,
            },
        })

        revalidatePath("/admin/experience")
        revalidatePath("/")
        return { success: true, experience }
    } catch (error) {
        console.error("Failed to create experience:", error)
        return { success: false, error: "Failed to create experience" }
    }
}

export async function updateExperience(id: string, data: FormData) {
    try {
        await requireAuth()

        const company = data.get("company") as string
        const role = data.get("role") as string
        const startDate = data.get("startDate") as string
        const endDate = data.get("endDate") as string | null
        const current = data.get("current") === "true"
        const description = (data.get("description") as string) || ""
        const order = Number(data.get("order") || 0)

        const experience = await prisma.experience.update({
            where: { id },
            data: {
                ...(company && { company }),
                ...(role && { role }),
                ...(startDate && { startDate: new Date(startDate) }),
                endDate: endDate ? new Date(endDate) : null,
                current,
                description,
                order,
            },
        })

        revalidatePath("/admin/experience")
        revalidatePath("/")
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
        return { success: true }
    } catch (error) {
        console.error("Failed to delete experience:", error)
        return { success: false, error: "Failed to delete experience" }
    }
}
