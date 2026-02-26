import React, { Suspense } from 'react'
import Link from 'next/link'
import { Plus, ExternalLink, Activity, Terminal } from 'lucide-react'
import DashboardStats from './components/dashboard-stats'
import { DashboardStatsSkeleton } from './components/dashboard-stats-skeleton'
import LiveFeedTerminal from './components/live-feed'

export default async function AdminDashboardPage() {

    return (
        <div className="space-y-12 max-w-6xl mx-auto font-mono">
            {/* Header Section */}
            <header className="relative pt-20 pb-8 md:py-12 px-6 md:px-8 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="absolute top-0 right-0 md:top-0 md:right-0 mt-4 md:mt-0 mr-16 md:mr-0 p-4 bg-black text-[#adff2f] font-black text-[10px] uppercase tracking-widest z-10 w-full sm:w-auto text-center sm:text-right hidden sm:block">
                    NODE_ID: ADMIN_OVERVIEW
                </div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-[#adff2f] px-3 py-1 border-2 border-black font-black text-xs uppercase mb-6">
                        <Activity size={14} className="stroke-[3]" />
                        System_Live
                    </div>
                    <h1 className="text-4xl md:text-8xl font-black uppercase leading-none tracking-tighter mb-4" style={{ WebkitTextStroke: '2px black', color: 'transparent' }}>
                        SYSTEM_OVERVIEW
                    </h1>
                    <p className="text-xl font-bold uppercase border-l-8 border-black pl-6 max-w-2xl text-gray-700">
                        Managing central portfolio repository and deployment parameters.
                    </p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#adff2f] opacity-5 -skew-x-12 translate-x-1/2 translate-y-1/2" />
            </header>

            {/* Stats Grid */}
            <Suspense fallback={<DashboardStatsSkeleton />}>
                <DashboardStats />
            </Suspense>

            {/* Live Feed Terminal */}
            <section className="mb-12">
                <LiveFeedTerminal />
            </section>

            {/* Quick Actions */}
            <section className="bg-white border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(173,255,47,0.5)] md:shadow-[12px_12px_0px_0px_rgba(173,255,47,0.5)]">
                <div className="flex items-center gap-3 mb-8">
                    <Terminal size={24} className="stroke-[3]" />
                    <h2 className="text-2xl font-black uppercase tracking-tighter">
                        Command_Shortcuts
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link
                        href="/admin/projects"
                        className="flex items-center justify-center gap-3 bg-black text-white border-4 border-black py-5 px-6 font-black uppercase text-xs tracking-widest hover:bg-[#adff2f] hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none"
                    >
                        <Plus size={16} className="stroke-[3]" />
                        Deploy_Project
                    </Link>
                    <Link
                        href="/admin/skills"
                        className="flex items-center justify-center gap-3 bg-white border-4 border-black py-5 px-6 font-black uppercase text-xs tracking-widest hover:bg-[#adff2f] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none"
                    >
                        <Plus size={16} className="stroke-[3]" />
                        Node_Injection
                    </Link>
                    <Link
                        href="/admin/experience"
                        className="flex items-center justify-center gap-3 bg-white border-4 border-black py-5 px-6 font-black uppercase text-xs tracking-widest hover:bg-[#adff2f] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none"
                    >
                        <Plus size={16} className="stroke-[3]" />
                        History_Add
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center justify-center gap-3 border-4 border-black/10 py-5 px-6 font-black uppercase text-xs tracking-widest hover:border-black hover:bg-black hover:text-white transition-all"
                    >
                        <ExternalLink size={16} className="stroke-[3]" />
                        Live_Feed
                    </Link>
                </div>
            </section>
        </div>
    )
}
