import prisma from "@/lib/db"
import { BaseRepository, PaginationParams, PaginatedResult } from "./base"
import { Project } from "@prisma/client"
import { cache } from "react"
import { unstable_cache } from "next/cache"

export class ProjectRepository implements BaseRepository<Project> {
    // Use React cache for request deductive
    findById = cache(async (id: string): Promise<Project | null> => {
        return prisma.project.findUnique({ where: { id } })
    })

    // unstable_cache for cross-request caching
    findMany = unstable_cache(
        async (params?: PaginationParams): Promise<PaginatedResult<Project>> => {
            const page = params?.page || 1
            const limit = params?.limit || 10
            const sortBy = params?.sortBy || "order"
            const sortOrder = params?.sortOrder || "desc"

            const [data, total] = await Promise.all([
                prisma.project.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                }),
                prisma.project.count(),
            ])

            return {
                data,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            }
        },
        ["projects-list"],
        {
            revalidate: 60, // Cache for 60 seconds
            tags: ["projects"],
        }
    )

    async create(data: Partial<Project>): Promise<Project> {
        return prisma.project.create({ data: data as any })
    }

    async update(id: string, data: Partial<Project>): Promise<Project> {
        return prisma.project.update({ where: { id }, data: data as any })
    }

    async delete(id: string): Promise<void> {
        await prisma.project.delete({ where: { id } })
    }
}

export const projectRepo = new ProjectRepository()
