import React from 'react';
import prisma from '@/lib/db';

// Layout
import Navbar from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

// Sections
import { Hero } from '@/components/sections/hero';
import { Stack } from '@/components/sections/stack';
import { Projects } from '@/components/sections/projects';
import { Experience } from '@/components/sections/experience';
import { Bio } from '@/components/sections/bio';
import { Contact } from '@/components/sections/contact';

// Opt out of caching if we want fresh data immediately, or rely on ISR/revalidatePath
export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  // Fetch data in parallel for performance
  const [skills, projects, experiences, adminUser, siteSettings] = await Promise.all([
    prisma.skill.findMany({ orderBy: { order: 'asc' } }),
    prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' }
    }),
    prisma.experience.findMany({ orderBy: { order: 'asc' } }),
    prisma.user.findFirst({ orderBy: { updatedAt: 'desc' } }),
    prisma.siteSettings.findUnique({ where: { id: "global" } })
  ]);

  return (
    <main className="min-h-screen">
      <Navbar cvUrl={adminUser?.cvUrl} siteSettings={siteSettings} />
      <Hero siteSettings={siteSettings} />
      <Stack skills={skills} />
      <Experience experiences={experiences} />
      <Projects projects={projects} />
      <Bio
        bio={adminUser?.bio}
        image={adminUser?.image}
        aboutSkills={siteSettings?.aboutSkills}
        bioHeadline={siteSettings?.bioHeadline}
        bioEst={siteSettings?.bioEst}
      />
      <Contact contactText={siteSettings?.contactText || undefined} displayEmail={siteSettings?.displayEmail || undefined} />
      <Footer siteSettings={siteSettings} />
    </main>
  );
}
