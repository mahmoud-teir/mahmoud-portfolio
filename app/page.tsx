import React from 'react';
import { getCachedSkills, getCachedProjects, getCachedExperiences, getCachedUser, getCachedSiteSettings } from '@/lib/queries';

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

// Remove force-dynamic to allow ISR and Static Rendering
// export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  // Fetch cached data in parallel for optimal performance
  const [skills, projects, experiences, adminUser, siteSettings] = await Promise.all([
    getCachedSkills(),
    getCachedProjects(),
    getCachedExperiences(),
    getCachedUser(),
    getCachedSiteSettings()
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
