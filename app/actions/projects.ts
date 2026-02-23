"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

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

        const title = data.get("title") as string
        const description = data.get("description") as string
        const liveUrl = (data.get("liveUrl") as string) || null
        const githubUrl = (data.get("githubUrl") as string) || null
        const image = (data.get("image") as string) || null
        const tagsString = data.get("tags") as string
        const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : []
        const featured = data.get("featured") === "true"

        if (!title || !description) {
            throw new Error("Title and description are required")
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                liveUrl,
                githubUrl,
                image,
                tags,
                featured,
            }
        })

        await prisma.securityLog.create({
            data: {
                event: 'CREATE_PROJECT',
                level: 'INFO',
                details: `Project "${title}" created.`,
            }
        })

        revalidatePath("/projects")
        revalidatePath("/")
        return { success: true, project }
    } catch (error) {
        console.error("Failed to create project:", error)
        return { success: false, error: "Failed to create project" }
    }
}

export async function updateProject(id: string, data: FormData) {
    try {
        await requireAuth()

        const title = data.get("title") as string
        const description = data.get("description") as string
        const liveUrl = (data.get("liveUrl") as string) || null
        const githubUrl = (data.get("githubUrl") as string) || null
        const image = (data.get("image") as string) || null
        const tagsString = data.get("tags") as string
        const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : []
        const featured = data.get("featured") === "true"
        const orderString = data.get("order") as string
        const order = orderString ? parseInt(orderString, 10) : undefined

        const project = await prisma.project.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                liveUrl,
                githubUrl,
                image,
                ...(tags.length > 0 && { tags }),
                featured,
                ...(order !== undefined && { order })
            }
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
        return { success: true }
    } catch (error) {
        console.error("Failed to delete project:", error)
        return { success: false, error: "Failed to delete project" }
    }
}
