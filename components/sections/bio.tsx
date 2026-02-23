import Image from 'next/image';
import { CheckCircle2, Zap, Star, Code, Cpu, Globe, Heart, Shield, Rocket, User, Briefcase, Settings, Eye } from 'lucide-react';

const AVAILABLE_ICONS: Record<string, any> = {
    CheckCircle2, Zap, Star, Code, Cpu, Globe, Heart, Shield, Rocket, User, Briefcase, Settings, Eye
};

export const Bio = ({ bio, image, aboutSkills, bioHeadline, bioEst }: { bio?: string | null, image?: string | null, aboutSkills?: string[], bioHeadline?: string | null, bioEst?: string | null }) => {
    // Split the bio by newline to render separate paragraphs
    const paragraphs = bio
        ? bio.split('\n').filter(p => p.trim() !== '')
        : [];

    const features = aboutSkills && aboutSkills.length > 0 ? aboutSkills : [];

    return (
        <section id="bio" className="py-32 border-y-4 border-black bg-neon select-none">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="aspect-square border-4 border-black neo-shadow overflow-hidden bg-black group">
                            <Image
                                src={image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCN0-WWY0WN4jlxRmaYJFQukBBdesaswAi6-nMql4-nV6KYveZUcP5F0Qehj55N1UcBqOgD_IuCVTNA_-SR4-yqcIeSKpPmRyfLTyGPjCLI5_LDeJ-gpkJWanDenTrmthRgql3keV8sVUvB4Lq7xhMb16Bx96czZc2VJZ1oDmFcInO58suY3vsDGMZgcNtyNdjfdWZiHAfNki3bAfCVScOZwYt3P_wVI3Ji1KrxKlpf-1DUlx4uIZEwLKa3j8ZWnghG8cKNgjJK4Mlu"}
                                alt="Mahmoud"
                                fill
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className="absolute -bottom-8 -right-8 bg-white border-4 border-black p-6 neo-shadow rotate-3 hidden md:block">
                            <p className="font-extrabold text-2xl uppercase italic leading-none">{bioEst || "EST. 2019"}</p>
                        </div>
                    </div>

                    <div className="bg-white border-4 border-black p-12 neo-shadow">
                        <h2 className="text-5xl font-extrabold uppercase mb-8 italic tracking-tighter">{bioHeadline || "HEY, I'M MAHMOUD."}</h2>
                        <div className="space-y-6 text-xl font-bold uppercase leading-tight">
                            {paragraphs.map((p, idx) => (
                                <p key={idx}>{p}</p>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
                            {features.map((feature, i) => {
                                const parts = feature.split('|');
                                const iconName = parts.length > 1 ? parts[0] : 'CheckCircle2';
                                const text = parts.length > 1 ? parts[1] : feature;
                                const IconComponent = AVAILABLE_ICONS[iconName] || CheckCircle2;

                                return (
                                    <div key={i} className={`border-4 border-black p-4 flex items-center gap-3 ${i % 2 === 0 ? 'bg-neon' : 'bg-white'}`}>
                                        <IconComponent className="w-6 h-6 stroke-[3px]" />
                                        <span className="font-extrabold uppercase text-sm">{text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
