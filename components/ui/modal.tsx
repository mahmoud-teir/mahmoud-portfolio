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
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [onKeyDown])

    return (
        <div
            ref={overlay}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={onClick}
        >
            <div
                ref={wrapper}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(173,255,47,0.6)]"
            >
                <button
                    onClick={onDismiss}
                    className="sticky top-4 float-right mr-4 mt-4 z-[110] bg-black text-[#adff2f] p-2 hover:bg-[#adff2f] hover:text-black transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                    <X size={20} className="stroke-[3]" />
                </button>
                <div className="clear-both">
                    {children}
                </div>
            </div>
        </div>
    )
}

