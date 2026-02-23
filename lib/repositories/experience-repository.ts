import prisma from "@/lib/db"
import { BaseRepository, PaginationParams, PaginatedResult } from "./base"
import { Experience } from "@prisma/client"
import { cache } from "react"
import { unstable_cache } from "next/cache"

export class ExperienceRepository implements BaseRepository<Experience> {
    findById = cache(async (id: string): Promise<Experience | null> => {
        return prisma.experience.findUnique({ where: { id } })
    })

    findMany = unstable_cache(
        async (params?: PaginationParams): Promise<PaginatedResult<Experience>> => {
            const page = params?.page || 1
            const limit = params?.limit || 20
            const sortBy = params?.sortBy || "order"
            const sortOrder = params?.sortOrder || "desc"

            const [data, total] = await Promise.all([
                prisma.experience.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                }),
                prisma.experience.count(),
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
        ["experience-list"],
        {
            revalidate: 60,
            tags: ["experience"],
        }
    )

    async create(data: Partial<Experience>): Promise<Experience> {
        return prisma.experience.create({ data: data as any })
    }

    async update(id: string, data: Partial<Experience>): Promise<Experience> {
        return prisma.experience.update({ where: { id }, data: data as any })
    }

    async delete(id: string): Promise<void> {
        await prisma.experience.delete({ where: { id } })
    }
}

export const experienceRepo = new ExperienceRepository()
