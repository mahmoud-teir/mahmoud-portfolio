'use client'

import React, { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { motion, Variants } from 'framer-motion'
import { ArrowRight, Key, Terminal, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminRecoveryPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setLoading(true)

        try {
            // @ts-ignore - better-auth proxy method to /api/auth/request-password-reset
            const { error: authError } = await authClient.requestPasswordReset({
                email,
                redirectTo: '/admin/reset-password',
            })

            if (authError) {
                console.error("Auth Error from forgetPassword:", authError);
                setError(authError.message || 'Recovery Protocol Failed: Identity Verification Error')
            } else {
                setSuccess(true)
            }
        } catch {
            setError('System Error: Recovery Service Unavailable')
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
                ease: "easeInOut"
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

            {/* ERROR_CODE / Header Info */}
            <div className="absolute top-10 right-10 border-4 border-black p-4 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase font-extrabold text-xs hidden md:block">
                ERROR_CODE: 0xRECOVERY
            </div>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-3xl relative"
            >
                <div className="bg-white border-4 border-black p-8 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-b-4 border-r-4 border-black" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-t-4 border-l-4 border-black" />

                    <motion.div variants={itemVariants} className="mb-12">
                        <div className="inline-block bg-black text-[#adff2f] px-4 py-1 font-extrabold text-sm mb-4 uppercase tracking-tighter">
                            Protocol_Initiated
                        </div>
                        <h1 className="text-5xl md:text-8xl font-extrabold uppercase leading-none mb-4" style={{ WebkitTextStroke: '2px black', color: 'transparent' }}>
                            SYSTEM_RECOVERY
                        </h1>
                        <p className="text-xl font-bold uppercase tracking-tight border-l-8 border-black pl-4">
                            ENTER_EMAIL_FOR_RESET_PROTOCOL
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

                    {success && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#adff2f]/10 border-4 border-[#adff2f] text-black px-6 py-8 mb-10 font-extrabold uppercase text-sm flex flex-col gap-4 shadow-[8px_8px_0px_0px_rgba(173,255,47,0.2)]"
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={24} className="text-black" />
                                <span>Recovery_Payload_Sent</span>
                            </div>
                            <p className="text-xs font-bold normal-case text-gray-700">
                                Check your terminal (inbox) for the reset uplink instructions. Proceed with caution.
                            </p>
                        </motion.div>
                    )}

                    {!success && (
                        <form onSubmit={handleSubmit} className="space-y-10 text-left">
                            <motion.div variants={itemVariants} className="relative">
                                <label className="absolute -top-3 left-6 bg-white px-2 text-xs font-extrabold uppercase border-2 border-black z-10">
                                    Identity_Pointer
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="USER@NETWORK.LOCAL"
                                    required
                                    className="w-full h-24 px-8 border-4 border-black text-2xl font-extrabold uppercase focus:bg-[#adff2f] outline-none transition-all placeholder:text-gray-300"
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-8">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto flex-grow bg-[#adff2f] border-4 border-black py-6 px-12 text-2xl font-extrabold uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                                >
                                    {loading ? 'PROCESSING...' : 'SEND_RESET_LINK'}
                                    {!loading && <Key size={24} className="stroke-[3]" />}
                                </button>
                                <Link
                                    href="/admin/login"
                                    className="w-full md:w-auto text-center border-4 border-black py-6 px-8 font-extrabold uppercase hover:bg-black hover:text-white transition-colors"
                                >
                                    BACK_TO_SAFETY
                                </Link>
                            </motion.div>
                        </form>
                    )}

                    <motion.div variants={itemVariants} className="mt-16 pt-8 border-t-4 border-black flex flex-wrap gap-8 opacity-40">
                        <div className="text-[10px] font-bold uppercase text-left">
                            <span className="block text-gray-500 mb-1">Status</span>
                            {success ? 'Payload_Delivered' : 'Awaiting_Input'}
                        </div>
                        <div className="text-[10px] font-bold uppercase text-left">
                            <span className="block text-gray-500 mb-1">Security</span>
                            Level_4_Encrypted
                        </div>
                        <div className="text-[10px] font-bold uppercase text-left">
                            <span className="block text-gray-500 mb-1">Uptime</span>
                            99.999%
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="mt-8 flex items-center justify-between font-extrabold text-[10px] uppercase tracking-widest px-2">
                    <div className="flex items-center gap-2">
                        <Terminal size={14} />
                        MAHMOUD.DEV_OS
                    </div>
                    <div>
                        V2.0.4_BUILD
                    </div>
                </motion.div>
            </motion.main>

            {/* Viewport Frame */}
            <div className="fixed inset-0 pointer-events-none border-[24px] border-black opacity-5" />
        </div>
    )
}
