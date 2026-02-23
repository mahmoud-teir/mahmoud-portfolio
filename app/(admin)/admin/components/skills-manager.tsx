'use client'

import React, { useState, useTransition } from 'react'
import { createSkill, updateSkill, deleteSkill } from '@/app/actions/skills'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { BrutalistToast, BrutalistConfirm } from './brutalist-ui'
import { AnimatePresence } from 'framer-motion'

interface Skill {
    id: string
    name: string
    category: string
    order: number
}

const CATEGORIES = ['Frontend', 'Backend', 'Tools', 'Design', 'DevOps', 'Other']

function SkillForm({
    skill,
    onClose,
    showToast,
}: {
    skill?: Skill
    onClose: () => void
    showToast: (msg: string, type: 'success' | 'error') => void
}) {
    const [isPending, startTransition] = useTransition()
    const isEditing = !!skill

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            let result;
            if (isEditing) {
                result = await updateSkill(skill.id, formData)
            } else {
                result = await createSkill(formData)
            }

            if (result && !result.success) {
                showToast(`Error saving skill: ${JSON.stringify(result.error || 'Unknown error')}`, 'error')
            } else {
                showToast(isEditing ? 'SKILL_UPDATED' : 'SKILL_CREATED', 'success')
                onClose()
            }
        })
    }

    return (
        <div className="bg-white border-2 border-black brutal-shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display uppercase tracking-tighter">
                    {isEditing ? 'Edit_Skill' : 'New_Skill'}
                </h3>
                <button onClick={onClose} className="hover:text-brutal-pink transition-colors">
                    <X size={18} />
                </button>
            </div>

            <form action={handleSubmit} className="flex flex-wrap items-end gap-4">
                <div className="space-y-2 flex-1 min-w-[200px]">
                    <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Name</label>
                    <input
                        name="name"
                        defaultValue={skill?.name}
                        required
                        className="w-full bg-brutal-bg border-2 border-black p-3 font-mono text-sm focus:bg-neon outline-none transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Category</label>
                    <select
                        name="category"
                        defaultValue={skill?.category || 'Frontend'}
                        className="bg-brutal-bg border-2 border-black p-3 font-mono text-sm focus:bg-neon outline-none transition-colors"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Order</label>
                    <input
                        name="order"
                        type="number"
                        defaultValue={skill?.order || 0}
                        className="w-20 bg-brutal-bg border-2 border-black p-3 font-mono text-sm text-center"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-black text-white border-2 border-black px-6 py-3 font-mono text-xs uppercase tracking-wider brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                </button>
            </form>
        </div>
    )
}

export default function SkillsManager({ skills }: { skills: Skill[] }) {
    const [showForm, setShowForm] = useState(false)
    const [editingSkill, setEditingSkill] = useState<Skill | undefined>()
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
            const result = await deleteSkill(confirmDelete.id)
            if (result?.success === false) {
                showToast('FAILED_TO_DELETE_SKILL', 'error')
            } else {
                showToast('SKILL_DELETED', 'success')
            }
            setConfirmDelete(null)
        })
    }

    // Group skills by category
    const grouped = skills.reduce((acc, skill) => {
        const cat = skill.category
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(skill)
        return acc
    }, {} as Record<string, Skill[]>)

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-display uppercase tracking-tighter">Skills</h1>
                    <p className="font-mono text-xs uppercase tracking-widest opacity-50 mt-1">
                        {skills.length} total
                    </p>
                </div>
                <button
                    onClick={() => { setEditingSkill(undefined); setShowForm(true) }}
                    className="bg-neon text-black border-2 border-black px-4 py-2 font-mono text-xs uppercase tracking-wider brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
                >
                    <Plus size={16} /> New_Skill
                </button>
            </div>

            {showForm && (
                <SkillForm
                    skill={editingSkill}
                    onClose={() => { setShowForm(false); setEditingSkill(undefined) }}
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
                title="DELETE_SKILL?"
                message="Are you sure you want to permanently delete this skill from your tech stack?"
                onConfirm={performDelete}
                onCancel={() => setConfirmDelete(null)}
                confirmText="DELETE"
                cancelText="KEEP"
            />

            {Object.entries(grouped).map(([category, categorySkills]) => (
                <div key={category} className="mb-8">
                    <h2 className="bg-black text-white inline-block px-4 py-1 font-mono text-xs uppercase tracking-widest font-bold mb-4">
                        {category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {categorySkills.map((skill) => (
                            <div
                                key={skill.id}
                                className="bg-white border-2 border-black px-4 py-3 flex items-center justify-between hover:bg-brutal-bg transition-colors"
                            >
                                <span className="font-mono text-sm font-bold">{skill.name}</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => { setEditingSkill(skill); setShowForm(true) }}
                                        className="p-1.5 hover:bg-neon transition-colors border border-transparent hover:border-black"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(skill.id)}
                                        disabled={isPending}
                                        className="p-1.5 hover:bg-brutal-pink hover:text-white transition-colors border border-transparent hover:border-black"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {skills.length === 0 && (
                <div className="bg-white border-2 border-black border-dashed p-12 text-center">
                    <p className="font-mono text-sm uppercase opacity-50">No skills yet</p>
                </div>
            )}
        </div>
    )
}
