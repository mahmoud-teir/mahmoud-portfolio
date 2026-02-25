'use client'

import React, { useState, useTransition } from 'react'
import { createProject, updateProject, deleteProject } from '@/app/actions/projects'
import { Plus, Pencil, Trash2, X, Star, ExternalLink, Github, Image as ImageIcon } from 'lucide-react'
import { UploadButton } from '@/lib/uploadthing'
import Image from 'next/image'
import { BrutalistToast, BrutalistConfirm } from './brutalist-ui'
import { AnimatePresence } from 'framer-motion'

interface Project {
    id: string
    title: string
    description: string
    featured: boolean
    image: string | null
    liveUrl: string | null
    githubUrl: string | null
    tags: string[]
    order: number
}

function ProjectForm({
    project,
    onClose,
    showToast,
}: {
    project?: Project
    onClose: () => void
    showToast: (msg: string, type: 'success' | 'error') => void
}) {
    const [isPending, startTransition] = useTransition()
    const [imageUrl, setImageUrl] = useState(project?.image || '')
    const isEditing = !!project

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            try {
                if (isEditing) {
                    await updateProject(project.id, formData)
                    showToast('PROJECT_UPDATED', 'success')
                } else {
                    await createProject(formData)
                    showToast('PROJECT_CREATED', 'success')
                }
                onClose()
            } catch (e) {
                showToast('FAILED_TO_SAVE_PROJECT', 'error')
            }
        })
    }

    return (
        <div className="bg-white border-2 border-black brutal-shadow p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-display uppercase tracking-tighter">
                    {isEditing ? 'Edit_Project' : 'New_Project'}
                </h3>
                <button onClick={onClose} className="hover:text-brutal-pink transition-colors">
                    <X size={20} />
                </button>
            </div>

            <form action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Title</label>
                        <input
                            name="title"
                            defaultValue={project?.title}
                            required
                            className="w-full bg-brutal-bg border-2 border-black p-3 font-mono text-sm focus:bg-neon outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Tags (comma separated)</label>
                        <input
                            name="tags"
                            defaultValue={project?.tags.join(', ')}
                            className="w-full bg-brutal-bg border-2 border-black p-3 font-mono text-sm focus:bg-neon outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Description</label>
                    <textarea
                        name="description"
                        defaultValue={project?.description}
                        required
                        rows={3}
                        className="w-full bg-brutal-bg border-2 border-black p-3 font-mono text-sm focus:bg-neon outline-none transition-colors resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Live URL</label>
                        <input
                            name="liveUrl"
                            defaultValue={project?.liveUrl || ''}
                            className="w-full bg-brutal-bg border-2 border-black p-3 font-mono text-sm focus:bg-neon outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase font-bold tracking-widest">GitHub URL</label>
                        <input
                            name="githubUrl"
                            defaultValue={project?.githubUrl || ''}
                            className="w-full bg-brutal-bg border-2 border-black p-3 font-mono text-sm focus:bg-neon outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Image URL</label>
                        <input type="hidden" name="image" value={imageUrl} />
                        {imageUrl ? (
                            <div className="relative w-full h-24 border-2 border-black group overflow-hidden">
                                <Image src={imageUrl} alt="Project visual" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl('')}
                                        className="text-[#adff2f] font-mono text-xs uppercase font-bold border-2 border-[#adff2f] px-2 py-1"
                                    >
                                        Remove/Change
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <UploadButton
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    if (res && res[0]) {
                                        setImageUrl(res[0].url)
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    showToast(`UPLOAD_FAILED: ${error.message.toUpperCase()}`, 'error')
                                }}
                                className="ut-button:w-full ut-button:py-3 ut-button:bg-brutal-bg ut-button:text-black ut-button:border-2 ut-button:border-black ut-button:font-mono ut-button:text-xs ut-button:uppercase ut-button:shadow-none ut-button:hover:bg-neon ut-button:transition-colors ut-allowed-content:hidden"
                                content={{ button: "UPLOAD_IMAGE" }}
                            />
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 font-mono text-xs uppercase cursor-pointer">
                        <input
                            type="checkbox"
                            name="featured"
                            value="true"
                            defaultChecked={project?.featured}
                            className="w-5 h-5 border-2 border-black accent-neon"
                        />
                        Featured
                    </label>
                    <div className="flex items-center gap-2">
                        <label className="font-mono text-[10px] uppercase font-bold tracking-widest">Order</label>
                        <input
                            name="order"
                            type="number"
                            defaultValue={project?.order || 0}
                            className="w-20 bg-brutal-bg border-2 border-black p-2 font-mono text-sm text-center"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-black text-white border-2 border-black px-6 py-3 font-mono text-xs uppercase tracking-wider brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : isEditing ? 'Update_Project' : 'Create_Project'}
                </button>
            </form>
        </div>
    )
}

