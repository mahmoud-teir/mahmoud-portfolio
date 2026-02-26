"use server"

import prisma from "@/lib/db"
import { revalidatePath, revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/lib/queries"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { skillSchema } from "@/lib/validations/skill"

async function requireAuth() {
    let session;
    try {
        session = await auth.api.getSession({ headers: await headers() })
    } catch (e) {
        console.warn("Failed to get session in skills action:", e)
        throw new Error("Authentication error")
    }
    if (!session) throw new Error("Unauthorized")
    return session
}

export async function getSkills() {
    return prisma.skill.findMany({ orderBy: { order: "asc" } })
}

export async function createSkill(data: FormData) {
    try {
        await requireAuth()

        const parsed = skillSchema.safeParse({
            name: data.get("name"),
            category: data.get("category"),
            order: Number(data.get("order") || 0),
        })

        if (!parsed.success) {
            return { success: false, error: parsed.error.flatten().fieldErrors }
        }

        const skill = await prisma.skill.create({ data: parsed.data })

        await prisma.securityLog.create({
            data: {
                event: 'CREATE_SKILL',
                level: 'INFO',
                details: `Skill "${skill.name}" created.`,
            }
        })
        revalidatePath("/admin/skills")
        revalidatePath("/")
        return { success: true, skill }
    } catch (error) {
        console.error("Failed to create skill:", error)
        return { success: false, error: "Failed to create skill" }
    }
}

export async function updateSkill(id: string, data: FormData) {
    try {
        await requireAuth()

        const parsed = skillSchema.safeParse({
            name: data.get("name"),
            category: data.get("category"),
            order: Number(data.get("order") || 0),
        })

        if (!parsed.success) {
            return { success: false, error: parsed.error.flatten().fieldErrors }
        }

        const skill = await prisma.skill.update({
            where: { id },
            data: parsed.data,
        })

        await prisma.securityLog.create({
            data: {
                event: 'UPDATE_SKILL',
                level: 'INFO',
                details: `Skill "${skill.name}" updated.`,
            }
        })
        revalidatePath("/admin/skills")
        revalidatePath("/")
        return { success: true, skill }
    } catch (error) {
        console.error("Failed to update skill:", error)
        return { success: false, error: "Failed to update skill" }
    }
}

export async function deleteSkill(id: string) {
    try {
        await requireAuth()
        const skill = await prisma.skill.delete({ where: { id } })

        await prisma.securityLog.create({
            data: {
                event: 'DELETE_SKILL',
                level: 'WARNING',
                details: `Skill "${skill.name}" deleted.`,
            }
        })
        revalidatePath("/admin/skills")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete skill:", error)
        return { success: false, error: "Failed to delete skill" }
    }
}
