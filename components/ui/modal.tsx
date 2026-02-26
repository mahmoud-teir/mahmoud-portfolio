'use client'

import { useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export function Modal({ children }: { children: React.ReactNode }) {
    const overlay = useRef<HTMLDivElement>(null)
    const wrapper = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const onDismiss = useCallback(() => {
        router.back()
    }, [router])

    const onClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === overlay.current || e.target === wrapper.current) {
                if (onDismiss) onDismiss()
            }
        },
        [onDismiss, overlay, wrapper]
    )

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onDismiss()
        },
        [onDismiss]
    )

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown)
        document.body.style.overflow = 'hidden' // Prevent bg scrolling

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [onKeyDown])

    return (
        <div
            ref={overlay}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={onClick}
        >
            <div
                ref={wrapper}
                className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-brutal-bg border-4 border-black brutal-shadow"
            >
                <button
                    onClick={onDismiss}
                    className="absolute top-4 right-4 z-[110] bg-black text-[#adff2f] p-2 hover:bg-white hover:text-black hover:scale-110 transition-all border-2 border-black"
                >
                    <X size={24} className="stroke-[3]" />
                </button>
                {children}
            </div>
        </div>
    )
}
