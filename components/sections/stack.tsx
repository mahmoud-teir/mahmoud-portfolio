import { SectionHeader } from '@/components/ui/section-header';
import { Code2, Layers, Cpu, Database, Wrench, Palette, Cloud, Terminal } from 'lucide-react';
import type { Skill } from '@prisma/client';

export const Stack = ({ skills }: { skills: Skill[] }) => {
    // Map categories to icons
    const getIconForCategory = (category: string) => {
        switch (category.toLowerCase()) {
            case 'frontend': return Code2;
            case 'backend': return Database;
            case 'tools': return Wrench;
            case 'design': return Palette;
            case 'devops': return Cloud;
            default: return Terminal;
        }
    };

    return (
        <section id="stack" className="py-32 border-b-4 border-black bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <SectionHeader title="The_Stack" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-4 border-black divide-x-0 md:divide-x-0 lg:divide-x-0">
                    {skills.map((skill, i) => {
                        const Icon = getIconForCategory(skill.category);
                        return (
                            <div
                                key={skill.id}
                                className="p-12 border-black border-b-4 md:border-r-4 last:border-r-0 lg:odd:border-r-4 lg:even:border-r-4 lg:[&:nth-child(4n)]:border-r-0 group hover:bg-neon transition-colors duration-300"
                            >
                                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Icon size={48} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-3xl font-extrabold uppercase mb-4 leading-none tracking-tighter">{skill.name}</h3>
                                <p className="font-bold uppercase text-sm leading-tight opacity-70">
                                    // {skill.category} Development & Optimization
                                </p>
                            </div>
                        );
                    })}
                    {skills.length === 0 && (
                        <div className="p-12 bg-white col-span-full text-center font-bold uppercase text-lg border-b-4 border-black">
                            // NO_DATA_FOUND_IN_STACK
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
