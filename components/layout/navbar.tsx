import Link from 'next/link'
import { Terminal, Download } from 'lucide-react'

export default function Navbar({
    cvUrl,
    siteSettings
}: {
    cvUrl?: string | null,
    siteSettings?: any
}) {
    return (
        <header className="sticky top-0 z-50 bg-white border-b-4 border-black">
            <div className="max-w-[1440px] mx-auto px-6 h-24 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 border-4 border-black bg-neon px-4 py-2 neo-shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                    <Terminal className="w-6 h-6 stroke-[3px]" />
                    <h2 className="text-2xl font-extrabold tracking-tighter uppercase">Mahmoud.Dev</h2>
                </Link>

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

                <div className="flex items-center gap-4">
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
        </header>
    )
}
