# krazyk-portfolio

Personal portfolio for **Kaushal Patel** — Software Engineer (AI/ML & Full Stack).

The centerpiece is a **rigged 2D avatar** that reacts to the visitor: its eyes
track the cursor, it tilts toward each section as it scrolls into view, perks up
over interactive elements, and has a click easter egg. Everything else is built
to keep that avatar feeling alive.

🔗 **Live:** [kaushal-dev.vercel.app](https://kaushal-dev.vercel.app)

## Tech

- **Framework:** Astro (static output, TypeScript) with React islands
- **Styling:** Tailwind CSS v4 — CSS-first `@theme` tokens, class-based dark mode
- **Animation:** GSAP + ScrollTrigger, SplitText, ScrambleText (`useGSAP` in islands, plain `<script>` elsewhere)
- **Fonts:** Nunito + Geist Mono, self-hosted via Astro's Fonts API
- **Avatar:** hand-layered inline SVG, each group animated independently by ref
- **Hosting:** Vercel

Migrated from Next.js (App Router) — see the mapping table in [CLAUDE.md](CLAUDE.md).

## Features

- Cursor-tracking avatar with idle breathing, random blinks, hover/scroll reactions, and a click easter egg
- Custom dot-and-ring cursor that grows over interactive elements
- Terminal-style About section that types itself out on scroll
- Animated hero text intro (char stagger + scramble) and an ambient drifting-grid background
- Persisted light/dark toggle with no flash of the wrong theme
- Mobile-first and `prefers-reduced-motion`-aware throughout

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
```

Other scripts:

```bash
npm run build    # astro check + production build to dist/
npm run preview  # serve the production build
npm run check    # typecheck .astro/.ts/.tsx (the eslint replacement, for now)
```

### Environment

Copy `.env.example` to `.env` and fill in what you need (`.env` is gitignored).
Astro exposes `PUBLIC_`-prefixed variables to client code and inlines them at
build time — the same role Next's `NEXT_PUBLIC_` prefix played.

| Variable                      | Purpose                                                |
| ----------------------------- | ------------------------------------------------------ |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Contact-form submissions (Web3Forms)                   |
| `PUBLIC_RESUME_URL`           | Résumé link in the social rail (omitted if unset)      |
| `PUBLIC_SITE_URL`             | Canonical URL for SEO / Open Graph metadata (optional) |

## License

The **code** in this repository is licensed under the [MIT License](LICENSE) —
feel free to read it, learn from it, and reuse the implementation.

The **content** is not. The copy, project descriptions, and especially the
avatar artwork (an original likeness of the author) are **© Kaushal Patel, all
rights reserved**, and fall outside the MIT grant. Please don't reproduce them
without permission.
