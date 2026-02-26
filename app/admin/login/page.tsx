'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { motion, Variants } from 'framer-motion'
import { ArrowRight, Key, User, Terminal, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [magicLinkSent, setMagicLinkSent] = useState(false)

    const handleMagicLink = async () => {
        if (!email) {
            setError('System Error: Identity Pointer Required')
            return
        }
        setError('')
        setLoading(true)

        try {
            const result = await (signIn as any).magicLink({ email, callbackURL: '/admin/dashboard' })
            if (result?.error) {
                setError(result.error.message || 'Access Denied: Protocol Failure')
            } else {
                setMagicLinkSent(true)
            }
        } catch {
            setError('System Error: Authentication Service Unavailable')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn.email({ email, password })
            if (result.error) {
                setError(result.error.message || 'Access Denied: Invalid Authentication Protocol')
            } else {
                router.push('/admin/dashboard')
                router.refresh()
            }
        } catch {
            setError('System Error: Authentication Service Unavailable')
        } finally {
            setLoading(false)
        }
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
                ease: [0.33, 1, 0.68, 1]
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-white text-black font-mono flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background: Radial Dot Grid */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Glitch Decorative Bars */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 0.8 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-20 left-10 w-[400px] h-3 bg-[#adff2f] -skew-x-[45deg] -z-10"
            />
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 0.8 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="absolute bottom-40 right-10 w-[300px] h-3 bg-black -skew-x-[45deg] -z-10"
            />

            {/* System Status Header */}
            <div className="absolute top-10 right-10 border-4 border-black p-4 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase font-extrabold text-xs hidden md:block">
                PROTOCOL_STATUS: AWAITING_AUTH
            </div>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-2xl relative"
            >
                <div className="bg-white border-4 border-black p-6 md:p-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-b-4 border-r-4 border-black" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-t-4 border-l-4 border-black" />

                    <motion.div variants={itemVariants} className="mb-12">
                        <div className="inline-block bg-black text-[#adff2f] px-4 py-1 font-extrabold text-sm mb-4 uppercase tracking-tighter">
                            Protocol_Initiated
                        </div>
                        <h1 className="text-4xl md:text-7xl font-extrabold uppercase leading-none mb-4" style={{ WebkitTextStroke: '2px black', color: 'transparent' }}>
                            SYSTEM_LOGIN
                        </h1>
                        <p className="text-lg font-bold uppercase tracking-tight border-l-8 border-black pl-4">
                            Enter credentials for dashboard access
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-red-50 border-4 border-red-600 text-red-600 px-6 py-4 mb-10 font-bold uppercase text-sm flex items-center gap-3"
                        >
                            <AlertCircle size={20} />
                            {error}
                        </motion.div>
                    )}

                    {magicLinkSent && (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#adff2f] border-4 border-black text-black px-6 py-4 mb-10 font-bold uppercase text-sm flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <Terminal size={20} />
                            MAGIC_LINK_DISPATCHED: Check your uplink (Inbox).
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <motion.div variants={itemVariants} className="relative">
                            <label className="absolute -top-3 left-6 bg-white px-2 text-xs font-extrabold uppercase border-2 border-black z-10">
                                Identity_Pointer
                            </label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User size={24} />
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ADMIN@NETWORK.SYS"
                                    required
                                    className="w-full h-16 md:h-20 pl-12 md:pl-16 pr-4 md:pr-8 border-4 border-black text-lg md:text-xl font-extrabold uppercase focus:bg-[#adff2f] outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="relative">
                            <label className="absolute -top-3 left-6 bg-white px-2 text-xs font-extrabold uppercase border-2 border-black z-10">
                                Security_Key
                            </label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Key size={24} />
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-16 md:h-20 pl-12 md:pl-16 pr-4 md:pr-8 border-4 border-black text-lg md:text-xl font-extrabold uppercase focus:bg-[#adff2f] outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </motion.div>

                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={loading || magicLinkSent}
                                className="w-full bg-[#adff2f] border-4 border-black py-4 md:py-6 px-6 md:px-12 text-lg md:text-xl font-extrabold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                            >
                                {loading && !magicLinkSent ? 'AUTHENTICATING...' : 'ESTABLISH_SESSION'}
                                {!loading && <ArrowRight size={20} className="stroke-[3]" />}
                            </button>

                            <button
                                type="button"
                                onClick={handleMagicLink}
                                disabled={loading || magicLinkSent}
                                className="w-full text-center border-4 border-black py-4 md:py-6 px-4 md:px-8 font-extrabold uppercase hover:bg-black hover:text-[#adff2f] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                MAGIC_LINK_AUTH
                            </button>

                            <div className="flex flex-col md:flex-row gap-4">
                                <Link
                                    href="/admin/recovery"
                                    className="w-full md:w-1/2 text-center border-4 border-black py-4 px-4 font-extrabold uppercase hover:bg-black hover:text-white transition-colors"
                                >
                                    RECOVERY_PROTOCOL
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => router.push('/')}
                                    className="w-full md:w-1/2 text-center border-4 border-black py-4 px-4 font-extrabold uppercase hover:bg-black hover:text-white transition-colors"
                                >
                                    TERMINATE
                                </button>
                            </div>
                        </div>
                    </form>

                    <motion.div variants={itemVariants} className="mt-16 pt-8 border-t-4 border-black flex flex-wrap gap-8 opacity-40">
                        <div className="text-[10px] font-bold uppercase">
                            <span className="block text-gray-500 mb-1">Status</span>
                            Awaiting_Input
                        </div>
                        <div className="text-[10px] font-bold uppercase">
                            <span className="block text-gray-500 mb-1">Channel</span>
                            Encrypted_HTTPS
                        </div>
                        <div className="text-[10px] font-bold uppercase">
                            <span className="block text-gray-500 mb-1">Integrity</span>
                            Verified_Node
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="mt-8 flex items-center justify-between font-extrabold text-[10px] uppercase tracking-widest px-2">
                    <div className="flex items-center gap-2">
                        <Terminal size={14} />
                        MAHMOUD.DEV_ADMIN_OS
                    </div>
                    <div>
                        BUILD_VERSION: 1.0.6
                    </div>
                </motion.div>
            </motion.main>

            {/* Viewport Frame */}
            <div className="fixed inset-0 pointer-events-none border-[24px] border-black opacity-5" />
        </div>
    )
}
