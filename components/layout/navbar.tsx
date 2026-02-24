'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Terminal, Download, Menu, X } from 'lucide-react'

export default function Navbar({
    cvUrl,
    siteSettings
}: {
    cvUrl?: string | null,
    siteSettings?: any
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white border-b-4 border-black">
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 border-4 border-black bg-neon px-3 py-2 md:px-4 neo-shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all z-50 block"
                >
                    <Terminal className="w-6 h-6 stroke-[3px]" />
                    <h2 className="text-xl md:text-2xl font-extrabold tracking-tighter uppercase">Mahmoud.Dev</h2>
                </Link>

                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden border-4 border-black p-2 bg-white neo-shadow-sm active:translate-y-1 active:shadow-none transition-all z-50 relative"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 bg-black text-white px-8 py-3 border-4 border-black">
                    {['Work', 'Stack', 'Bio', 'Contact', 'Admin'].map((item) => (
                        <a
                            key={item}
                            href={item === 'Admin' ? '/admin/dashboard' : `#${item.toLowerCase()}`}
                            className="text-sm font-bold uppercase hover:text-neon transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                {/* Desktop CV Button */}
                <div className="hidden md:flex items-center gap-4">
                    {cvUrl ? (
                        <a
                            href={cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white border-4 border-black px-6 py-2 font-bold uppercase neo-shadow-sm hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
                        >
                            Download_CV <Download size={16} />
                        </a>
                    ) : (
                        <button disabled className="bg-gray-200 text-gray-400 border-4 border-gray-400 px-6 py-2 font-bold uppercase flex items-center gap-2 cursor-not-allowed">
                            Resume_Unavailable
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-4 border-black flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <nav className="flex flex-col border-b-4 border-black bg-black text-white p-4 gap-4">
                        {['Work', 'Stack', 'Bio', 'Contact', 'Admin'].map((item) => (
                            <a
                                key={item}
                                href={item === 'Admin' ? '/admin/dashboard' : `#${item.toLowerCase()}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-bold uppercase hover:text-neon transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </nav>
                    <div className="p-4 bg-neon flex justify-center">
                        {cvUrl ? (
                            <a
                                href={cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white border-4 border-black px-6 py-3 font-bold uppercase neo-shadow-sm active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 w-full"
                            >
                                Download_CV <Download size={16} />
                            </a>
                        ) : (
                            <button disabled className="bg-gray-200 text-gray-400 border-4 border-gray-400 px-6 py-3 font-bold uppercase flex items-center justify-center gap-2 w-full cursor-not-allowed">
                                Resume_Unavailable
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
