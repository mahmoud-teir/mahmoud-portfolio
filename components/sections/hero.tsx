'use client'

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const Marquee = ({ text }: { text: string }) => (
    <div className="absolute top-0 left-0 w-full bg-black text-neon py-4 border-b-4 border-black overflow-hidden select-none">
        <div className="marquee flex gap-8">
            {[...Array(6)].map((_, i) => (
                <span key={i} className="text-2xl md:text-4xl font-extrabold uppercase italic shrink-0 whitespace-nowrap">
                    {text}
                </span>
            ))}
        </div>
    </div>
);

export const Hero = ({ siteSettings }: { siteSettings?: any }) => {
    // Determine the title lines. If dynamic is provided, split it by newlines.
    const titleLines = siteSettings?.heroTitle
        ? siteSettings.heroTitle.split('\n')
        : []

    const subtitle = siteSettings?.heroSubtitle || ""
    const marqueeText = siteSettings?.marqueeText || ""

    return (
        <section className="relative pt-20 pb-32 overflow-hidden border-b-4 border-black">
            <Marquee text={marqueeText} />

            <div className="max-w-7xl mx-auto px-6 mt-24">
                <div className="relative inline-block">
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-9xl font-extrabold leading-[0.9] tracking-tighter uppercase mb-8 md:mb-12"
                    >
                        {titleLines.map((line: string, i: number) => (
                            <span key={i}>
                                {line === "ROBUST" ? (
                                    <span className="bg-black text-neon px-4 inline-block">{line}</span>
                                ) : line}
                                {i < titleLines.length - 1 && <br />}
                            </span>
                        ))}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, rotate: 12, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                        className="absolute -right-12 top-0 bg-neon border-4 border-black p-4 neo-shadow hidden lg:block"
                    >
                        <p className="font-bold uppercase leading-none text-center">
                            Status: Available <br /> For Hire
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="max-w-3xl border-l-[4px] md:border-l-[8px] border-black pl-6 md:pl-8 mt-12"
                >
                    <p className="text-lg md:text-2xl font-bold uppercase leading-tight mb-10 md:mb-12">
                        {subtitle}
                    </p>

                    <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-6">
                        <Link href="#work" className="bg-black text-white px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-bold uppercase neo-shadow-hover transition-all flex items-center justify-center gap-4 group w-full md:w-auto">
                            Explore Work
                            <ArrowRight className="rotate-90 group-hover:translate-y-2 transition-transform duration-300" />
                        </Link>
                        <Link href="#contact" className="bg-neon border-4 border-black text-black px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-bold uppercase neo-shadow-hover flex items-center justify-center transition-all w-full md:w-auto text-center">
                            Get In Touch
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
};
