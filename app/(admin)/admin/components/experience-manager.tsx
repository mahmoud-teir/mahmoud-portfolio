'use client'

import React, { useState, useTransition } from 'react'
import { createExperience, updateExperience, deleteExperience } from '@/app/actions/experience'
import { Plus, Pencil, Trash2, X, Calendar } from 'lucide-react'
import { BrutalistToast, BrutalistConfirm } from './brutalist-ui'
import { AnimatePresence } from 'framer-motion'

interface Experience {
    id: string
    company: string
    role: string
    startDate: Date
    endDate: Date | null
    current: boolean
    description: string | null
    order: number
}

function ExperienceForm({
    experience,
    onClose,
    showToast,
}: {
    experience?: Experience
    onClose: () => void
    showToast: (msg: string, type: 'success' | 'error') => void
}) {
    const [isPending, startTransition] = useTransition()
    const [isCurrent, setIsCurrent] = useState(experience?.current ?? false)
    const isEditing = !!experience

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return ''
        return new Date(date).toISOString().split('T')[0]
    }

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            try {
                if (isEditing) {
                    await updateExperience(experience.id, formData)
                    showToast('EXPERIENCE_UPDATED', 'success')
                } else {
                    await createExperience(formData)
                    showToast('EXPERIENCE_CREATED', 'success')
                }
                onClose()
            } catch (e) {
                showToast('FAILED_TO_SAVE_EXPERIENCE', 'error')
            }
        })
    }

    return (
        <div className="bg-white border-2 border-black brutal-shadow p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display uppercase tracking-tighter">
                    {isEditing ? 'Edit_Experience' : 'New_Experience'}
                </h3>
                <button onClick={onClose} className="hover:text-brutal-pink transition-colors">
                    <X size={20} />
                </button>
            </div>

            <form action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Company</label>
                        <input
                            name="company"
                            defaultValue={experience?.company}
                            required
                            className="w-full bg-brutal-bg border-2 border-black p-3 font-mono text-sm focus:bg-neon outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Role</label>
                        <input
                            name="role"
                            defaultValue={experience?.role}
                            required
                            className="w-full bg-brutal-bg border-2 border-black p-3 font-mono text-sm focus:bg-neon outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Start Date</label>
                        <input
                            name="startDate"
                            type="date"
                            defaultValue={formatDate(experience?.startDate)}
                            required
                            className="w-full bg-brutal-bg border-2 border-black p-3 font-mono text-sm focus:bg-neon outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase font-bold tracking-widest">End Date</label>
                        <input
                            name="endDate"
                            type="date"
                            defaultValue={formatDate(experience?.endDate)}
                            disabled={isCurrent}
                            className="w-full bg-brutal-bg border-2 border-black p-3 font-mono text-sm focus:bg-neon outline-none transition-colors disabled:opacity-30"
                        />
                    </div>
                    <div className="flex items-end pb-1">
                        <label className="flex items-center gap-2 font-mono text-xs uppercase cursor-pointer">
                            <input
                                type="checkbox"
                                name="current"
                                value="true"
                                checked={isCurrent}
                                onChange={(e) => setIsCurrent(e.target.checked)}
                                className="w-5 h-5 border-2 border-black accent-neon"
                            />
                            Current Position
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Description</label>
                    <textarea
                        name="description"
                        defaultValue={experience?.description || ''}
                        rows={3}
                        className="w-full bg-brutal-bg border-2 border-black p-3 font-mono text-sm focus:bg-neon outline-none transition-colors resize-none"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Order</label>
                        <input
                            name="order"
                            type="number"
                            defaultValue={experience?.order || 0}
                            className="w-20 bg-brutal-bg border-2 border-black p-2 font-mono text-sm text-center"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-black text-white border-2 border-black px-6 py-3 font-mono text-xs uppercase tracking-wider brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : isEditing ? 'Update_Experience' : 'Create_Experience'}
                </button>
            </form>
        </div>
    )
}

export default function ExperienceManager({ experiences }: { experiences: Experience[] }) {
    const [showForm, setShowForm] = useState(false)
    const [editingExp, setEditingExp] = useState<Experience | undefined>()
    const [isPending, startTransition] = useTransition()
    const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<{ id: string } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setNotification({ msg, type })
    }

    const handleDelete = (id: string) => {
        setConfirmDelete({ id })
    }

    const performDelete = () => {
        if (!confirmDelete) return
        startTransition(async () => {
            try {
                await deleteExperience(confirmDelete.id)
                showToast('EXPERIENCE_DELETED', 'success')
            } catch (e) {
                showToast('FAILED_TO_DELETE', 'error')
            }
            setConfirmDelete(null)
        })
    }

    const formatDateShort = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-display uppercase tracking-tighter">Experience</h1>
                    <p className="font-mono text-xs uppercase tracking-widest opacity-50 mt-1">
                        {experiences.length} total
                    </p>
                </div>
                <button
                    onClick={() => { setEditingExp(undefined); setShowForm(true) }}
                    className="bg-neon text-black border-2 border-black px-4 py-2 font-mono text-xs uppercase tracking-wider brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
                >
                    <Plus size={16} /> New_Experience
                </button>
            </div>

            {showForm && (
                <ExperienceForm
                    experience={editingExp}
                    onClose={() => { setShowForm(false); setEditingExp(undefined) }}
                    showToast={showToast}
                />
            )}

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
                isOpen={!!confirmDelete}
                title="DELETE_EXPERIENCE?"
                message="Are you sure you want to permanently remove this entry from your career history?"
                onConfirm={performDelete}
                onCancel={() => setConfirmDelete(null)}
                confirmText="DELETE"
                cancelText="KEEP"
            />

            <div className="space-y-4">
                {experiences.map((exp) => (
                    <div
                        key={exp.id}
                        className="bg-white border-2 border-black p-6 hover:bg-brutal-bg transition-colors"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-display uppercase tracking-tighter">
                                        {exp.role}
                                    </h3>
                                    {exp.current && (
                                        <span className="bg-neon border-2 border-black px-2 py-0.5 font-mono text-[9px] uppercase font-bold">
                                            Current
                                        </span>
                                    )}
                                </div>
                                <p className="font-mono text-sm font-bold mb-2">{exp.company}</p>
                                <div className="flex items-center gap-1 font-mono text-[10px] uppercase opacity-50 mb-2">
                                    <Calendar size={12} />
                                    {formatDateShort(exp.startDate)} — {exp.current ? 'Present' : exp.endDate ? formatDateShort(exp.endDate) : 'N/A'}
                                </div>
                                {exp.description && (
                                    <p className="font-mono text-xs opacity-70 line-clamp-2">
                                        {exp.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => { setEditingExp(exp); setShowForm(true) }}
                                    className="border-2 border-black p-2 hover:bg-neon transition-colors"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(exp.id)}
                                    disabled={isPending}
                                    className="border-2 border-black p-2 hover:bg-brutal-pink hover:text-white transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {experiences.length === 0 && (
                    <div className="bg-white border-2 border-black border-dashed p-12 text-center">
                        <p className="font-mono text-sm uppercase opacity-50">No experience entries yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}
