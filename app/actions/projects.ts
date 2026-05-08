"use server"

import prisma from "@/lib/db"
import { revalidatePath, revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/lib/queries"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { projectSchema } from "@/lib/validations/project"

// Helper function to check auth
async function requireAuth() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        throw new Error("Unauthorized")
    }
    return session
}

export async function createProject(data: FormData) {
    try {
        await requireAuth()

        const tagsString = data.get("tags") as string
        const parsed = projectSchema.safeParse({
            title: data.get("title"),
            description: data.get("description"),
            liveUrl: data.get("liveUrl") || undefined,
            githubUrl: data.get("githubUrl") || undefined,
            image: data.get("image") || undefined,
            tags: tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [],
            featured: data.get("featured") === "true",
            order: Number(data.get("order") || 0)
        })

        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" }
        }

        const project = await prisma.project.create({
            data: parsed.data
        })

        await prisma.securityLog.create({
            data: {
                event: 'CREATE_PROJECT',
                level: 'INFO',
                details: `Project "${parsed.data.title}" created.`,
            }
        })

        revalidatePath("/projects")
        revalidatePath("/")
        // @ts-ignore - Next.js types mismatch
        revalidateTag(CACHE_TAGS.PROJECTS)
        return { success: true, project }
    } catch (error) {
        console.error("Failed to create project:", error)
        return { success: false, error: "Failed to create project" }
    }
}

export async function updateProject(id: string, data: FormData) {
    try {
        await requireAuth()

        const tagsString = data.get("tags") as string
        const parsed = projectSchema.safeParse({
            title: data.get("title"),
            description: data.get("description"),
            liveUrl: data.get("liveUrl") || undefined,
            githubUrl: data.get("githubUrl") || undefined,
            image: data.get("image") || undefined,
            tags: tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [],
            featured: data.get("featured") === "true",
            order: Number(data.get("order") || 0)
        })

        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" }
        }

        const project = await prisma.project.update({
            where: { id },
            data: parsed.data
        })

        await prisma.securityLog.create({
            data: {
                event: 'UPDATE_PROJECT',
                level: 'INFO',
                details: `Project "${project.title}" updated.`,
            }
        })

        revalidatePath("/projects")
        revalidatePath("/")
        revalidatePath(`/admin/dashboard`)
        // @ts-ignore - Next.js types mismatch
        revalidateTag(CACHE_TAGS.PROJECTS)
        return { success: true, project }
    } catch (error) {
        console.error("Failed to update project:", error)
        return { success: false, error: "Failed to update project" }
    }
}

export async function deleteProject(id: string) {
    try {
        await requireAuth()

        const project = await prisma.project.delete({
            where: { id }
        })

        await prisma.securityLog.create({
            data: {
                event: 'DELETE_PROJECT',
                level: 'WARNING',
                details: `Project "${project.title}" deleted.`,
            }
        })

        revalidatePath("/projects")
        revalidatePath("/")
        revalidatePath(`/admin/dashboard`)
        // @ts-ignore - Next.js types mismatch
        revalidateTag(CACHE_TAGS.PROJECTS)
        return { success: true }
    } catch (error) {
        console.error("Failed to delete project:", error)
        return { success: false, error: "Failed to delete project" }
    }
}
