'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ShieldAlert, X, AlertTriangle } from 'lucide-react'

// --- TOAST SYSTEM ---

export interface ToastProps {
    msg: string
    type: 'success' | 'error' | 'info'
    onClose: () => void
}

export function BrutalistToast({ msg, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <motion.div
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: 24, x: '-50%', opacity: 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            className={`fixed top-0 left-1/2 z-[200] min-w-[320px] p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 font-black uppercase tracking-tighter sm:text-xl ${type === 'success' ? 'bg-[#adff2f] text-black' :
                    type === 'error' ? 'bg-[#ff4d4d] text-white' : 'bg-black text-white'
                }`}
        >
            {type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
            <span className="flex-1">{msg}</span>
            <button onClick={onClose} className="hover:scale-110 transition-transform">
                <X className="w-6 h-6" />
            </button>
            <div
                className="absolute bottom-0 left-0 h-2 bg-black/20"
                style={{
                    animation: 'brutalist-progress 4s linear forwards',
                    width: '100%'
                }}
            />
            <style jsx>{`
                @keyframes brutalist-progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </motion.div>
    )
}

// --- CONFIRMATION DIALOG ---

export interface ConfirmProps {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'info'
}

export function BrutalistConfirm({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'CONFIRM',
    cancelText = 'CANCEL',
    type = 'danger'
}: ConfirmProps) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white border-8 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md w-full"
                >
                    <div className="flex items-center gap-4 mb-6 border-b-4 border-black pb-4">
                        <AlertTriangle className={`w-12 h-12 ${type === 'danger' ? 'text-red-600' : 'text-blue-600'}`} />
                        <h2 className="text-3xl font-black uppercase tracking-tighter">{title}</h2>
                    </div>

                    <p className="font-bold uppercase text-lg mb-8 leading-tight">
                        {message}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={onCancel}
                            className="py-4 border-4 border-black font-black uppercase hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm()
                                onCancel()
                            }}
                            className={`py-4 border-4 border-black font-black uppercase text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-colors ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-800'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
