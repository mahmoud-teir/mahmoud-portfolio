# Product Requirements Document (PRD)

## 1. Project Overview
A brutalist-inspired personal portfolio website for a Full-Stack Engineer. The portfolio will showcase projects, skills, and professional experience using a bold, high-contrast, and minimalist aesthetic characteristic of brutalist web design. It will be built with modern web technologies (Next.js 15, React 19, Tailwind CSS v4) to ensure high performance and SEO optimization.

## 2. Core Objectives
- Create a striking, memorable first impression for recruiters and potential clients.
- Effectively showcase technical skills, projects, and professional background.
- Demonstrate proficiency in modern web development practices (performance, accessibility, responsive design).
- Establish a personal brand through a unique brutalist aesthetic.

## 3. User Stories
- As a recruiter, I want to quickly see the developer's tech stack and experience so I can assess their fit for a role.
- As a potential client, I want to view case studies of past projects to understand the developer's problem-solving skills and domain expertise.
- As an engineering manager, I want to find links to the developer's GitHub, LinkedIn, and resume easily.
- As an interested visitor, I want to contact the developer directly through a simple form or email link.

## 4. Core Features (MVP)
- **Hero Section**: High-impact introduction with bold typography and a clear call-to-action (CTA).
- **Projects Gallery**: Grid or list of featured projects with brief descriptions, tech stacks, and links to live demos/repos.
- **Content Management Dashboard**: Secure admin area to create, edit, and delete portfolio projects and manage skills/experience directly from the site without touching code.
- **Authentication**: Secure login for the admin dashboard (using Better Auth or NextAuth).
- **Database**: PostgreSQL database (Prisma + Neon) to store project data, skills, and bio information dynamically.
- **Contact Section**: Simple contact form or direct links to email and professional social networks.
- **Brutalist UI Details**: High contrast (black/white/neon), visible borders, raw styling, and striking typography.

## 5. Future Features (Post-MVP)
- **Blog/Articles Section**: A CMS-driven blog for technical writing tied into the same dashboard.
- **Dark/Light Mode Toggle**: While brutalism often leans dark or stark light, a toggle adds accessibility.
- **Interactive Easter Eggs**: Hidden interactive elements or micro-animations to demonstrate frontend skills.

## 6. Rendering Strategy Decisions
- **Static Site Generation (SSG)**: The primary strategy for most pages (Home, About, regular project listings) as content rarely changes and needs maximum performance.
- **Client-Side Rendering (CSR)**: Used sparingly for interactive components (e.g., animations using `motion`, complex UI toggles).
- **Incremental Static Regeneration (ISR)**: Only necessary if integrating a CMS for a blog post-MVP.

## 7. AI-Powered Features (if applicable)
- Not applicable for the MVP. Potential future feature: an AI chatbot trained on the developer's resume to answer recruiter questions interactively.

## 8. Constraints & Assumptions
- **Constraint**: Must achieve excellent Lighthouse scores (90+) for Performance, Accessibility, Best Practices, and SEO.
- **Constraint**: Must be fully responsive.
- **Assumption**: Content (project details, resume) will initially be hardcoded or managed via simple local JSON/Markdown files rather than a full CMS to speed up MVP launch.

## 9. Success Metrics
- 100% completion of the MVP feature set.
- Perfect or near-perfect Google Lighthouse scores.
- Zero accessibility violations (WCAG 2.1 AA compliant).
- Smooth deployment to Vercel.

## 10. Out of Scope
- User authentication and accounts.
- E-commerce capabilities.
- Complex backend databases (for the MVP).
