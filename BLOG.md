# Blog build sheet

The working agreement in `CLAUDE.md` applies: **you write every `.astro` and
`.tsx` file below.** This document is the spec — the file, its job, the exact
APIs it needs, and how to know it's done.

**Status: complete.** Steps 0–7 all shipped — see the commits from
`feat: scaffold MDX blog collection` through `feat: add site nav and RSS feed`.
Step 0 (the `src/lib/blog.ts` helpers) was written by the owner; Steps 1-7 were
implemented on request, each one committed on its own.

What's left of this document that still matters is **"Explicitly out of scope"**
at the bottom: those are decisions, and they're the reason none of it gets
re-litigated the next time the blog grows.

---

## What already exists

| File | What it gives you |
| --- | --- |
| `src/content.config.ts` | the `blog` collection + Zod schema. `getCollection('blog')` works, `CollectionEntry<'blog'>` is typed. |
| `src/content/blog/hello-world.mdx` | one real post, using every schema field and importing an `.astro` component mid-body |
| `src/content/blog/_TEMPLATE.mdx` | frontmatter reference; excluded from the collection by the glob pattern |
| `src/lib/blog.ts` | `formatPostDate` implemented; `getPublishedPosts`, `readingTime`, `allTags`, `postsByTag` are `TODO(you)` stubs that throw |
| `astro.config.mjs` | `mdx()` integration + dual light/dark Shiki themes |
| `src/styles/global.css` | `@plugin "@tailwindcss/typography"` + two `--tw-prose-*` overrides, rest TODO |

New dependencies added: `@astrojs/mdx`, `@astrojs/rss`, `@tailwindcss/typography`.
Nothing else gets added without discussing it first.

## Route map

```
/                       existing home page + new "Writing" teaser section
/blog                   post index          (avatar lane kept)
/blog/<slug>            one post            (no avatar — reading focus)
/blog/tags/<tag>        posts for one tag
/rss.xml                feed
```

---

## Step 0 — implement the lib stubs

`src/lib/blog.ts`. Each stub's doc comment walks through the algorithm. Delete
the `throw` line as you implement each one.

Do this first: every component below calls into these, and a stub that throws
gives you a clear error instead of a mysteriously empty page.

**Done when:** `npm run check` is clean and a throwaway
`console.log(await getPublishedPosts())` in a page prints one entry.

---

## Step 1 — `src/components/blog/PostCard.astro`

One post, as a card. Static, zero JS.

- Props: `interface Props { post: Post }`, with
  `import type { Post } from '@/lib/blog'` (type-only import — `verbatimModuleSyntax`
  is on, so the `type` keyword is required).
- Closest existing pattern is the project card in
  `src/components/sections/Work.astro` — same border/surface/hover treatment, so
  the blog doesn't look bolted on.
- Link target is `/blog/${post.id}` — `id` is the slug the glob loader derived
  from the filename.
- Show: title, `formatPostDate(post.data.pubDate)`, `readingTime(post)`,
  `post.data.description`, and the tags as pills.
- Add `data-avatar-react` so the avatar and the custom cursor both react to it.
  That attribute is the site's single definition of "interactive" — don't invent
  a second list.

**Two things to get right:**

1. **Don't wrap the whole card in an `<a>`.** The tag pills are themselves links
   to `/blog/tags/<tag>`, and a link inside a link is invalid HTML — browsers
   silently break the nesting and screen readers announce it wrong. Make the
   *title* the link and let the card be an `<li>`.
2. Wrap the date in `<time datetime={post.data.pubDate.toISOString()}>` so the
   machine-readable value travels with the human-readable one.

**Done when:** it renders in isolation from a scratch page without layout shift
at 375px, and the title link is a ≥44px tap target.

---

## Step 2 — `src/pages/blog/index.astro`

The post list.

- `const posts = await getPublishedPosts()` in the frontmatter (build time).
- `<Layout title="Writing — Kaushal Patel" description="...">`.
- Reuse the two-lane shell from `src/pages/index.astro` (sticky avatar lane +
  content lane) so `/blog` feels like the same site.
- Handle the empty case. It's one `posts.length === 0` branch now and it saves a
  confusing blank page later.

**A judgement call, deliberately left to you:** copying the two-lane shell means
the same markup lives in two files. Copy it anyway for now. If a *third* page
needs it, that's the moment to extract a `PageShell.astro` — two uses is not yet
evidence of the right abstraction, and CLAUDE.md says ask before refactoring.

**Done when:** the seed post appears, `astro dev` also shows `draft: true` posts,
and `npm run build` output does not contain them.

---

## Step 3 — `src/pages/blog/[...slug].astro`

One post. This is the page with the most new API surface.

- Use the **rest** param `[...slug]`, not `[slug]`. Glob-loader ids keep the
  folder structure, so a post at `src/content/blog/2026/notes.mdx` has the id
  `2026/notes` — a single param can't match a slash, a rest param can.
- `export async function getStaticPaths()` returns one object per post:
  `{ params: { slug: post.id }, props: { post } }`. Passing the whole entry
  through `props` means the page body doesn't have to look it up again.
- Rendering the body:
  ```astro
  const { post } = Astro.props;
  const { Content, headings } = await render(post);
  ```
  `render` is imported from `astro:content`. `Content` is a component — put
  `<Content />` where the body goes. `headings` is an array of the body's
  headings, ready for a table of contents if you want one later.
- **No avatar lane on this page.** A centered `max-w-3xl` column instead — the
  measure matters more than the mascot when someone is reading.
