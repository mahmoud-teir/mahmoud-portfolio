'use client'

import React, { useState, useEffect } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { motion, Variants } from 'framer-motion'
import { Key, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function AdminResetPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }

        setLoading(true)

        try {
            const { error: authError } = await authClient.resetPassword({
                newPassword: password,
            })

            if (authError) {
                setError(authError.message || 'Failed to reset password. Token may be invalid or expired.')
            } else {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/admin/login')
                }, 3000)
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
            transition: { duration: 0.5, staggerChildren: 0.1, ease: "easeInOut" }
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

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-2xl relative"
            >
                <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                    <motion.div variants={itemVariants} className="mb-10">
                        <div className="inline-block bg-black text-[#adff2f] px-4 py-1 font-extrabold text-sm mb-4 uppercase tracking-tighter">
                            Secure_Uplink_Established
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold uppercase leading-none mb-4" style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>
                            NEW_SECURITY_KEY
                        </h1>
                        <p className="text-sm font-bold uppercase tracking-tight border-l-4 border-black pl-4">
                            ENTER YOUR NEW PASSWORD TO RESTORE ACCESS
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-red-50 border-4 border-red-600 text-red-600 px-6 py-4 mb-8 font-bold uppercase text-xs flex items-center gap-3"
                        >
                            <AlertCircle size={20} />
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#adff2f]/10 border-4 border-[#adff2f] text-black px-6 py-6 font-extrabold uppercase text-xs flex items-center gap-3 shadow-[8px_8px_0px_0px_rgba(173,255,47,0.2)]"
                        >
                            <CheckCircle2 size={24} className="text-black" />
                            PASSWORD RESET SUCCESSFUL. REDIRECTING TO LOGIN...
                        </motion.div>
                    )}

                    {!success && (
                        <form onSubmit={handleSubmit} className="space-y-8 text-left">
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="relative">
                                    <label className="absolute -top-3 left-6 bg-white px-2 text-[10px] font-extrabold uppercase border-2 border-black z-10">
                                        New_Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full py-4 px-6 border-4 border-black text-lg font-extrabold uppercase focus:bg-[#adff2f] outline-none transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="absolute -top-3 left-6 bg-white px-2 text-[10px] font-extrabold uppercase border-2 border-black z-10">
                                        Confirm_Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full py-4 px-6 border-4 border-black text-lg font-extrabold uppercase focus:bg-[#adff2f] outline-none transition-all"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#adff2f] border-4 border-black py-4 px-8 text-xl font-extrabold uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                                >
                                    {loading ? 'PROCESSING...' : 'CONFIRM_NEW_KEY'}
                                    {!loading && <Key size={20} className="stroke-[3]" />}
                                </button>
                            </motion.div>
                        </form>
                    )}
                </div>
            </motion.main>
        </div>
    )
}
