# krazyk-portfolio

Personal portfolio for **Kaushal Patel** — Software Engineer (AI/ML & Full Stack).

The centerpiece is a **rigged 2D avatar** that reacts to the visitor: its eyes
track the cursor, it tilts toward each section as it scrolls into view, perks up
over interactive elements, and has a click easter egg. Everything else is built
to keep that avatar feeling alive.

<!-- TODO(you): add the production URL once you're happy with it. -->
🔗 **Live:** _coming soon_

## Tech

- **Framework:** Next.js (App Router, TypeScript, Turbopack)
- **Styling:** Tailwind CSS v4 — CSS-first `@theme` tokens, class-based dark mode
- **Animation:** GSAP + ScrollTrigger, SplitText, ScrambleText via `@gsap/react` (`useGSAP`)
- **Avatar:** hand-layered inline SVG, each group animated independently by ref
- **Hosting:** Vercel

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
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

### Environment

Set the keys you need in `.env.local` (none are committed):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Contact-form submissions (Web3Forms) |
| `NEXT_PUBLIC_RESUME_URL` | Résumé link in the social rail (omitted if unset) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO / Open Graph metadata (optional) |

## License

The **code** in this repository is licensed under the [MIT License](LICENSE) —
feel free to read it, learn from it, and reuse the implementation.

The **content** is not. The copy, project descriptions, and especially the
avatar artwork (an original likeness of the author) are **© Kaushal Patel, all
rights reserved**, and fall outside the MIT grant. Please don't reproduce them
without permission.
