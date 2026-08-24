# CLAUDE.md

Guidance for Claude when working in this repository. Read this first, every session.

---

## Project

A personal portfolio website built around a **rigged 2D avatar** of the owner that reacts to the cursor, scroll, clicks, and idle time. The avatar is the centerpiece — it navigates and reacts as the visitor moves through the page. Everything else (sections, content) is secondary to keeping the avatar feeling alive.

**Tech:** Astro (static output, **TypeScript**) with **React islands** + **Tailwind CSS v4** + GSAP (with ScrollTrigger) for animation, layered SVG for the avatar. Import alias is `@/*` (maps to `src/`).

> **Companion file:** `AGENTS.md` holds up-to-date Astro conventions for coding agents. Treat it as authoritative for Astro framework idioms and follow it alongside this file. This CLAUDE.md owns the _project intent, working agreement, and avatar design_; AGENTS.md owns _framework specifics_.

**History:** this started life as a Next.js App Router app (see `../krazyk-portfolio`) and was ported to Astro. The mapping table below is the record of that port — consult it before assuming how something used to work.

---

## ⚠️ How we work together (read this carefully)

This is a **learning project**. The owner is refreshing their core web-dev fundamentals (HTML, CSS, JS, React/Astro, animation thinking). The goal is _not_ a finished site as fast as possible — it's for the owner to write a lot of the code themselves and understand it.

We are in **pairing / alternate mode**. That means:

- **Do not build whole features end to end** unless explicitly asked. Scaffold the structure and write _one_ worked example, then leave the rest as clearly marked `// TODO(you):` comments for the owner to implement.
- **Explain before you code.** When introducing a new concept, API, or pattern (a GSAP method, an Astro directive, a TypeScript type, a Tailwind pattern), give a 2–3 sentence explanation of what it does and why we're using it, and link the relevant docs.
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
npm run dev        # start the Astro dev server (http://localhost:4321)
npm run build      # astro check + production build to dist/
npm run preview    # serve the production build
npm run check      # typecheck .astro/.ts/.tsx
```

When starting the dev server for a longer session, prefer background mode:
`astro dev --background`, managed with `astro dev stop|status|logs`.

Confirm these against package.json before relying on them; update this file if they change.

---

## Project structure

```
src/
  pages/
    index.astro          # the single long-scroll home page (file-based routing: this is `/`)
  layouts/
    Layout.astro         # <html>/<head> shell: meta tags, fonts, pre-paint theme script
  components/
    Avatar/              # the rigged avatar (React island)
      Avatar.tsx         # layered SVG, exposes refs for animatable parts
      avatar-source.svg  # source art (Figma export); not imported at runtime
    sections/
      Hero.tsx           # island — GSAP text intro
      About.tsx          # island — terminal typing state machine
      Work.astro         # static
      Skills.astro       # static
      Contact.astro      # static shell around the form island
      ContactForm.tsx    # island — form state
    ui/
      Cursor.astro       # dot + ring follower (<script>)
      Footer.astro
      HeroBackground.astro # drifting grid canvas (<script>)
      Reveal.astro       # scroll-in wrapper via <slot /> (<script>)
      SocialLinks.astro
      ThemeToggle.astro
  lib/
    gsap.ts              # registers ScrollTrigger/SplitText/ScrambleText — React-free
    gsap-react.ts        # adds useGSAP on top; for islands only
  styles/
    global.css           # Tailwind import + design tokens via @theme (v4 CSS-first)
