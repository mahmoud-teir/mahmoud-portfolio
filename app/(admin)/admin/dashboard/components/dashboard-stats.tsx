import React from 'react'
import Link from 'next/link'
import db from '@/lib/db'
import { FolderKanban, BrainCircuit, Briefcase, ArrowRight } from 'lucide-react'

export default async function DashboardStats() {
    // Fetch counts from DB
    const [projectCount, skillCount, experienceCount] = await Promise.all([
        db.project.count(),
        db.skill.count(),
        db.experience.count(),
    ])

    const stats = [
        { label: 'Systems_Active', count: projectCount, icon: FolderKanban, href: '/admin/projects', color: '#adff2f' },
        { label: 'Neural_Nodes', count: skillCount, icon: BrainCircuit, href: '/admin/skills', color: '#ffffff' },
        { label: 'Clock_Cycles', count: experienceCount, icon: Briefcase, href: '/admin/experience', color: '#ffffff' },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {stats.map((stat) => (
                <Link
                    key={stat.label}
                    href={stat.href}
                    className={`
                        group relative border-4 border-black p-6 md:p-10 transition-all text-left
                        hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]
                        ${stat.color === '#adff2f' ? 'bg-[#adff2f] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' : 'bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'}
                    `}
                >
                    <div className="flex justify-between items-start mb-8">
                        <stat.icon size={32} className="stroke-[3]" />
                        <ArrowRight size={20} className="stroke-[3] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-1 text-left">
                        <p className="text-5xl md:text-7xl font-black tracking-tighter tabular-nums leading-none">
                            {stat.count.toString().padStart(2, '0')}
                        </p>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-800">
                            {stat.label}
                        </p>
                    </div>
                    {/* Dynamic Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-2 bg-black w-0 group-hover:w-full transition-all duration-500" />
                </Link>
            ))}
        </div>
    )
}
