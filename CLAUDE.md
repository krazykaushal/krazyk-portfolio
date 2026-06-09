# CLAUDE.md

Guidance for Claude when working in this repository. Read this first, every session.

---

## Project

A personal portfolio website built around a **rigged 2D avatar** of the owner that reacts to the cursor, scroll, clicks, and idle time. The avatar is the centerpiece — it navigates and reacts as the visitor moves through the page. Everything else (sections, content) is secondary to keeping the avatar feeling alive.

**Tech:** Next.js (App Router, **TypeScript**, Turbopack) + **Tailwind CSS v4** + GSAP (with ScrollTrigger) for animation, layered SVG for the avatar. Import alias is `@/*` (maps to the project root — there is no `src/` directory).

> **Companion file:** `create-next-app` also generated an `AGENTS.md` with up-to-date Next.js conventions for coding agents. Treat it as authoritative for Next.js framework idioms and follow it alongside this file. This CLAUDE.md owns the _project intent, working agreement, and avatar design_; AGENTS.md owns _framework specifics_.

---

## ⚠️ How we work together (read this carefully)

This is a **learning project**. The owner is refreshing their core web-dev fundamentals (HTML, CSS, JS, React/Next.js, animation thinking). The goal is _not_ a finished site as fast as possible — it's for the owner to write a lot of the code themselves and understand it.

We are in **pairing / alternate mode**. That means:

- **Do not build whole features end to end** unless explicitly asked. Scaffold the structure and write _one_ worked example, then leave the rest as clearly marked `// TODO(you):` comments for the owner to implement.
- **Explain before you code.** When introducing a new concept, API, or pattern (a GSAP method, a React hook, a TypeScript type, a Tailwind pattern), give a 2–3 sentence explanation of what it does and why we're using it, and link the relevant docs.
- **Keep changes small.** One component, one interaction, or one bug fix at a time. Small diffs the owner can actually read and learn from.
- **Don't silently rewrite the owner's code.** If their code has a bug or could be cleaner, point to the specific line, explain the issue, and suggest the fix — let them apply it.
- **Don't refactor large areas unprompted.** Ask first.
- **Ask before adding any dependency.** Part of the exercise is keeping the stack small and understood.
- When the owner is stuck, prefer a **hint or a leading question** over the full answer, unless they ask for the answer outright.
- It's fine to point out when something the owner wrote is good — reinforcing correct instincts helps learning.

If a request is ambiguous about how much to do, default to **less** code and **more** explanation.

---

## Commands

```bash
npm install        # install deps
npm run dev        # start Next.js dev server (http://localhost:3000)
npm run build      # production build
npm run start      # serve the production build
npm run lint       # run ESLint (comes with create-next-app)
```

Confirm these against package.json before relying on them; update this file if they change.

---

## Project structure

```
app/
  layout.tsx           # root layout; mounts the persistent <Avatar /> layer
  page.tsx             # the single long-scroll home page
  globals.css          # Tailwind import + design tokens via @theme (v4 CSS-first)
components/
  Avatar/              # the rigged avatar lives here ('use client')
    Avatar.tsx         # layered SVG, exposes refs for animatable parts
    useAvatarState.ts  # state machine: idle | wave | point | react | ...
    avatar.css         # only for keyframes/animation CSS Tailwind can't express
  sections/
    Hero.tsx
    About.tsx
    Work.tsx
    Skills.tsx
    Contact.tsx
  ui/                  # small shared bits (buttons, etc.)
hooks/                 # reusable hooks (cursor position, scroll, etc.) — .ts
animations/            # reusable GSAP timelines — .ts
lib/
  gsap.ts              # 'use client' module: registerPlugin once, re-export gsap
```

Server components are the Next.js default. **Anything using GSAP, refs, or browser events must start with `'use client'`** — see gotchas below. Import with the alias, e.g. `import { Avatar } from "@/components/Avatar/Avatar"`.

This is a target, not a mandate — grow into it. Don't create empty folders ahead of need.

---

## The avatar system (the heart of the project)

The avatar is a **layered SVG**: separate groups for eyes, pupils, head, arms, mouth, body — each reachable by `ref` so GSAP can animate them independently.

It runs on a small **state machine** (`useAvatarState`). Core states:

- `idle` — gentle breathing loop + occasional blink/fidget on a timer
- `track` — pupils/head follow the cursor (math, not a canned animation)
- `wave` — triggered on hero load
- `point` — triggered when a project/section comes into view
- `react` — triggered on hover of an interactive element
- `easter-egg` — triggered after N clicks on the avatar

Rules:

- Only one "active" intentional animation at a time; cursor-tracking can run underneath idle.
- Every animation should have a _reason_ tied to a user action or app state. No animation for its own sake.
- Respect `prefers-reduced-motion`: fall back to a calm static avatar.

---

## Animation conventions (GSAP)

- Use the **`useGSAP`** hook (`@gsap/react`) for animations scoped to a component so cleanup is automatic — don't run raw `gsap.to` inside `useEffect` without cleanup.
- Register plugins once (e.g. `gsap.registerPlugin(ScrollTrigger, useGSAP)`).
- Keep complex, reusable timelines in `animations/` and import them; keep one-off tweens local.
- Prefer animating `transform` and `opacity` (cheap) over layout properties (expensive).
- Name timelines and refs descriptively (`heroWaveTl`, `leftPupilRef`).

