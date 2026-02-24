'use client'

import { SectionHeader } from '@/components/ui/section-header';
import { motion } from 'framer-motion';

export const Experience = ({ experiences }: { experiences: any[] }) => {
    const formatDateYear = (date: Date) => {
        return new Date(date).getFullYear().toString();
    };

    return (
        <section id="experience" className="py-32 px-6 bg-white border-b-4 border-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <SectionHeader title="Experience_Log" />

                <div className="relative mt-20">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 md:w-2 bg-black -translate-x-1/2 h-full z-0" />

                    <div className="space-y-24">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className={`relative flex flex-col md:flex-row items-center justify-between ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Center Marker */}
                                <div className="absolute left-0 md:left-1/2 w-8 h-8 bg-neon border-4 border-black -translate-x-1/2 z-10 hidden md:block" />

                                <div className={`w-full md:w-[45%] ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                    <div className="inline-block bg-black text-white px-4 py-2 font-extrabold text-lg uppercase neo-shadow-sm mb-6">
                                        {formatDateYear(exp.startDate)} — {exp.current ? 'PRESENT' : exp.endDate ? formatDateYear(exp.endDate) : ''}
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tighter mb-2">
                                        {exp.company}
                                    </h3>
                                    <h4 className="text-lg md:text-xl font-bold uppercase text-neon bg-black px-3 py-1 inline-block mb-6">
                                        {exp.role}
                                    </h4>

                                    <div className="bg-white border-4 border-black p-6 md:p-8 neo-shadow relative z-20 group hover:bg-neon transition-colors duration-300">
                                        <p className="font-bold uppercase leading-tight text-base md:text-lg">
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden md:block w-[45%]" />
                            </motion.div>
                        ))}
                    </div>

                    {experiences.length === 0 && (
                        <div className="border-4 border-black border-dashed p-12 text-center bg-white neo-shadow relative z-10">
                            <p className="text-xl font-bold uppercase opacity-50 italic">// TIMELINE_SYSTEM_OFFLINE</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
