'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Settings,
    LayoutDashboard,
    FolderKanban,
    BrainCircuit,
    Briefcase,
    LogOut,
    User,
    ChevronRight,
    Terminal,
    Menu,
    X,
    ShieldAlert
} from 'lucide-react'
import { signOut } from '@/lib/auth-client'
import { motion, AnimatePresence } from 'framer-motion'
import { Link2 } from 'lucide-react'

const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Site Settings', href: '/admin/settings', icon: Link2 },
    { label: 'Profile', href: '/admin/profile', icon: Settings },
    { label: 'Security Logs', href: '/admin/logs', icon: ShieldAlert },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Skills', href: '/admin/skills', icon: BrainCircuit },
    { label: 'Experience', href: '/admin/experience', icon: Briefcase },
]

export default function AdminSidebar({ user }: { user: any }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = React.useState(false)

    const handleSignOut = async () => {
        await signOut()
        window.location.href = '/admin/login'
    }

    const toggleSidebar = () => setIsOpen(!isOpen)

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-6 right-6 z-[100] bg-[#adff2f] border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`
                w-64 bg-black text-white h-screen fixed left-0 top-0 flex flex-col border-r-4 border-black z-[60] overflow-hidden font-mono text-left transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Header / Brand */}
                <div className="p-8 border-b-4 border-white/10 relative overflow-hidden group">
                    <div className="flex items-center gap-3 relative z-10 font-black">
                        <div className="bg-[#adff2f] text-black p-1">
                            <Terminal size={20} className="stroke-[3]" />
                        </div>
                        <span className="text-xl tracking-tighter uppercase font-black">MAHMOUD.DEV</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-6 space-y-2 pt-10 overflow-y-auto">
                    <div className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] px-2 mb-4">
                        System_Modules
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`
                                    group flex items-center justify-between px-4 py-4 font-extrabold uppercase text-xs tracking-wider transition-all relative border-2 border-transparent
                                    ${isActive
                                        ? 'bg-[#adff2f] text-black border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]'
                                        : 'hover:bg-white/5 text-gray-400 hover:text-white hover:border-white/10'}
                                `}
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <item.icon size={18} className={isActive ? 'stroke-[3]' : 'stroke-[2]'} />
                                    <span>{item.label}</span>
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="active"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        className="text-black"
                                    >
                                        <ChevronRight size={14} className="stroke-[3]" />
                                    </motion.div>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* User card and Footer */}
                <div className="p-6 border-t-4 border-white/10 bg-[#0a0a0a]">
                    <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#adff2f] mb-6 relative overflow-hidden">
                        <div className="flex items-center gap-3 relative z-10 text-black">
                            <div className="w-10 h-10 bg-black text-[#adff2f] border-2 border-black flex items-center justify-center shrink-0">
                                <User size={20} className="stroke-[2.5]" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="font-sans text-[11px] font-black uppercase truncate tracking-tight">
                                    {user?.name?.split(' ')[0] || 'ADMIN'}
                                </p>
                                <p className="font-mono text-[9px] font-bold text-gray-500 uppercase truncate">
                                    Admin_Level_1
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 px-4 py-4 font-black text-[10px] uppercase tracking-widest border-2 border-[#adff2f] text-[#adff2f] hover:bg-[#adff2f] hover:text-black transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(173,255,47,0.1)] hover:shadow-none translate-y-0 active:translate-y-1"
                    >
                        <LogOut size={14} className="stroke-[3]" />
                        TERMINATE_SESSION
                    </button>

                    <div className="mt-4 text-[8px] font-bold text-gray-600 uppercase text-center tracking-widest">
                        Build: 1.0.6 // OS: PORTFOLIO_CMD
                    </div>
                </div>
            </aside>
        </>
    )
}
