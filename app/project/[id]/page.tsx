import React from 'react'
import prisma from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Github, ArrowLeft } from 'lucide-react'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: PageProps) {
    const { id } = await params
    const project = await prisma.project.findUnique({
        where: { id }
    })

    if (!project) notFound()

    return (
        <div className="min-h-screen bg-brutal-bg p-6 md:p-12 font-mono">
            <Link
                href="/#projects"
                className="inline-flex items-center gap-2 mb-8 bg-black text-[#adff2f] px-4 py-2 font-black uppercase text-sm brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
                <ArrowLeft size={16} className="stroke-[3]" />
                Return_To_Matrix
            </Link>

            <div className="max-w-4xl mx-auto bg-white border-4 border-black p-6 md:p-12 brutal-shadow">
                <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tighter mb-6">{project.title}</h1>

                {project.image && (
                    <div className="relative w-full aspect-video border-4 border-black mb-8 bg-brutal-bg">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-[#adff2f] border-2 border-black px-3 py-1 text-xs font-black uppercase"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <p className="text-lg md:text-xl font-bold font-sans leading-relaxed mb-12">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-4">
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-black text-[#adff2f] px-6 py-4 font-black uppercase border-4 border-black brutal-shadow hover:bg-white hover:text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            <ExternalLink size={20} className="stroke-[3]" />
                            Initialize_Link
                        </a>
                    )}
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white text-black px-6 py-4 font-black uppercase border-4 border-black brutal-shadow hover:bg-[#adff2f] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            <Github size={20} className="stroke-[3]" />
                            Source_Code
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
