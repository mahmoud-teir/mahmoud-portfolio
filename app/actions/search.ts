'use server'

import prisma from '@/lib/db'

type SearchResult = {
    id: string
    title: string
    type: 'PROJECT' | 'EXPERIENCE' | 'SKILL'
    href: string
}

export async function searchAll(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) return []

    const searchTerm = query.trim()

    try {
        // Execute parallel queries across different models
        const [projects, experiences, skills] = await Promise.all([
            prisma.project.findMany({
                where: {
                    OR: [
                        { title: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } },
                        { tags: { has: searchTerm } }
                    ]
                },
                select: { id: true, title: true },
                take: 5
            }),
            prisma.experience.findMany({
                where: {
                    OR: [
                        { company: { contains: searchTerm, mode: 'insensitive' } },
                        { role: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                },
                select: { id: true, role: true, company: true },
                take: 5
            }),
            prisma.skill.findMany({
                where: {
                    name: { contains: searchTerm, mode: 'insensitive' }
                },
                select: { id: true, name: true },
                take: 5
            })
        ])

        // Format and combine results
        const results: SearchResult[] = [
            ...projects.map(p => ({
                id: p.id,
                title: p.title,
                type: 'PROJECT' as const,
                href: `/project/${p.id}` // Use standalone project page route
            })),
            ...experiences.map(e => ({
                id: e.id,
                title: `${e.role} at ${e.company}`,
                type: 'EXPERIENCE' as const,
                href: '/#experience' // Anchor link to homepage experience section
            })),
            ...skills.map(s => ({
                id: s.id,
                title: s.name,
                type: 'SKILL' as const,
                href: '/#stack' // Anchor link to homepage stack section
            }))
        ]

        // Sort combined results alphabetically as a simple secondary sort
        return results.sort((a, b) => a.title.localeCompare(b.title)).slice(0, 10)

    } catch (error) {
        console.error("Failed to perform global search:", error)
        return []
    }
}
