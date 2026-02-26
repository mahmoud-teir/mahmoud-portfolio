import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CommandPalette } from '@/components/ui/command-palette';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'MAHMOUD.DEV | Full-Stack Engineer',
  description: 'Software Developer specializing in building high-performance web applications with modern technologies. I turn complex problems into raw, efficient code.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="font-mono text-black">
        {children}
        {modal}
        <CommandPalette />
      </body>
    </html>
  );
}
