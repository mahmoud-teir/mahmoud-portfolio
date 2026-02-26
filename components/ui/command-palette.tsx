'use client'

import React, { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2, ArrowRight } from 'lucide-react'
import { searchAll } from '@/app/actions/search'

// Define the type for search results based on Prisma models we plan to search
type SearchResult = {
    id: string
    title: string
    type: 'PROJECT' | 'EXPERIENCE' | 'SKILL'
    href: string
}

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)

    // Keyboard shortcut (CMD+K or CTRL+K) and Custom Event Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen((open) => !open)
            }
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }

        const handleCustomOpen = () => setIsOpen(true)

        document.addEventListener('keydown', handleKeyDown)
        window.addEventListener('open-command-palette', handleCustomOpen)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('open-command-palette', handleCustomOpen)
        }
    }, [])

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            // Prevent scrolling on background when modal is open
            setTimeout(() => inputRef.current?.focus(), 100)
        } else {
            document.body.style.overflow = 'unset'
            setQuery('')
            setResults([])
        }
    }, [isOpen])

    // Handle Search with Debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.trim().length === 0) {
                setResults([])
                return
            }

            startTransition(async () => {
                try {
                    const data = await searchAll(query)
                    setResults(data)
                } catch (error) {
                    console.error("Search failed:", error)
                    setResults([])
                }
            })
        }, 300) // 300ms debounce

        return () => clearTimeout(timeoutId)
    }, [query])

    const handleSelect = (href: string) => {
        setIsOpen(false)
        router.push(href)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4">
            <div
                className="w-full max-w-2xl bg-white border-4 border-black brutal-shadow overflow-hidden flex flex-col max-h-[70vh]"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header / Input */}
                <div className="flex items-center border-b-4 border-black p-4 md:p-6 bg-brutal-bg">
                    <Search size={28} className="text-black mr-4 stroke-[3]" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="SEARCH PROJECTS, SKILLS, EXPERIENCE... (CMD+K)"
                        className="w-full bg-transparent border-none outline-none text-xl md:text-2xl font-black uppercase tracking-tight placeholder:opacity-40"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {isPending && <Loader2 size={24} className="animate-spin ml-4 text-black stroke-[3]" />}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="ml-4 p-2 bg-black text-[#adff2f] hover:bg-white hover:text-black border-2 border-black transition-colors"
                    >
                        <X size={24} className="stroke-[3]" />
                    </button>
                </div>

                {/* Results Area */}
                <div className="overflow-y-auto w-full">
                    {query.trim().length > 0 && results.length === 0 && !isPending && (
                        <div className="p-8 text-center text-lg font-bold uppercase opacity-60">
                            NO_RECORDS_FOUND_FOR_QUERY: '{query}'
                        </div>
                    )}

                    {results.length > 0 && (
                        <ul className="divide-y-4 divide-black">
                            {results.map((result) => (
                                <li key={`${result.type}-${result.id}`}>
                                    <button
                                        onClick={() => handleSelect(result.href)}
                                        className="w-full text-left p-4 md:p-6 hover:bg-[#adff2f] transition-colors flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-black bg-black text-white px-2 py-1 uppercase">
                                                {result.type}
                                            </span>
                                            <span className="text-lg md:text-2xl font-bold uppercase tracking-tight">
                                                {result.title}
                                            </span>
                                        </div>
                                        <ArrowRight size={24} className="stroke-[3] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Default state before searching */}
                    {query.trim().length === 0 && (
                        <div className="p-6 md:p-10 text-center space-y-4 border-t-2 border-black border-dashed">
                            <p className="font-bold uppercase text-sm opacity-60">
                                SYSTEM_READY. ENTER QUERY TO INITIATE SCAN.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t-4 border-black p-4 bg-brutal-bg flex justify-between items-center text-xs font-bold uppercase">
                    <span className="opacity-50">Powered by Brutalist OS</span>
                    <span className="flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-1 rounded-sm">ESC</span> to Close
                    </span>
                </div>
            </div>

            {/* Click Outside to Close overlay functionality */}
            <div
                className="absolute inset-0 -z-10 bg-transparent"
                onClick={() => setIsOpen(false)}
                aria-label="Close modal"
            />
        </div>
    )
}
