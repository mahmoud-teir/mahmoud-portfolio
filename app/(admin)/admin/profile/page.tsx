"use client"

import React, { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import {
    Terminal,
    UploadCloud,
    Save,
    AlertTriangle,
    CheckCircle2,
    ArrowLeft,
    ShieldAlert,
    History,
    Activity,
    FileText
} from 'lucide-react'
import { BrutalistToast, BrutalistConfirm } from '../components/brutalist-ui'
import { AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { authClient } from '@/lib/auth-client'
import { UploadButton, UploadDropzone, useUploadThing } from '@/lib/uploadthing'
import { useRouter } from 'next/navigation'
import { updateAdminProfile, getProfileStats } from '@/app/actions/profile'

export default function AdminProfilePage() {
    const router = useRouter()
    const { data: session } = authClient.useSession()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const cvFileInputRef = React.useRef<HTMLInputElement>(null)
    const [stats, setStats] = useState<{ memberSince: string | null, projectsLive: number }>({ memberSince: null, projectsLive: 0 })
    const [cvUploadProgress, setCvUploadProgress] = useState(0)
    const [pendingCvFileName, setPendingCvFileName] = useState<string | null>(null)
    const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' | 'info' } | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
        setNotification({ msg, type })
    }

    const { startUpload, isUploading } = useUploadThing("imageUploader", {
        onClientUploadComplete: async (res) => {
            if (res && res[0]) {
                await authClient.updateUser({ image: res[0].url })
                showToast('AVATAR_UPLOADED_SUCCESSFULLY', 'success')
                setTimeout(() => window.location.reload(), 1500)
            }
        },
        onUploadError: (error: Error) => {
            showToast(`ERROR: ${error.message.toUpperCase()}`, 'error')
        },
    })

    const { startUpload: startCvUpload, isUploading: isUploadingCV } = useUploadThing("cvUploader", {
        onUploadProgress: (progress) => {
            setCvUploadProgress(progress)
        },
        onClientUploadComplete: async (res) => {
            setCvUploadProgress(0)
            if (res && res[0]) {
                const originalName = pendingCvFileName || res[0].name
                await authClient.updateUser({ cvUrl: res[0].url, cvName: originalName } as any)
                setPendingCvFileName(null)
                showToast('RESUME_UPLOADED_SUCCESSFULLY!', 'success')
                setTimeout(() => window.location.reload(), 1500)
            }
        },
        onUploadError: (error: Error) => {
            setCvUploadProgress(0)
            showToast(`UPLOAD_ERROR: ${error.message.toUpperCase()}`, 'error')
        },
    })

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: 'SOFTWARE_ENGINEER_SPECIALIZING_IN_BRUTALIST_WEB_ARCHITECTURE_AND_SYSTEM_OPTIMIZATION.',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    React.useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                username: session.user.name || '',
                email: session.user.email || '',
                bio: (session.user as any)?.bio || 'SOFTWARE_ENGINEER_SPECIALIZING_IN_BRUTALIST_WEB_ARCHITECTURE_AND_SYSTEM_OPTIMIZATION.'
            }))
        }
    }, [session?.user])

    React.useEffect(() => {
        getProfileStats().then(setStats)
    }, [])

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    }

    const cardVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Validate password if user attempts to change it
            if (formData.newPassword || formData.currentPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    showToast("PASSWORDS_DO_NOT_MATCH", 'error')
                    setLoading(false)
                    return
                }
                if (!formData.currentPassword || !formData.newPassword) {
                    showToast("PROVIDE_BOTH_PASSWORDS_TO_CHANGE", 'error')
                    setLoading(false)
                    return
                }

                const { error } = await authClient.changePassword({
                    newPassword: formData.newPassword,
                    currentPassword: formData.currentPassword,
                    revokeOtherSessions: true
                })

                if (error) {
                    showToast(`CHANGE_PASSWORD_FAILED: ${(error.message || 'UNKNOWN ERROR').toUpperCase()}`, 'error')
                    setLoading(false)
                    return
                }
            }

            const result = await updateAdminProfile({
                name: formData.username,
                email: formData.email,
                bio: formData.bio
            })

            if (result.success) {
                showToast('DATA_REGISTRY_UPDATED_SUCCESSFULLY', 'success')
                // Clear password fields on success
                setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
            } else {
                showToast('PROFILE_UPDATE_FAILED', 'error')
            }
        } catch (error: any) {
            showToast(`SYSTEM_ERROR: ${error.message?.toUpperCase() || 'UNKNOWN'}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white text-black font-mono selection:bg-neon selection:text-black">
            {/* Grid Pattern Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20"
                style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b-4 border-black">
                <div className="max-w-[1440px] mx-auto px-6 h-24 flex items-center justify-between">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center gap-0 border-4 border-black bg-[#adff2f] px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <Terminal className="w-6 h-6 mr-2 font-bold" />
                        <h2 className="text-2xl font-black tracking-tighter uppercase">Mahmoud.Dev</h2>
                    </motion.div>

                    <nav className="hidden md:flex items-center gap-4">
                        <Link href="/admin/dashboard"
                            className="bg-black text-white px-6 py-2 border-4 border-black font-bold uppercase text-sm hover:text-[#adff2f] transition-colors">
                            BACK_TO_DASHBOARD
                        </Link>
                        <Link href="/admin/logs"
                            className="bg-black text-white px-6 py-2 border-4 border-black font-bold uppercase text-sm hover:text-[#adff2f] transition-colors">
                            SECURITY_LOGS
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8 mt-12 md:mt-0 md:mb-12 inline-block bg-white border-4 border-black p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                    <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic">ACCOUNT_SETTINGS</h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Sidebar: Image & Stats */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-4 space-y-6 md:space-y-8"
                    >
                        {/* Profile Image Card */}
                        <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-xl md:text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2">PROFILE_IMAGE</h2>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square w-full border-4 border-black bg-black overflow-hidden mb-6 relative group cursor-pointer"
                            >
                                <Image
                                    src={session?.user?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCN0-WWY0WN4jlxRmaYJFQukBBdesaswAi6-nMql4-nV6KYveZUcP5F0Qehj55N1UcBqOgD_IuCVTNA_-SR4-yqcIeSKpPmRyfLTyGPjCLI5_LDeJ-gpkJWanDenTrmthRgql1keV8sVUvB4Lq7xhMb16Bx96czZc2VJZ1oDmFcInO58suY3vsDGMZgcNtyNdjfdWZiHAfNki3bAfCVScOZwYt3P_wVI3Ji1KrxKlpf-1DUlx4uIZEwLKa3j8ZWnghG8cKNgjJK4Mlu"}
                                    alt="Admin Profile"
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="text-[#adff2f] font-black uppercase text-center text-sm p-4 bg-black/80 border-2 border-[#adff2f] flex flex-col items-center gap-2">
                                        <UploadCloud className="w-6 h-6" />
                                        {isUploading ? 'UPLOADING...' : 'EDIT_ENTITY_AVATAR'}
                                    </div>
                                </div>
                            </div>

                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) startUpload([file]);
                                }}
                                accept="image/*"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-full py-4 bg-[#adff2f] text-black border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <UploadCloud className="w-5 h-5" />
                                {isUploading ? 'UPLOADING...' : 'CHANGE_AVATAR'}
                            </button>
                            <p className="mt-4 text-xs font-bold uppercase text-gray-500">FORMATS: JPG, PNG, GIF. MAX: 4MB</p>
                        </div>

                        {/* Quick Stats Card */}
                        <div className="bg-black text-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm overflow-hidden">
                            <h3 className="font-black uppercase mb-4 text-[#adff2f] flex items-center gap-2 text-base">
                                <Activity className="w-5 h-5" />
                                Quick_Stats
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between border-b border-white/20 pb-2">
                                    <span className="font-bold uppercase flex items-center gap-2"><History className="w-4 h-4" /> MEMBER_SINCE</span>
                                    <span className="font-mono">{stats.memberSince ? new Date(stats.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase().replace(' ', '_') : '—'}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/20 pb-2">
                                    <span className="font-bold uppercase flex items-center gap-2">PROJECTS_LIVE</span>
                                    <span className="font-mono text-[#adff2f]">{stats.projectsLive}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="font-bold uppercase flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> STATUS</span>
                                    <span className="font-mono text-[#adff2f] px-1 bg-white/10 border border-[#adff2f]/30">VERIFIED_DEV</span>
                                </div>
                            </div>
                        </div>

                        {/* CV Upload Card */}
                        <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-xl md:text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2 text-black">CV_DOCUMENT</h2>
                            <div className="flex items-center gap-3 mb-6 p-4 border-4 border-black bg-gray-50 overflow-hidden">
                                <FileText className="w-8 h-8 opacity-50" />
                                <div>
                                    <p className="font-bold uppercase text-sm">{(session?.user as any)?.cvUrl ? 'CV_DOCUMENT_FOUND' : 'NO_DOCUMENT_FOUND'}</p>
                                    <p className="font-mono text-xs opacity-50 truncate max-w-[180px]">{(session?.user as any)?.cvName || ((session?.user as any)?.cvUrl ? 'Document is ready.' : 'PLEASE UPLOAD A DOCUMENT')}</p>
                                </div>
                            </div>
                            {(session?.user as any)?.cvUrl && (
                                <a
                                    href={`/api/download-cv?url=${encodeURIComponent((session?.user as any).cvUrl)}&name=${encodeURIComponent((session?.user as any)?.cvName || 'resume.pdf')}`}
                                    className="w-full mb-4 py-3 bg-neon border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 block text-center"
                                >
                                    DOWNLOAD_CURRENT_RESUME
                                </a>
                            )}

                            {/* Progress Bar */}
                            {isUploadingCV && (
                                <div className="mb-4">
                                    <div className="w-full h-4 border-4 border-black bg-gray-100">
                                        <div
                                            className="h-full bg-neon transition-all duration-300"
                                            style={{ width: `${cvUploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="font-mono text-xs font-bold uppercase mt-2 text-center">
                                        UPLOADING... {cvUploadProgress}%
                                    </p>
                                </div>
                            )}

                            <input
                                type="file"
                                className="hidden"
                                ref={cvFileInputRef}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setPendingCvFileName(file.name)
                                        startCvUpload([file]);
                                    }
                                }}
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            />

                            <button
                                type="button"
                                onClick={() => cvFileInputRef.current?.click()}
                                disabled={isUploadingCV}
                                className="w-full py-4 bg-black text-white border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-neon hover:text-black hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <UploadCloud className="w-5 h-5" />
                                {isUploadingCV ? 'UPLOADING...' : 'UPLOAD_CV_DOCUMENT'}
                            </button>
                            <p className="mt-4 text-xs font-bold uppercase text-gray-500">FORMATS: PDF, DOC, DOCX</p>
                        </div>
                    </motion.div>

                    {/* Main Form: Account Details */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-8"
                    >
                        <div className="bg-white border-4 border-black p-6 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-xl font-black uppercase block">USERNAME</label>
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full px-4 py-3 md:px-6 md:py-4 border-4 border-black bg-white focus:bg-[#adff2f] outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all font-bold placeholder:text-gray-400 font-mono text-sm md:text-base"
                                            placeholder="ENTER_USERNAME"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xl font-black uppercase block">EMAIL_ADDRESS</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 md:px-6 md:py-4 border-4 border-black bg-white focus:bg-[#adff2f] outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all font-bold placeholder:text-gray-400 font-mono text-sm md:text-base"
                                            placeholder="EMAIL@DOMAIN.COM"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-xl font-black uppercase block">CURRENT_PASSWORD</label>
                                        <input
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                            className="w-full px-4 py-3 md:px-6 md:py-4 border-4 border-black bg-white focus:bg-[#adff2f] outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all font-bold placeholder:text-gray-400 font-mono text-sm md:text-base"
                                            placeholder="••••••••••••"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xl font-black uppercase block">NEW_PASSWORD</label>
                                        <input
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            className="w-full px-4 py-3 md:px-6 md:py-4 border-4 border-black bg-white focus:bg-[#adff2f] outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all font-bold placeholder:text-gray-400 font-mono text-sm md:text-base"
                                            placeholder="••••••••••••"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xl font-black uppercase block">CONFIRM_PASSWORD</label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-3 md:px-6 md:py-4 border-4 border-black bg-white focus:bg-[#adff2f] outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all font-bold placeholder:text-gray-400 font-mono text-sm md:text-base"
                                            placeholder="••••••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xl font-black uppercase block">BIO_DESCRIPTION</label>
                                    <textarea
                                        rows={4}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full px-4 py-3 md:px-6 md:py-4 border-4 border-black bg-white focus:bg-[#adff2f] outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all font-bold placeholder:text-gray-400 font-mono resize-none text-sm md:text-base"
                                        placeholder="TELL_US_ABOUT_YOU..."
                                    />
                                </div>

                                <div className="pt-6">
                                    <button
                                        disabled={loading}
                                        className={`w-full py-4 md:py-6 bg-[#adff2f] border-4 border-black text-black font-black text-xl md:text-2xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:shadow-none transition-all flex items-center justify-center gap-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? 'SYNCHRONIZING...' : (
                                            <>
                                                UPDATE_PROFILE <Save className="w-8 h-8 font-bold" />
                                            </>
                                        )}
                                    </button>

                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 p-4 bg-black text-[#adff2f] border-4 border-[#adff2f] flex items-center justify-center gap-3 font-black uppercase"
                                        >
                                            <CheckCircle2 className="w-6 h-6" /> Data_Registry_Updated_Successfully
                                        </motion.div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Danger Zone */}
                        <div className="mt-8 md:mt-12">
                            <div
                                onClick={() => setShowDeleteConfirm(true)}
                                className="bg-black text-white p-6 md:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center justify-between mb-2 md:mb-4">
                                    <h3 className="text-2xl font-black uppercase italic text-red-500 group-hover:text-white transition-colors">DANGER_ZONE</h3>
                                    <AlertTriangle className="w-10 h-10 text-red-500 group-hover:text-white group-hover:animate-pulse transition-colors" />
                                </div>
                                <p className="font-bold uppercase text-sm mb-6 max-w-md">Permanently delete your account and all associated data logs. This action is IRREVERSIBLE.</p>
                                <button className="px-8 py-3 bg-red-600 border-4 border-black font-black uppercase hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    DELETE_ACCOUNT
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <AnimatePresence>
                {notification && (
                    <BrutalistToast
                        msg={notification.msg}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>

            <BrutalistConfirm
                isOpen={showDeleteConfirm}
                title="DELETE_ACCOUNT?"
                message="Are you sure you want to permanently wipe your profile and all system logs? This action cannot be undone."
                onConfirm={() => showToast('ACCOUNT_DELETION_NOT_IMPLEMENTED_YET', 'info')}
                onCancel={() => setShowDeleteConfirm(false)}
                confirmText="DELETE_EVERYTHING"
                cancelText="CANCEL"
            />

            <footer className="mt-24 py-16 border-t-4 border-black bg-black text-white">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-3 border-4 border-white p-3 bg-[#adff2f] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Terminal className="w-6 h-6 font-bold" />
                        <span className="text-xl font-black uppercase">Mahmoud.Dev</span>
                    </div>
                    <p className="text-sm font-bold uppercase text-center md:text-left">
                        © {new Date().getFullYear()} Mahmoud. <br /> SYSTEM_STATUS: OPERATIONAL
                    </p>
                </div>
            </footer>
        </div>
    )
}
