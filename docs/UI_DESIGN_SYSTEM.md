# UI Design System: Brutalist Portfolio

## 1. Core Principles
- High contrasting colors (Black, White, Neon Accents).
- Bold, oversized typography.
- Visible grid lines and hard, solid borders (no border tags).
- Raw, unpolished aesthetic mixed with modern layout techniques.
- Utilitarian interactions (sharp hovers, inverted colors).

## 2. Color Palette
- **Background:** `#FFFFFF` (Pure White) or `#F4F4F0` (Off-white parchment).
- **Foreground (Text):** `#000000` (Pure Black).
- **Accent 1:** `#FF3366` (Neon Pink).
- **Accent 2:** `#00E5FF` (Cyan).
- **Accent 3:** `#FFFF00` (Bright Yellow).
- **Borders:** `#000000` (2px to 4px thick solid lines).

## 3. Typography
- **Headings (Display):** Space Grotesk, Syne, or standard Helvetica/Arial (Black weight). Oversized, uppercase.
- **Body Text:** Inter or standard monospace (Courier New / Space Mono) for a tech/hacker vibe.
- **Configuration:** Handled via `next/font/google`.

## 4. Components

### Buttons
- **Style:** Rectangular, sharp corners, thick black border.
- **Background:** White or a bright Accent color.
- **Hover State:** Invert colors (Black background, White/Accent text) or harsh solid shadow offset (e.g., `box-shadow: 4px 4px 0 0 #000`).
- **Interaction:** Instant change, no soft transitions (or very fast snappy motion).

### Cards (Projects / Skills)
- **Style:** White background, thick black borders, stark dividers between image and text.
- **Hover State:** Lift off effect with a solid black shadow offset (`translate-x-[-4px] translate-y-[-4px]` with `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`).

### Typography Accents
- Highlights using background colors behind text (e.g., yellow marker effect).
- Marquee scrolling text for a dynamic, raw feel.

## 5. Layout & Spacing
- **Container:** Max-width `1200px`, horizontally centered, but sections can bleed to edges with thick border lines separating them.
- **Grid:** Prominent CSS Grid usage. Sometimes exposing the grid lines as a design element.
- **Spacing:** Generous padding around elements inside harsh borders.

## 6. Motion & Animation (Framer Motion)
- **Entrance:** Elements aggressively slide in or snap into place (spring physics with high stiffness and low damping).
- **Hover:** Sharp, immediate visual feedback.
- No slow, gentle fades. Everything must feel instantaneous and deliberate.

## 7. Tailwind CSS v4 Configuration Snippet
Tailwind v4 handles configuration directly in CSS (`globals.css`):

```css
@import "tailwindcss";

@theme {
  --color-brutal-bg: #F4F4F0;
  --color-brutal-black: #000000;
  --color-brutal-white: #FFFFFF;
  --color-brutal-pink: #FF3366;
  --color-brutal-cyan: #00E5FF;
  --color-brutal-yellow: #FFFF00;

  --font-display: 'Space Grotesk', sans-serif;
  --font-mono: 'Space Mono', monospace;

  --border-width-brutal: 3px;
  --shadow-brutal: 6px 6px 0px 0px rgba(0,0,0,1);
  --shadow-brutal-hover: 2px 2px 0px 0px rgba(0,0,0,1);
}
```
