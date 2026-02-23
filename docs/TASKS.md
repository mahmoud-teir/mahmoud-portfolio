# Task Breakdown (Kanban Format)

## Phase 1: Project Structure & Configuration
- **ID**: TASK-101
  - **Title**: Setup Base Project Structure
  - **Category**: Setup/Frontend
  - **Priority**: Critical
  - **Estimated Time**: 1 hour
  - **Description**: Configure the `app/` directory structure, removing default boilerplate. Set up `globals.css` with Tailwind v4 variables based on the UI Design System.
  - **Acceptance Criteria**: App loads a blank page with correct font and base background color. `globals.css` includes `@theme` rules.

- **ID**: TASK-102
  - **Title**: Configure Fonts
  - **Category**: Setup/Frontend
  - **Priority**: High
  - **Estimated Time**: 1 hour
  - **Description**: Implement `next/font` in `layout.tsx` to load Space Grotesk (display) and Space Mono (body) fonts globally.
  - **Acceptance Criteria**: Both fonts render correctly across the application and are defined in Tailwind config.

## Phase 2: Core Components Development
- **ID**: TASK-201
  - **Title**: Build Brutalist Button Component
  - **Category**: Frontend
  - **Priority**: High
  - **Estimated Time**: 2 hours
  - **Description**: Create a reusable Button component with variants (primary, secondary, outline) matching the brutalist design system (hard shadows, thick borders).
  - **Acceptance Criteria**: Button component supports different variants, handles clicks, and displays sharp hover effects.

- **ID**: TASK-202
  - **Title**: Build Project Card Component
  - **Category**: Frontend
  - **Priority**: High
  - **Estimated Time**: 2 hours
  - **Description**: Create a reusable Card component for showcasing projects with image placeholders, title, tech stack tags, and a harsh shadow hover effect.
  - **Acceptance Criteria**: Card looks brutalist, is responsive, and animates correctly on hover.

- **ID**: TASK-203
  - **Title**: Build Badge/Tag Component
  - **Category**: Frontend
  - **Priority**: Medium
  - **Estimated Time**: 1 hour
  - **Description**: Create a pill/rectangular badge for displaying skills and tech stacks (e.g., React, Next.js).
  - **Acceptance Criteria**: Badges have solid borders and contrasting background colors.

## Phase 3: Page Assembly
- **ID**: TASK-301
  - **Title**: Implement Hero Section
  - **Category**: Frontend
  - **Priority**: Critical
  - **Estimated Time**: 3 hours
  - **Description**: Build the landing page hero section with oversized typography, a bold headline, and a primary CTA. Use Framer Motion for a sharp entrance animation.
  - **Acceptance Criteria**: Hero section is responsive, legible on mobile, and animates in on load.

- **ID**: TASK-302
  - **Title**: Implement About & Skills Section
  - **Category**: Frontend
  - **Priority**: High
  - **Estimated Time**: 2 hours
  - **Description**: Build the section detailing professional experience and displaying technical skills using the Badge component.
  - **Acceptance Criteria**: Content is laid out cleanly within a grid or bordered layout.

- **ID**: TASK-303
  - **Title**: Implement Projects Gallery
  - **Category**: Frontend
  - **Priority**: High
  - **Estimated Time**: 3 hours
  - **Description**: Create a static data array of projects and map them to the Project Card components in a responsive CSS grid on the home page.
  - **Acceptance Criteria**: Gallery displays at least 4 projects, responding from 1 column (mobile) to 2 or 3 columns (desktop).

- **ID**: TASK-304
  - **Title**: Implement Footer / Contact Section
  - **Category**: Frontend
  - **Priority**: High
  - **Estimated Time**: 1 hour
  - **Description**: Build a simple footer with bold links to GitHub, LinkedIn, and an email `mailto:` link.
  - **Acceptance Criteria**: Links are clickable with brutalist hover states.

## Phase 4: Polish & Optimization
- **ID**: TASK-401
  - **Title**: Accessibility Review
  - **Category**: Testing
  - **Priority**: High
  - **Estimated Time**: 2 hours
  - **Description**: Audit the site for color contrast, ARIA labels, and keyboard navigation.
  - **Acceptance Criteria**: 100% score on Lighthouse Accessibility audit.

- **ID**: TASK-402
  - **Title**: Performance Optimization
  - **Category**: Testing
  - **Priority**: Medium
  - **Estimated Time**: 2 hours
  - **Description**: Optimize images, check bundle sizes, and ensure fast LCP (Largest Contentful Paint).
  - **Acceptance Criteria**: 90+ score on Lighthouse Performance audit.