Docs to lean on: GSAP (gsap.com/docs), ScrollTrigger, and the React integration (gsap.com/resources/React).

---

## Responsive design (mobile-first, always)

This site must work well on mobile from day one — not as a Phase 5 retrofit.

- **Write mobile-first Tailwind:** start with the base (smallest) layout, then layer `sm:`, `md:`, `lg:` overrides. Never write desktop-only styles and patch mobile later.
- **Test at 375px width** (iPhone SE — a common small baseline) and 768px (tablet) alongside desktop during every phase.
- Touch targets must be at least 44×44px (Apple HIG / WCAG guideline).
- No `hover:`-only interactions that have no touch equivalent. If something only works on hover, it must also work on tap/focus.
- The avatar's `track` state has no cursor on mobile — always pair it with a touch/scroll fallback (covered in the avatar system section).
- Avoid fixed pixel widths on containers; prefer `max-w-*` with `w-full` so content reflows naturally.

---

## Code conventions

- Functional components + hooks only. No class components.
- One component per file; PascalCase `.tsx` for components, camelCase `.ts` for hooks (`useThing.ts`).
- **TypeScript:** type component props with an explicit `type`/`interface`; avoid `any` (use `unknown` + narrowing if needed). GSAP and React ship their own types — no extra `@types` packages.
- Keep components small; pull logic into hooks when a component gets busy.
- **Styling:** Tailwind utility classes inline for layout and look. Reserve a CSS file (e.g. `avatar.css`) only for `@keyframes` or animation states Tailwind can't express; GSAP handles the rest in JS.
- **Design tokens** (brand colors, fonts, spacing) live in `globals.css` via Tailwind v4's `@theme` block — not a `tailwind.config.js` (v4 is CSS-first).
- Comments explain _why_, not _what_. Mark owner work with `// TODO(you):`.

---

## Build roadmap (check off as we go)

- [x] **Phase 0** — Scaffold + first commit + GitHub repo + Vercel deploy. Pipeline live end to end.
- [x] **Phase 1** — Static layout + content for all sections (Hero, About, Work, Skills, Contact). Dark-by-default theme via class-based dark mode + design tokens in `globals.css`. Contact uses a Web3Forms-backed form (`ContactForm.tsx`, a `'use client'` island; key in `.env.local` as `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`). Mobile-first throughout.
- [x] **Phase 2** — Avatar SVG inlined as a React component (`components/Avatar/Avatar.tsx`, `'use client'`; source art in `avatar-source.svg`, `viewBox` cropped to the figure). Eyes track the cursor via `useGSAP` + `gsap.quickTo` (eyes+glints in their own `<g>`; eyebrows fixed). GSAP installed; plugins registered once in `lib/gsap.ts` (import gsap/useGSAP from there). Tracking respects `prefers-reduced-motion` and rests centered on touch. Rendered in the Hero beside the text with a light circular backdrop.
- [x] **Phase 3** — GSAP scroll animations via ScrollTrigger. Sections fade/slide in on scroll through a reusable `<Reveal>` client wrapper (`components/ui/Reveal.tsx`; sections stay server components, passed as children). Avatar lifted out of the Hero into a sticky side lane in `app/page.tsx` (sticky on md+, stacked on top on mobile) so it stays in view while content scrolls; Hero is now text-only. Avatar `point` reaction = head tilt (`headRef`, rotates around the neck via `svgOrigin`) + eyebrow raise (`browsRef`), a paused timeline replayed by one ScrollTrigger per section. ScrollTrigger registered in `lib/gsap.ts`.
- [ ] **Phase 4** — Idle micro-animations, intro/loader, hover reactions, the click easter egg.
- [ ] **Phase 5** — `prefers-reduced-motion`, performance + a11y audit, final deploy. (Responsive is built in from Phase 1, not a separate pass.)

Work strictly in order. Don't start a phase before the previous one is solid.

---

## Things to remember / gotchas

- The avatar must work on mobile where there's no cursor — `track` should degrade gracefully (e.g. follow scroll or device tilt, or just idle).
- **GSAP is browser-only.** Any component that imports or runs GSAP must have `'use client'` as its first line. Server components can't use refs, `useGSAP`, or browser events.
- **ScrollTrigger and cursor logic touch `window`/`document`**, which don't exist during server rendering. Initialize them inside `useGSAP` / `useEffect` (client-only lifecycle), never at module top level in a way that runs on the server.
- **Register plugins once, client-side.** Put `gsap.registerPlugin(useGSAP, ScrollTrigger)` in `lib/gsap.ts` (`'use client'`) and import gsap from there in client components, rather than registering in multiple places.
- Watch GSAP double-mounting in React Strict Mode (Next dev runs it) — `useGSAP` handles cleanup; verify animations don't stack.
- If a piece of UI doesn't need interactivity, leave it as a server component — only opt into `'use client'` where animation or events actually live, to keep the bundle lean.
- Don't put real contact details or secrets in the repo.
- Update this file when conventions, commands, or structure change. A stale CLAUDE.md is worse than none.
