'use client'

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/section-header';

export const Projects = ({ projects }: { projects: any[] }) => {
    return (
        <section id="work" className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-start justify-between mb-24 gap-8">
                    <SectionHeader title="Selected_Projects" className="mb-0" />
                    <p className="text-xl font-bold max-w-sm uppercase border-l-4 border-black pl-4 leading-tight">
                        Radical digital products from enterprise SaaS to experimental Web3 applications.
                    </p>
                </div>

                <div className="space-y-32">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="group grid grid-cols-1 lg:grid-cols-12 gap-0 border-4 border-black neo-shadow-hover transition-all overflow-hidden bg-white"
                        >
                            <div className={`lg:col-span-7 border-black border-b-4 lg:border-b-0 ${i % 2 === 0 ? 'lg:border-r-4' : 'lg:border-l-4 lg:order-2'} overflow-hidden bg-black relative min-h-[400px]`}>
                                {project.image && (
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                                        referrerPolicy="no-referrer"
                                    />
                                )}
                            </div>

                            <div className={`lg:col-span-5 p-12 flex flex-col justify-center bg-white group-hover:bg-neon transition-colors ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map((tag: string) => (
                                        <span key={tag} className="bg-black text-white px-3 py-1 font-bold text-xs uppercase">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h3 className="text-4xl font-extrabold uppercase mb-6 leading-none tracking-tighter">
                                    {project.title}
                                </h3>

                                <p className="text-lg font-bold uppercase mb-8 leading-tight opacity-80">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-fit border-4 border-black px-8 py-3 bg-white font-extrabold uppercase neo-shadow-sm hover:translate-y-1 hover:shadow-none transition-all"
                                        >
                                            View Project
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {projects.length === 0 && (
                        <div className="border-4 border-black border-dashed p-20 text-center bg-white neo-shadow">
                            <p className="text-2xl font-bold uppercase opacity-50 italic">// NO_FEATURED_PROJECTS_INITIATED</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
