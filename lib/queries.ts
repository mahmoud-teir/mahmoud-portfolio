import { unstable_cache } from 'next/cache'
import prisma from '@/lib/db'

// Cache Tags
export const CACHE_TAGS = {
    SKILLS: 'skills',
    PROJECTS: 'projects',
    EXPERIENCES: 'experiences',
    USER: 'user',
    SITE_SETTINGS: 'site-settings'
}

export const getCachedSkills = unstable_cache(
    async () => {
        return prisma.skill.findMany({ orderBy: { order: 'asc' } })
    },
    ['public-skills'],
    { tags: [CACHE_TAGS.SKILLS] }
)

export const getCachedProjects = unstable_cache(
    async () => {
        return prisma.project.findMany({
            where: { featured: true },
            orderBy: { order: 'asc' }
        })
    },
    ['public-featured-projects'],
    { tags: [CACHE_TAGS.PROJECTS] }
)

export const getCachedExperiences = unstable_cache(
    async () => {
        return prisma.experience.findMany({ orderBy: { order: 'asc' } })
    },
    ['public-experiences'],
    { tags: [CACHE_TAGS.EXPERIENCES] }
)

export const getCachedUser = unstable_cache(
    async () => {
        return prisma.user.findFirst({ orderBy: { updatedAt: 'desc' } })
    },
    ['public-user-info'],
    { tags: [CACHE_TAGS.USER] }
)

export const getCachedSiteSettings = unstable_cache(
    async () => {
        return prisma.siteSettings.findUnique({ where: { id: "global" } })
    },
    ['public-site-settings'],
    { tags: [CACHE_TAGS.SITE_SETTINGS] }
)
