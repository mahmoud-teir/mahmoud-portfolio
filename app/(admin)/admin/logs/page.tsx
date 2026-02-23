import React from 'react'
import {
    Terminal,
    ShieldAlert,
    Activity,
    AlertTriangle,
    CheckCircle2,
    ArrowLeft,
    Clock,
    Database,
    Zap,
    GitBranch,
    Lock
} from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/db'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

async function getLogs() {
    return await prisma.securityLog.findMany({
        orderBy: {
            timestamp: 'desc'
        },
        take: 50
    })
}

export default async function AdminLogsPage() {
    const logs = await getLogs()

    const getLevelStyles = (level: string) => {
        switch (level) {
            case 'DANGER':
                return 'bg-black text-[#ff4d4d] border-[#ff4d4d]'
            case 'WARNING':
                return 'bg-black text-[#ffcc00] border-[#ffcc00]'
            case 'SUCCESS':
            case 'INFO':
            default:
                return 'bg-black text-[#adff2f] border-[#adff2f]'
        }
    }

    const getIcon = (event: string, level: string) => {
        if (level === 'DANGER') return <Lock className="w-5 h-5" />
        if (event.includes('BUILD')) return <Zap className="w-5 h-5" />
        if (event.includes('GIT')) return <GitBranch className="w-5 h-5" />
        if (event.includes('DATABASE')) return <Database className="w-5 h-5" />
        return <Activity className="w-5 h-5" />
    }

    return (
        <div className="min-h-screen bg-white text-black font-mono selection:bg-neon selection:text-black pt-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="inline-block bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
                        <div className="flex flex-col gap-2 relative z-10">
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                                <Terminal className="w-12 h-12 md:w-16 md:h-16 stroke-[4]" />
                                //_SYSTEM_LOGS
                            </h1>
                            <div className="p-2 bg-black text-[#adff2f] inline-block self-start font-bold text-xs uppercase tracking-[0.2em]">
                                LIVE_FEED // {logs.length} ENTRIES
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logs Container */}
                <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                    <div className="border-b-4 border-black bg-black p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-4">
                            <Activity className="text-[#adff2f] animate-pulse" size={20} />
                            <span className="font-black uppercase tracking-widest text-sm">active_surveillance_protocol</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            <span>Status: Nominal</span>
                            <span>Buffer: 50_Entries</span>
                        </div>
                    </div>

                    <div className="divide-y-4 divide-black">
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <div key={log.id} className="group hover:bg-[#adff2f]/5 transition-colors p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                                    {/* Timestamp & Type */}
                                    <div className="md:w-64 shrink-0 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-tighter">
                                            <Clock size={14} />
                                            {format(new Date(log.timestamp), 'yyyy-MM-dd_HH:mm:ss')}
                                        </div>
                                        <div className={`inline-flex items-center gap-2 border-2 px-3 py-1 text-[10px] font-black uppercase w-fit ${getLevelStyles(log.level)}`}>
                                            {getIcon(log.event, log.level)}
                                            {log.event}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-black uppercase tracking-tight break-words">
                                            {log.details || "SYSTEM_EVENT_REGISTERED_WITHOUT_METADATA"}
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="shrink-0 flex items-center gap-3">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">NODE_SYNC</span>
                                            <div className="flex gap-1">
                                                {[...Array(4)].map((_, i) => (
                                                    <div key={i} className={`w-3 h-1 ${log.level === 'DANGER' ? 'bg-[#ff4d4d]' : 'bg-[#adff2f]'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <ShieldAlert className={log.level === 'DANGER' ? 'text-[#ff4d4d]' : 'text-[#adff2f]'} size={24} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest">
                                NO_LOGS_DETECTED_IN_SECTOR_7
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
