# Technical Design Document (TDD)

## 1. Architecture Overview
- **App Router Architecture:** Utilizing Next.js 15 App Router (`app/`) for intuitive file-system routing and optimal performance.
- **Server Components vs Client Components:** Maximizing the use of React Server Components (RSC) by default to reduce JavaScript bundle sizes and improve load times. Client Components (`"use client"`) will be strictly isolated to leaf nodes needing interactivity (e.g., animations, forms, state toggles).
- **Route Handlers / Server Actions:** Relying on Server Actions for handling form submissions (e.g., contact form) to simplify data mutation and eliminate the need for dedicated API routes if a backend is introduced later.
- **Route Groups:** Organizing the `app/` directory (e.g., `(marketing)`, `(projects)`) for clean folder structure without affecting the URL paths.

## 2. Technology Stack Decisions
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Database/Backend:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma (using Prisma Client with Neon driver adapter for Edge support if necessary).
- **Authentication:** Better Auth for secure admin dashboard access.
- **Styling:** Tailwind CSS v4 for utility-first styling, enabling rapid implementation of the brutalist aesthetic natively without massive CSS files.
- **Components:** Custom brutalist UI components (hard borders, high contrast). Not using Shadcn heavily to maintain the raw brutalist look, though some base Radix primitives might be used for accessibility if needed.
- **Animations:** Framer Motion (`motion`) for performant, expressive micro-interactions.
- **Bundler:** Turbopack (default for Next.js 15 dev environment).
- **Linting & Formatting:** ESLint (flat config) and Prettier.

## 3. Detailed Project Structure
```
mahmod-dev/
├── app/
│   ├── (main)/
│   │   ├── page.tsx (Home - Hero, About, Skills, Featured)
│   │   ├── layout.tsx
│   ├── projects/
│   │   ├── page.tsx (All Projects)
│   │   ├── [slug]/page.tsx (Project Detail)
│   ├── admin/
│   │   ├── dashboard/page.tsx (CMS Dashboard)
│   │   ├── login/page.tsx (Auth)
│   ├── api/
│   │   ├── auth/[...all]/route.ts
│   ├── layout.tsx (Root Layout)
│   ├── globals.css (Tailwind v4 theme & base brutalist styles)
├── components/
│   ├── ui/ (Buttons, Cards, Badges)
│   ├── sections/ (Hero, About, ProjectsList, Contact)
│   ├── layout/ (Header, Footer, Navigation)
├── lib/
│   ├── db.ts (Prisma client instance)
│   ├── auth.ts (Better Auth instance)
│   ├── utils.ts (Helper functions like cn/tailwind-merge)
├── prisma/
│   ├── schema.prisma
├── public/ (Images, raw assets)
```

## 4. Performance Optimization Strategy
- **Image Optimization:** Strict usage of `next/image` with proper sizing and formats.
- **Font Optimization:** Utilizing `next/font` to preload Google Fonts (e.g., Inter, Space Mono) and prevent layout shift.
- **Static Generation:** Pre-rendering all pages at build time using SSG.

## 5. Security Considerations
- Simple implementation minimizes attack vectors.
- Contact form submissions will be validated server-side using Server Actions and potentially Zod, and routed through a secure third-party service (like Resend or Formspree) to prevent abuse/spam.

## 6. Testing Strategy
- **Manual Testing:** Due to the visual nature of a brutalist portfolio, rigorous manual testing across browsers (Chrome, Firefox, Safari) and devices (Mobile, Tablet, Desktop) will be prioritized.
- **Future:** Vitest + React Testing Library for component unit tests, Playwright for critical user flows (e.g., contact form submission).