- Put `class="prose"` on the `<article>` wrapping `<Content />`. That's the hook
  the typography plugin and the token overrides in `global.css` attach to.
- Pass real per-post metadata to `Layout`: `title={post.data.title}` and
  `description={post.data.description}`.
- Header: title, date, read time, tags. Show `updatedDate` only when it exists.
- Footer: a "← Writing" link back to `/blog`.

**Small `Layout.astro` change this needs:** `og:type` is hardcoded to `"website"`.
A post should be `"article"`. Add an optional prop (e.g. `ogType?: string`
defaulting to `'website'`) rather than branching on the pathname — the caller
knows what it is, the layout shouldn't have to guess.

**Done when:** `/blog/hello-world` renders with styled headings, lists,
blockquote, a highlighted code block, and the imported `SocialLinks` component
inside the body — in both themes.

---

## Step 4 — `src/pages/blog/tags/[tag].astro`

Posts for one tag.

- `getStaticPaths` maps over `allTags(posts)`; pass the tag through `params` and
  the filtered posts through `props` so the page body does no work.
- Reuse `PostCard` — this page is Step 2 with a filter and a different heading.
- Tags land in a URL, so they must be URL-safe. Simplest defensible rule:
  **lowercase, hyphens, no spaces**, enforced by convention in frontmatter. If
  you'd rather allow arbitrary tag text, you need a slugify step and a reverse
  lookup — more machinery than this needs today.

**Done when:** `/blog/tags/astro` lists the seed post and `npm run build` emits
one HTML file per tag.

---

## Step 5 — `src/components/sections/Writing.astro`

The home-page teaser.

- `(await getPublishedPosts()).slice(0, 3)`.
- Same section shape as `Work.astro`: an `h2`, a grid of `PostCard`s, plus a
  "Read all →" link to `/blog`.
- Wire it into `src/pages/index.astro` wrapped in `<Reveal>`, like its siblings.
  Scroll order is a content decision — after `Work` reads naturally (projects,
  then writing about them), before `Skills`.
- If there are no posts, render nothing rather than an empty heading.

**Done when:** it appears in the home scroll, the avatar's `point` reaction fires
as the section enters view (that comes free from `data-avatar-react` on the
cards), and it ships zero JS.

---

## Step 6 — `src/components/ui/Nav.astro` (+ `Layout.astro` wiring)

The site is no longer single-page, so it needs a way across.

**The collision to solve first:** `ThemeToggle.astro` is
`fixed right-4 top-4 z-50` and its own comment says *"no nav bar to live in"* —
that comment is now wrong. At 375px the toggle is ~150px wide, which leaves
about 200px for navigation. Four links at 44px touch targets do not fit.

Suggested resolution (yours to accept or replace):

- `Nav.astro` owns the fixed bar; move `<ThemeToggle />` inside it and fix the
  stale comment.
- Mobile: one context-aware link — `writing →` on `/`, `← home` on `/blog*`.
- `sm:` and up: the full set.
- Anchors must be **absolute**: `/#work`, not `#work`. A bare `#work` from
  `/blog` links to nothing.
- `Astro.url.pathname` tells you which page you're on at build time. Use it for
  `aria-current="page"` on the active link too.
- Add `data-avatar-react` to the links.

**Done when:** every link works from both `/` and `/blog/hello-world`, nothing
overlaps at 375px, and keyboard focus rings are visible on all of it.

---

## Step 7 — `src/pages/rss.xml.ts`

The feed. A `.ts` endpoint, not a page.

```ts
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => { /* ... */ };
```

- `rss()` needs `title`, `description`, `site: context.site` (that's
  `Astro.site` from `astro.config.mjs` — RSS requires absolute URLs), and
  `items`.
- Map each post to `{ title, description, pubDate, link: \`/blog/${post.id}/\` }`.
- Add `<link rel="alternate" type="application/rss+xml" title="..." href="/rss.xml" />`
  to `Layout.astro`'s `<head>` so feed readers can discover it.

**Scope note:** metadata only — no full post content in the feed. Rendering MDX
to feed-safe HTML needs `sanitize-html` + `markdown-it`, i.e. two more
dependencies. Ask if you want them.

**Done when:** `/rss.xml` validates (paste it into
https://validator.w3.org/feed/) and every `<link>` is absolute.

---

## Applies to every step

- **Mobile-first.** Base classes are the small layout; `sm:`/`md:`/`lg:` are the
  additions. Check 375px and 768px, not just desktop.
- **Tokens, not raw colors.** `text-foreground`, `text-muted`, `bg-surface`,
  `text-accent`. No hex values in components.
- **`.astro` by default.** Nothing in this feature needs React — there's no
  component state anywhere in it. If you reach for a `.tsx` file, that's a signal
  to re-read the island rule in `CLAUDE.md` first.
- **`astro check` after every step.** It catches schema/type drift immediately,
  and it's the only linter this project has.

## Explicitly out of scope

Decided, so it doesn't get re-litigated mid-build:

- **Per-post OG images.** Posts inherit the static `/og.png`. Generating them is
  the open item already tracked in `CLAUDE.md`, and it's a bigger decision than
  this feature.
- **Sitemap.** `@astrojs/sitemap` is another dependency; not requested.
- **Full-content RSS.** See Step 7.
- **Pagination on `/blog`.** `paginate()` earns its place somewhere north of ~20
  posts. There is one.
- **Comments, view counts, search.** All need a backend. This site is static.
