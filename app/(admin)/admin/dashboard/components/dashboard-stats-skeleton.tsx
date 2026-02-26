import React from 'react'
import { FolderKanban, BrainCircuit, Briefcase, ArrowRight } from 'lucide-react'

export function DashboardStatsSkeleton() {
    const stats = [
        { label: 'Systems_Active', icon: FolderKanban, color: '#adff2f' },
        { label: 'Neural_Nodes', icon: BrainCircuit, color: '#ffffff' },
        { label: 'Clock_Cycles', icon: Briefcase, color: '#ffffff' },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className={`
                        relative border-4 border-black p-6 md:p-10 text-left
                        ${stat.color === '#adff2f' ? 'bg-[#adff2f] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' : 'bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'}
                    `}
                >
                    <div className="flex justify-between items-start mb-8 opacity-50">
                        <stat.icon size={32} className="stroke-[3]" />
                        <ArrowRight size={20} className="stroke-[3]" />
                    </div>
                    <div className="space-y-4 text-left animate-pulse">
                        <div className="h-16 w-16 bg-black/20" />
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-800">
                            {stat.label}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
