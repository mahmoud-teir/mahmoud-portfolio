"use client"

import React, { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import { Terminal, Save, CheckCircle2, AlertTriangle, ArrowLeft, Zap, Star, Code, Cpu, Globe, Heart, Shield, Rocket, User, Briefcase, Settings, Eye, X, ShieldAlert } from 'lucide-react'
import { BrutalistToast } from '../components/brutalist-ui'
import { AnimatePresence } from 'framer-motion'

// Array of selectable icons for features
const AVAILABLE_ICONS = [
    { name: 'CheckCircle2', icon: CheckCircle2 },
    { name: 'Zap', icon: Zap },
    { name: 'Star', icon: Star },
    { name: 'Code', icon: Code },
    { name: 'Cpu', icon: Cpu },
    { name: 'Globe', icon: Globe },
    { name: 'Heart', icon: Heart },
    { name: 'Shield', icon: Shield },
    { name: 'Rocket', icon: Rocket },
    { name: 'User', icon: User },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Settings', icon: Settings },
    { name: 'Eye', icon: Eye }
]
import Link from 'next/link'
import { getSiteSettings, updateSiteSettings } from '@/app/actions/settings'

export default function AdminSettingsPage() {
    const [isSaving, setIsSaving] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setNotification({ msg, type })
    }

    const [formData, setFormData] = useState({
        heroTitle: '',
        heroSubtitle: '',
        marqueeText: '',
        contactText: '',
        githubUrl: '',
        linkedinUrl: '',
        twitterUrl: '',
        displayEmail: '',
        bioHeadline: '',
        bioEst: ''
    })

    const [aboutSkills, setAboutSkills] = useState<string[]>([])
    const [newSkill, setNewSkill] = useState('')
    const [newSkillIcon, setNewSkillIcon] = useState('CheckCircle2')

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await getSiteSettings()
            if (settings) {
                setFormData({
                    heroTitle: settings.heroTitle || '',
                    heroSubtitle: settings.heroSubtitle || '',
                    marqueeText: settings.marqueeText || '',
                    contactText: settings.contactText || '',
                    githubUrl: settings.githubUrl || '',
                    linkedinUrl: settings.linkedinUrl || '',
                    twitterUrl: settings.twitterUrl || '',
                    displayEmail: settings.displayEmail || '',
                    bioHeadline: settings.bioHeadline || '',
                    bioEst: settings.bioEst || ''
                })
                setAboutSkills(settings.aboutSkills || [])
            }
            setFetching(false)
        }
        loadSettings()
    }, [])

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            const formattedSkill = `${newSkillIcon}|${newSkill.trim()}`
            if (!aboutSkills.includes(formattedSkill)) {
                setAboutSkills([...aboutSkills, formattedSkill])
                setNewSkill('')
            }
        }
    }

    const handleRemoveSkill = (skillToRemove: string) => {
        setAboutSkills(aboutSkills.filter((s: string) => s !== skillToRemove))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        const result = await updateSiteSettings({
            ...formData,
            aboutSkills
        })

        if (result?.success) {
            showToast('SITE_CONFIGURATION_UPDATED', 'success')
        } else {
            showToast(result?.error || 'FAILED_TO_UPDATE_SETTINGS', 'error')
        }
        setIsSaving(false)
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    }

    if (fetching) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center font-mono">
                <div className="text-2xl font-black uppercase neo-shadow p-8 border-4 border-black animate-pulse">
                    LOADING_SYSTEM_SETTINGS...
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white text-black font-mono selection:bg-neon selection:text-black pb-24">
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
                    </nav>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12 mt-12 md:mt-0 inline-flex items-center gap-4 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                    <Link href="/admin/dashboard" className="p-2 border-2 border-black hover:bg-neon transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">SITE_SETTINGS</h1>
                </motion.div>

                <motion.form
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    onSubmit={handleSubmit}
                    className="space-y-12 bg-white border-4 border-black p-6 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                    {/* Section: Hero */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-extrabold uppercase border-b-4 border-black pb-2 flex items-center gap-2">
                            [01] // HERO_SECTION
                        </h2>

                        <div className="space-y-3">
                            <label className="text-xl font-black uppercase block">Hero Title (Use \n for line breaks)</label>
                            <textarea
                                value={formData.heroTitle}
                                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 md:px-6 md:py-4 border-4 border-black bg-white focus:bg-neon outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all font-bold placeholder:text-gray-400 font-mono resize-none text-sm md:text-base"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xl font-black uppercase block">Hero Subtitle</label>
                            <textarea
                                value={formData.heroSubtitle}
                                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 md:px-6 md:py-4 border-4 border-black bg-white focus:bg-neon outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all font-bold placeholder:text-gray-400 font-mono resize-none text-sm md:text-base"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xl font-black uppercase block">Marquee Top Banner</label>
                            <input
                                type="text"
                                value={formData.marqueeText}
                                onChange={(e) => setFormData({ ...formData, marqueeText: e.target.value })}
                                className="w-full px-4 py-3 md:px-6 md:py-4 border-4 border-black bg-white focus:bg-neon outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all font-bold placeholder:text-gray-400 font-mono text-sm md:text-base"
                            />
                        </div>
                    </div>

                    {/* Section: Bio Features */}
                    <div className="space-y-6 pt-8 border-t-4 border-black/10">
                        <h2 className="text-2xl font-extrabold uppercase border-b-4 border-black pb-2 flex items-center gap-2">
                            [02] // BIO_FEATURES
                        </h2>

                        <div className="space-y-3">
                            <label className="text-xl font-black uppercase block">Bio Headline / Greeting</label>
                            <input
                                type="text"
                                value={formData.bioHeadline}
                                onChange={(e) => setFormData({ ...formData, bioHeadline: e.target.value })}
                                className="w-full px-4 py-3 md:px-6 md:py-4 border-4 border-black bg-white focus:bg-neon outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all font-bold placeholder:text-gray-400 font-mono text-sm md:text-base"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xl font-black uppercase block">Established Date Label</label>
                            <input
                                type="text"
                                value={formData.bioEst}
                                onChange={(e) => setFormData({ ...formData, bioEst: e.target.value })}
                                className="w-full px-4 py-3 md:px-6 md:py-4 border-4 border-black bg-white focus:bg-neon outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all font-bold placeholder:text-gray-400 font-mono text-sm md:text-base"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xl font-black uppercase block">Add Feature Label (e.g. Fast Delivery)</label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <select
                                    value={newSkillIcon}
                                    onChange={(e) => setNewSkillIcon(e.target.value)}
                                    className="px-4 py-3 md:py-4 border-4 border-black bg-white focus:bg-neon outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold font-mono cursor-pointer"
                                >
                                    {AVAILABLE_ICONS.map(i => (
                                        <option key={i.name} value={i.name}>{i.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                                    className="flex-1 px-4 py-3 md:px-6 md:py-4 border-4 border-black bg-white focus:bg-neon outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all font-bold placeholder:text-gray-400 font-mono text-sm md:text-base"
                                    placeholder="Enter short feature name..."
                                />
                                <button type="button" onClick={handleAddSkill} className="py-3 px-8 bg-black text-white font-black uppercase border-4 border-black hover:bg-neon hover:text-black transition-colors">
                                    ADD
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-4">
                                {aboutSkills.map((skill: string) => {
                                    const parts = skill.split('|');
                                    const iconName = parts.length > 1 ? parts[0] : 'CheckCircle2';
                                    const text = parts.length > 1 ? parts[1] : skill;
                                    const IconComponent = AVAILABLE_ICONS.find(i => i.name === iconName)?.icon || CheckCircle2;

                                    return (
                                        <span key={skill} className="px-4 py-2 border-2 border-black font-bold uppercase flex items-center gap-2 bg-gray-50">
                                            <IconComponent className="w-4 h-4" /> {text}
                                            <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-red-500 hover:text-red-700 font-black px-1 ml-2">✕</button>
                                        </span>
                                    );
                                })}
                                {aboutSkills.length === 0 && <span className="text-gray-400 font-bold italic text-sm">No features added yet.</span>}
                            </div>
                        </div>
                    </div>

                    {/* Section: Contact & Footer */}
                    <div className="space-y-6 pt-8 border-t-4 border-black/10">
                        <h2 className="text-2xl font-extrabold uppercase border-b-4 border-black pb-2 flex items-center gap-2">
                            [03] // CONTACT_&_SOCIAL
                        </h2>

                        <div className="space-y-3">
                            <label className="text-xl font-black uppercase block">Contact Description Text</label>
                            <textarea
                                value={formData.contactText}
                                onChange={(e) => setFormData({ ...formData, contactText: e.target.value })}
                                rows={2}
                                className="w-full px-6 py-4 border-4 border-black bg-white focus:bg-neon outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all font-bold placeholder:text-gray-400 font-mono resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-lg font-black uppercase block">GitHub URL</label>
                                <input
                                    type="text"
                                    value={formData.githubUrl}
                                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                    className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neon outline-none font-bold placeholder:text-gray-400 font-mono"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-lg font-black uppercase block">LinkedIn URL</label>
                                <input
                                    type="text"
                                    value={formData.linkedinUrl}
                                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                    className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neon outline-none font-bold placeholder:text-gray-400 font-mono"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-lg font-black uppercase block">Twitter / X URL</label>
                                <input
                                    type="text"
                                    value={formData.twitterUrl}
                                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                                    className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neon outline-none font-bold placeholder:text-gray-400 font-mono"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-lg font-black uppercase block">Display Email</label>
                                <input
                                    type="text"
                                    value={formData.displayEmail}
                                    onChange={(e) => setFormData({ ...formData, displayEmail: e.target.value })}
                                    className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neon outline-none font-bold placeholder:text-gray-400 font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-8 border-t-4 border-black/10">
                        <button
                            type="submit"
                            className="flex items-center gap-4 bg-black text-white px-8 py-4 border-4 border-black font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-neon hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    SAVING...
                                </>
                            ) : (
                                <>
                                    SAVE_SITE_SETTINGS <Save className="w-8 h-8 font-bold" />
                                </>
                            )}
                        </button>
                    </div>
                </motion.form>
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
        </div>
    )
}
