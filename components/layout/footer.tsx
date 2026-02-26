import { Github, Linkedin, Twitter, Terminal } from 'lucide-react';

export const Footer = ({ siteSettings }: { siteSettings?: any }) => (
    <footer className="py-16 border-t-4 border-black bg-black text-white">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-3 border-4 border-white p-3 bg-neon text-black">
                <Terminal className="w-6 h-6 stroke-[3px]" />
                <span className="text-xl font-extrabold uppercase tracking-tighter">Mahmoud.Dev</span>
            </div>

            <p className="text-sm font-bold uppercase text-center md:text-left leading-relaxed opacity-70">
                © {new Date().getFullYear()} Mahmoud Teir. All Rights Reserved.<br />
                Built with passion and radical intent.
            </p>

            <div className="flex items-center gap-4">
                {[
                    { icon: Github, href: siteSettings?.githubUrl, name: "GitHub" },
                    { icon: Linkedin, href: siteSettings?.linkedinUrl, name: "LinkedIn" },
                    { icon: Twitter, href: siteSettings?.twitterUrl, name: "Twitter" }
                ].filter(social => social.href && social.href !== "").map((social) => (
                    <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center border-4 border-white hover:bg-neon hover:text-black transition-colors"
                        aria-label={social.name}
                    >
                        <social.icon size={24} />
                    </a>
                ))}
            </div>
        </div>
    </footer>
);