export default function ProjectsManager({ projects }: { projects: Project[] }) {
    const [showForm, setShowForm] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | undefined>()
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
                await deleteProject(confirmDelete.id)
                showToast('PROJECT_DELETED', 'success')
            } catch (e) {
                showToast('FAILED_TO_DELETE', 'error')
            }
            setConfirmDelete(null)
        })
    }

    return (
        <div className="mt-12 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-8">
                <div>
                    <h1 className="text-4xl font-display uppercase tracking-tighter">Projects</h1>
                    <p className="font-mono text-xs uppercase tracking-widest opacity-50 mt-1">
                        {projects.length} total
                    </p>
                </div>
                <button
                    onClick={() => { setEditingProject(undefined); setShowForm(true) }}
                    className="bg-neon text-black border-2 border-black px-4 py-2 font-mono text-xs uppercase tracking-wider brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
                >
                    <Plus size={16} /> New_Project
                </button>
            </div>

            {showForm && (
                <ProjectForm
                    project={editingProject}
                    onClose={() => { setShowForm(false); setEditingProject(undefined) }}
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
                title="DELETE_PROJECT?"
                message="Are you sure you want to permanently delete this project from your portfolio?"
                onConfirm={performDelete}
                onCancel={() => setConfirmDelete(null)}
                confirmText="DELETE"
                cancelText="KEEP"
            />

            <div className="space-y-4">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-white border-2 border-black p-4 md:p-6 flex flex-col md:flex-row items-start justify-between gap-4 hover:bg-brutal-bg transition-colors"
                    >
                        <div className="flex-1 min-w-0 w-full">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-display uppercase tracking-tighter truncate">
                                    {project.title}
                                </h3>
                                {project.featured && (
                                    <span className="bg-neon border-2 border-black px-2 py-0.5 font-mono text-[9px] uppercase font-bold flex items-center gap-1">
                                        <Star size={10} /> Featured
                                    </span>
                                )}
                            </div>
                            <p className="font-mono text-xs opacity-70 mb-3 line-clamp-2">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-black text-white px-2 py-0.5 text-[9px] font-mono uppercase font-bold"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {project.liveUrl && (
                                    <a href={project.liveUrl} target="_blank" className="text-brutal-cyan hover:underline">
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                                {project.githubUrl && (
                                    <a href={project.githubUrl} target="_blank" className="hover:underline">
                                        <Github size={14} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto w-full md:w-auto justify-end md:justify-start border-t-2 border-black md:border-none pt-4 md:pt-0 mt-2 md:mt-0">
                            <button
                                onClick={() => { setEditingProject(project); setShowForm(true) }}
                                className="border-2 border-black p-2 hover:bg-neon transition-colors"
                            >
                                <Pencil size={14} />
                            </button>
                            <button
                                onClick={() => handleDelete(project.id)}
                                disabled={isPending}
                                className="border-2 border-black p-2 hover:bg-brutal-pink hover:text-white transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="bg-white border-2 border-black border-dashed p-12 text-center">
                        <p className="font-mono text-sm uppercase opacity-50">No projects yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}