public/                  # served as-is: icon.svg, og.png
```

This is a target, not a mandate — grow into it. Don't create empty folders ahead of need.

### The `.astro` vs React island rule

**Default to `.astro`.** Reach for a React island only when React is actually doing work — component state driving re-renders, or reconciliation. Refs + DOM + GSAP is not enough of a reason; that's what an Astro `<script>` is for.

Current split, and why:

| React island (`.tsx`) | Why React earns it                                |
| --------------------- | ------------------------------------------------- |
| `Avatar.tsx`          | large ref-driven component; kept as-is from Next  |
| `Hero.tsx`            | `useGSAP` scoping for the on-load timeline        |
| `About.tsx`           | real `useState` — typed text, revealed outputs    |
| `ContactForm.tsx`     | real `useState` — form fields + submit status     |

| `.astro` + `<script>`  | Why React wasn't needed              |
| ---------------------- | ------------------------------------ |
| `Cursor.astro`         | refs + window listeners, no state    |
| `HeroBackground.astro` | canvas + rAF, no state               |
| `ThemeToggle.astro`    | toggles a class; the UI is pure CSS  |
| `Reveal.astro`         | wraps children via `<slot />`        |

**Hydration is chosen at the call site**, not in the component: there's no `'use client'`, there's a `client:*` directive on the usage (`client:load` for above-the-fold/on-load animation, `client:visible` for anything below it). Prefer the laziest directive that still feels right.

A component's `<script>` is bundled and run **once per page**, not once per instance — so scripts query all matching elements (`[data-reveal]`, `[data-avatar-react]`) rather than closing over a single node.

---

## Next.js → Astro mapping

| Next.js                                | Astro                                                           |
| -------------------------------------- | --------------------------------------------------------------- |
| `app/layout.tsx`                       | `src/layouts/Layout.astro`                                      |
| `app/page.tsx`                         | `src/pages/index.astro`                                          |
| `app/globals.css`                      | `src/styles/global.css` (unchanged)                              |
| `export const metadata`                | hand-written `<meta>` tags in `Layout.astro`                     |
| `metadataBase`                         | `site` in `astro.config.mjs` → `Astro.site`                      |
| `next/font/google`                     | `fonts` in `astro.config.mjs` + `<Font>` from `astro:assets`     |
| `app/icon.svg`                         | `public/icon.svg` + an explicit `<link rel="icon">`              |
| `app/opengraph-image.tsx` (`next/og`)  | **static `public/og.png`** — see the open item below             |
| `'use client'`                         | a `client:*` directive at the call site                          |
| Server Components                      | `.astro` components (zero JS, not just no-client-JS)             |
| `process.env.NEXT_PUBLIC_X`            | `import.meta.env.PUBLIC_X`                                       |
| `@/*` → repo root                      | `@/*` → `src/` (tsconfig `paths`)                                |
| `next dev` on :3000                    | `astro dev` on :4321                                             |
| ESLint (`eslint-config-next`)          | `astro check` for now — no linter wired up yet                   |

**Open item — the OG image.** Next generated it from code (`next/og` = satori + resvg), so it stayed in sync with the content. Astro has no built-in equivalent, so it's currently a static `public/og.png` rendered once from the same design. To get code generation back, the options are `astro-og-canvas` or rolling an endpoint on `satori` + `@resvg/resvg-js` — **both add dependencies, so ask first.** Until then, regenerate `og.png` by hand if the name or tagline changes.

**Gotcha the port surfaced:** Astro strips whitespace that is only a newline plus indentation between text and an adjacent tag. Where a space matters between prose and an inline `<a>`, write it explicitly as `{' '}` (see `Footer.astro`).

---

## The avatar system (the heart of the project)

The avatar is a **layered SVG**: separate groups for eyes, pupils, head, arms, mouth, body — each reachable by `ref` so GSAP can animate them independently.

Core behaviours:

- `idle` — gentle breathing loop + occasional blink/fidget on a timer
- `track` — pupils/head follow the cursor (math, not a canned animation)
- intro — on-load pop + head-tilt/brow greeting
- `point` — head tilt + eyebrow raise when a section scrolls into view
- `react` — eyebrows perk on hover of `[data-avatar-react]`; a distinct "look over" for `="rail"`
- easter egg — boop per click, full spin every 5th

Rules:

- Only one "active" intentional animation at a time; cursor-tracking can run underneath idle.
- Every animation should have a _reason_ tied to a user action or app state. No animation for its own sake.
- Respect `prefers-reduced-motion`: fall back to a calm static avatar.
- `[data-avatar-react]` is the one shared definition of "interactive" on this site — both the avatar and the custom cursor read it. Add the attribute to new interactive elements rather than inventing a second list.

---

## Animation conventions (GSAP)

- **In islands:** use the **`useGSAP`** hook so cleanup is automatic — don't run raw `gsap.to` inside `useEffect` without cleanup. Import from `@/lib/gsap-react`.
- **In `.astro` `<script>` tags:** import from `@/lib/gsap` (never `gsap-react`), so the script doesn't pull React into its bundle.
- Plugins are registered once, in `src/lib/gsap.ts`. Don't register elsewhere.
- Prefer animating `transform` and `opacity` (cheap) over layout properties (expensive).
- Name timelines and refs descriptively (`heroWaveTl`, `leftPupilRef`).

Docs to lean on: GSAP (gsap.com/docs), ScrollTrigger, and the React integration (gsap.com/resources/React).

---

## Responsive design (mobile-first, always)

This site must work well on mobile from day one — not as a retrofit.

- **Write mobile-first Tailwind:** start with the base (smallest) layout, then layer `sm:`, `md:`, `lg:` overrides. Never write desktop-only styles and patch mobile later.
- **Test at 375px width** (iPhone SE — a common small baseline) and 768px (tablet) alongside desktop.
- Touch targets must be at least 44×44px (Apple HIG / WCAG guideline).
- No `hover:`-only interactions that have no touch equivalent. If something only works on hover, it must also work on tap/focus.
- The avatar's `track` state has no cursor on mobile — always pair it with a touch/scroll fallback.
- Avoid fixed pixel widths on containers; prefer `max-w-*` with `w-full` so content reflows naturally.

---

## Code conventions

- Functional components + hooks only in `.tsx`. No class components.
- One component per file; PascalCase for components (`.astro` or `.tsx`), camelCase `.ts` for hooks (`useThing.ts`).
- **TypeScript:** type `.astro` props with an `interface Props`; type React props with an explicit `type`. Avoid `any` (use `unknown` + narrowing). Note `verbatimModuleSyntax` is on — type-only imports need the `type` keyword.
- Keep components small; pull logic into hooks (islands) or `src/lib` (shared) when a component gets busy.
- **Styling:** Tailwind utility classes inline for layout and look. Reserve a CSS file only for `@keyframes` or states Tailwind can't express; GSAP handles the rest in JS.
- **Design tokens** (brand colors, fonts, spacing) live in `global.css` via Tailwind v4's `@theme` block — not a `tailwind.config.js` (v4 is CSS-first).
- Comments explain _why_, not _what_. Mark owner work with `// TODO(you):`.
- In `.astro` templates, prefer `{/* ... */}` for notes to ourselves — HTML comments (`<!-- -->`) ship to the browser.

---

## Build roadmap

Phases 0–6 were completed on the Next.js version; the feature set carried over intact. See `../krazyk-portfolio/CLAUDE.md` for that history. Current state:

- [x] **Port** — full Next → Astro migration: routing, layout, metadata, fonts, env vars, and the island/`.astro` split above. Verified: `astro check` clean, production build green, visual parity at 1440px and 390px.
- [ ] **Deploy the Astro build** to Vercel and compare against the Next deployment.
- [ ] **Lighthouse pass** — the Next version scored 100/100/100/100 desktop, 99/100/100/100 mobile. Re-measure; the static sections now ship no JS at all, so it should hold or improve.
- [ ] **OG image** — decide the approach (see the open item above).
- [ ] **Linting** — `astro check` covers types only. `eslint-plugin-astro` would restore the ESLint layer; a dependency, so ask first.

---

## Things to remember / gotchas

- The avatar must work on mobile where there's no cursor — `track` should degrade gracefully.
- **GSAP is browser-only.** In `.astro` files it must live inside a `<script>` tag, never in the frontmatter (which runs at build time on the server, where `window` doesn't exist).
- **`.astro` frontmatter runs at build time.** It has no `window`/`document`, and its values are baked into the HTML — that's why `Footer.astro` can call `new Date()` safely, and why `<script>` tags can't close over frontmatter variables (pass values through `data-*` attributes instead).
- **The pre-paint theme script needs `is:inline`.** Without it Astro hoists it into a deferred module bundle that runs after first paint — which is exactly the flash of the wrong theme we're avoiding.
- A component's `<script>` runs **once per page**, not once per instance. Query all matching elements.
- Module scripts are deferred, so the DOM is fully parsed when they run — including island markup, which Astro server-renders before hydrating the same nodes in place. That's why `Cursor.astro` can find `[data-avatar-react]` elements that live inside islands.
- Islands don't share React state with each other. Anything cross-island travels through the DOM or an event — plan for that before splitting a stateful feature across two islands.
- Watch GSAP double-mounting in React StrictMode — `useGSAP` handles cleanup; verify animations don't stack.
- Don't put real contact details or secrets in the repo.
- Update this file when conventions, commands, or structure change. A stale CLAUDE.md is worse than none.
