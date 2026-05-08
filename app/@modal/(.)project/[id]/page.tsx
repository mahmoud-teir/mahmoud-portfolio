import React from 'react'
import prisma from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'
import { Modal } from '@/components/ui/modal'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ProjectModal({ params }: PageProps) {
    const { id } = await params
    const project = await prisma.project.findUnique({
        where: { id }
    })

    if (!project) notFound()

    return (
        <Modal>
            <div className="p-6 md:p-10 font-mono text-black">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-black text-[#adff2f] px-2 py-0.5 text-[10px] font-black uppercase">Project_Details</span>
                        <div className="h-[2px] flex-1 bg-black/10"></div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                        {project.title}
                    </h2>
                </div>

                {/* Main Image */}
                {project.image && (
                    <div className="relative w-full aspect-video border-4 border-black mb-8 bg-gray-100 group overflow-hidden">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[10px] font-bold uppercase border-2 border-white/20 backdrop-blur-sm">
                            Visual_Preview
                        </div>
                    </div>
                )}

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-[#adff2f] border-2 border-black px-4 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-black uppercase mb-4 opacity-40">// DESCRIPTION</h4>
                        <div className="text-lg font-bold leading-relaxed space-y-4">
                            {project.description.split('\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-xs font-black uppercase mb-4 opacity-40">// LINKS</h4>
                            <div className="flex flex-col gap-3">
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between gap-2 bg-black text-[#adff2f] px-6 py-4 font-black uppercase border-4 border-black brutal-shadow hover:bg-white hover:text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
                                    >
                                        <span>Visit_Live</span>
                                        <ExternalLink size={18} className="group-hover:rotate-45 transition-transform" />
                                    </a>
                                )}
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between gap-2 bg-white text-black px-6 py-4 font-black uppercase border-4 border-black brutal-shadow hover:bg-[#adff2f] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
                                    >
                                        <span>Source_Code</span>
                                        <Github size={18} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
