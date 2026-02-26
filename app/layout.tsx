import type { Metadata } from 'next';
import { headers } from 'next/headers';
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

export default async function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang="en" className={`${jetbrainsMono.variable}`} suppressHydrationWarning nonce={nonce}>
      <body suppressHydrationWarning className="font-mono text-black">
        {children}
        {modal}
        <CommandPalette />
      </body>
    </html>
  );
}
