import prisma from "@/lib/db"
import { BaseRepository, PaginationParams, PaginatedResult } from "./base"
import { Skill } from "@prisma/client"
import { cache } from "react"
import { unstable_cache } from "next/cache"

export class SkillRepository implements BaseRepository<Skill> {
    findById = cache(async (id: string): Promise<Skill | null> => {
        return prisma.skill.findUnique({ where: { id } })
    })

    findMany = unstable_cache(
        async (params?: PaginationParams): Promise<PaginatedResult<Skill>> => {
            const page = params?.page || 1
            const limit = params?.limit || 50
            const sortBy = params?.sortBy || "order"
            const sortOrder = params?.sortOrder || "desc"

            const [data, total] = await Promise.all([
                prisma.skill.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                }),
                prisma.skill.count(),
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
        ["skills-list"],
        {
            revalidate: 60,
            tags: ["skills"],
        }
    )

    async create(data: Partial<Skill>): Promise<Skill> {
        return prisma.skill.create({ data: data as any })
    }

    async update(id: string, data: Partial<Skill>): Promise<Skill> {
        return prisma.skill.update({ where: { id }, data: data as any })
    }

    async delete(id: string): Promise<void> {
        await prisma.skill.delete({ where: { id } })
    }
}

export const skillRepo = new SkillRepository()
