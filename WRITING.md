# Writing build sheet

Companion to `BLOG.md`. That one is finished and is now mostly a record of
decisions; this one is live.

The working agreement in `CLAUDE.md` applies. Steps are ordered so each one is
independently verifiable and the tree is green after every commit.

---

## What this is

Three kinds of writing, one hub. The blog already exists; this sheet adds the
other two and the hub that ties them together.

| Kind | Collection | For whom | Body |
| --- | --- | --- | --- |
| Posts | `blog` (built) | other people | prose |
| Code reference | `snippets` (new) | me, later | fenced code |
| Life updates | `monthlog` (new) | me, publicly | prose |

## Decisions already made

Locked, so they don't get re-litigated mid-build:

- **Four collections, not one with a `type` field.** A snippet needs a language,
  a monthlog entry needs a month. Separate Zod schemas mean bad frontmatter
  fails the build per-kind, and each gets its own `CollectionEntry<>`.
- **Top-level routes.** `/blog` does not move. This whole sheet is additive.
- **The hub is the home-page Writing section**, redesigned. There is no
  `/writing` page, and `Nav.astro` keeps pointing at `/#writing`.
- **`monthlog` is prose only** — no `shipped`/`learning`/`goals` arrays.
  Frontmatter arrays only earn their place when something *queries* them, and
  nothing would. Markdown already has lists.
- **`snippets.language` is a `z.enum`**, not a string. That is the entire reason
  for choosing a language axis over free tags.
- **No notes/quotes collection.** Dropped, deliberately. See out of scope.

## What already exists and gets reused

| Thing | Where | Reused how |
| --- | --- | --- |
| `glob()` loader + Zod pattern | `src/content.config.ts` | two more collections, same shape |
| `getStaticPaths` + `render()` | `src/pages/blog/[...slug].astro` | the snippet detail page is this again |
| tag-page pattern | `src/pages/blog/tags/[tag].astro` | language browse pages are this again |
| `.prose` + Shiki dual themes | `src/styles/global.css` | snippet code blocks, for free |
| card treatment | `src/components/blog/PostCard.astro` | `SnippetCard.astro` mirrors it |
| `pointer-coarse:` touch targets | `PostCard.astro` | same trick for language pills |

## Route map

```
/                                   home — the Writing section becomes the hub
/blog                               unchanged
/blog/<slug>                        unchanged
/blog/tags/<tag>                    unchanged
/snippets                           index + language filter row
/snippets/<slug>                    one snippet
/snippets/languages/<language>      browse by language
/monthlog                           the calendar — a card per month, grouped by year
/monthlog/<YYYY-MM>                 one month's entry
/rss.xml                            gains monthlog items
```

### ⚠️ The route collision this map avoids

The obvious layout is `/snippets/<slug>` for detail and `/snippets/<language>`
for browse. **Don't.** Both are one dynamic segment under `/snippets`, so a
snippet whose slug happens to be `python` and the `python` language page resolve
to the same URL — a duplicate-path build error, and only once you happen to name
a file that way. Nesting the browse axis at `/snippets/languages/<language>`
removes the possibility entirely, and mirrors `/blog/tags/<tag>`.

---

# Phase A — snippets

## Step 1 — the `snippets` collection

`src/content.config.ts`, alongside `blog`.

```ts
const snippets = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/snippets' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),   // one line: what it's for
    language: z.enum(['typescript', 'python', 'bash', 'css', 'sql', 'astro']),
    tags: z.array(z.string()).default([]).transform((t) => t.map((s) => s.toLowerCase())),
    addedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    source: z.string().url().optional(),  // where you found it, if anywhere
    draft: z.boolean().default(false),
  }),
});
```

- Add `snippets` to the `collections` export — that's what makes
  `getCollection('snippets')` and `CollectionEntry<'snippets'>` exist.
- `z.enum` over `z.string()`: writing `ts` one day and `typescript` the next
  would silently create a second browse page with one item in it. The enum makes
  that a build error. Extend the list when you write your first Rust snippet.
- `tags` gets the same `.toLowerCase()` transform as `blog` — normalise once, in
  the schema, not in every consumer.
- Seed `src/content/snippets/debounce.mdx` with a real fenced ` ```ts ` block,
  plus `_TEMPLATE.mdx` (the `[^_]` glob keeps it out of the collection).

**Done when:** `npm run check` is clean, AND you have *deliberately* set
`language: ts` in the seed once and watched the build fail. Verifying the guard
works is the point of having it.

---

## Step 2 — `src/lib/content.ts` and `src/lib/snippets.ts`

**`content.ts` — the genuinely shared bits.** Move `formatPostDate` out of
`blog.ts` and rename it `formatDate`, then update its two callers
(`PostCard.astro` and `blog/[...slug].astro`).

This is below the usual "extract on the third use" threshold on purpose. The
trigger here isn't the count, it's that **the name would start lying**:
`snippets.ts` importing `formatPostDate` from `blog.ts` teaches you something
false about how the code is organised. When a second caller makes the existing
name wrong, that's the moment to move it.

**`snippets.ts` — its own file, mirroring `blog.ts`:**

```ts
export type Snippet = CollectionEntry<'snippets'>;
export async function getPublishedSnippets(): Promise<Snippet[]>   // drafts hidden in PROD only, newest addedDate first
export function allLanguages(snippets: Snippet[]): string[]        // distinct, sorted — decides which browse URLs exist
export function snippetsByLanguage(snippets: Snippet[], language: string): Snippet[]
export function allSnippetTags(snippets: Snippet[]): string[]      // for display counts only, no routes yet
```

Do **not** try to write a generic `getPublished<C extends CollectionKey>()`. It
fights TypeScript hard and buys you nothing — a duplicated three-line sort is
cheaper than a bad abstraction. `readingTime` stays in `blog.ts`; it's
meaningless for a snippet.

**Done when:** `npm run check` is clean and a throwaway
`console.log(allLanguages(await getPublishedSnippets()))` prints the one language
you seeded.

---

## Step 3 — `src/components/snippets/SnippetCard.astro`

One snippet, as a card. Static, zero JS.

- Props: `{ snippet: Snippet; headingLevel?: 2 | 3; class?: string }` — the same
  three-prop shape as `PostCard`, for the same reasons. Type-only import for
  `Snippet` (`verbatimModuleSyntax`).
- Renders exactly one `<li>`; the caller owns the `<ul>` and its grid.
- Show: title (the link, to `/snippets/${snippet.id}`), a **language badge**,
  `description`, `formatDate(addedDate)`, and tags.
- Match `PostCard`'s border/surface/hover treatment so the two grids read as one
  site.
- `data-avatar-react` on the `<li>`.

**Two things to get right:**

1. **Tags render as plain `<li>` pills, not links.** `/snippets/tags/<tag>`
   doesn't exist and isn't in this sheet — linking to it would ship a broken
   link. Pills that aren't links also sidestep the nested-anchor problem
   `PostCard` had to work around.
2. The language badge should be visually distinct from a tag pill, because one is
   a required taxonomy and the other is free-form. Give the badge the accent
   treatment and leave tags muted.

**Done when:** it renders from `/snippets` with no nested anchors (`max nesting:
1`) and the title link is a ≥44px tap target at 375px.

---

## Step 4 — `src/pages/snippets/index.astro`

The snippet list, plus the way into the language pages.

- `getPublishedSnippets()` in frontmatter.
- A **centered `max-w-4xl` column**, like `/blog/tags/<tag>` — not the two-lane
  avatar shell. See the judgement call below.
- A filter row above the grid: one pill per language from `allLanguages()`,
  linking to `/snippets/languages/<language>`, each with its count. Use the
  `pointer-coarse:` trick from `PostCard`'s tags for the touch targets.
- Grid of `SnippetCard`s at `headingLevel={2}` (the page owns the `h1`).
- Handle `snippets.length === 0`.

**A judgement call, deliberately left to you:** `/blog` uses the two-lane sticky
avatar shell, and `blog/index.astro` says in a comment that a *third* page
wanting it is the moment to extract `PageShell.astro`. This page is that third
candidate. The sheet says centered-column instead — which dodges the decision
rather than making it. If you'd rather these listing pages all carry the avatar,
extract `PageShell.astro` with a `<slot />` for the content lane **first**, then
use it in all three. Don't paste the shell a third time.

**Done when:** `/snippets` lists the seed snippet, the language pill shows the
right count, and `astro dev` also shows `draft: true` snippets while the
production build hides them.

---

## Step 5 — `src/pages/snippets/languages/[language].astro`

Snippets for one language. This is `/blog/tags/[tag].astro` again — second rep.

- `getStaticPaths` maps over `allLanguages(snippets)`; pass the language through
  `params` and the filtered list through `props` so the page body does no work.
- `[language]`, a **single** param, not a rest param. Languages come from a
  `z.enum` so they can never contain a slash. Use the narrower pattern when the
  data allows it.
- Reuse `SnippetCard`.
- No empty state needed: the URLs are derived from the data, so a language page
  with zero snippets is unreachable by construction.

**Done when:** `npm run build` emits exactly one HTML file per language *in use*
— not one per enum member. Add a second language to the seed set and watch a new
page appear.

---

## Step 6 — `src/pages/snippets/[...slug].astro`

One snippet. Structurally `blog/[...slug].astro` with different metadata.

- Rest param, same reasoning as the blog: glob ids keep folder structure, so
  `[...slug]` survives you deciding to nest snippets later. Costs nothing now.
- `const { Content } = await render(snippet)`.
- Header **outside** `.prose`: title, language badge, `addedDate`,
  `updatedDate` only when present, `source` as an outbound link when present.
  Keeping it out of `.prose` matters — the plugin's `:where()` selectors sit at
  the same specificity as a Tailwind utility, so a `font-mono text-xs` on a `<p>`
  in there is decided by stylesheet order.
- Body: `<div class="prose max-w-none">` around `<Content />`. `max-w-none`
  because `prose` sets its own `65ch` and the container should own the measure.
- `ogType="article"` on `Layout`.
- No avatar lane. Centered `max-w-3xl`.

**Done when:** the fenced block is syntax-highlighted **in both themes** (that's
the `.dark .astro-code` rule in `global.css` doing its job), and the page ships
zero external JS.

---

# Phase B — monthlog

## Step 7 — the `monthlog` collection

```ts
const monthlog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/monthlog' }),
  schema: z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/, 'month must be YYYY-MM'),
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});
```

- Files are named `2026-08.mdx`, so the entry `id` is `2026-08` — the same value
  as `month`. **That redundancy is deliberate:** the id is a filesystem accident,
  the field is a declared value the schema can validate. A file named
  `august.mdx` would give you a "month" of `august`; the regex catches it.
- `month` is a **string, not a Date**. `YYYY-MM` sorts correctly with a plain
  string comparison, so ordering needs no Date at all — only display does.
- Seed `src/content/monthlog/2026-08.mdx` + `_TEMPLATE.mdx`.

**Done when:** `npm run check` is clean, and a file with `month: 2026-8` (no
leading zero) fails the build.

---

## Step 8 — `formatMonth` + `src/lib/monthlog.ts`

Add to `content.ts`:

```ts
export function formatMonth(month: string): string   // '2026-08' → 'August 2026'
```

Build the Date explicitly and format it with `Intl.DateTimeFormat`:

```ts
const d = new Date(`${month}-01T00:00:00Z`);
return new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
}).format(d);
```

Both the pinned locale and `timeZone: 'UTC'` matter for the same reason they do
in `formatDate`: this runs at **build** time, so the build machine's locale and
timezone would otherwise get baked into the HTML.

`monthlog.ts`:

```ts
export type MonthlogEntry = CollectionEntry<'monthlog'>;
export async function getPublishedMonths(): Promise<MonthlogEntry[]>   // newest first
```

Sort with `b.data.month.localeCompare(a.data.month)` — no Date parsing needed.

**Done when:** `formatMonth('2026-08') === 'August 2026'`, and check `'2026-01'`
too (a naive `new Date('2026-01')` in a negative-offset timezone renders
December).

---

## Step 9 — the calendar and the month pages

**Revised after the first build.** The original spec here was one page rendering
every month inline with `#2026-08` anchors. It shipped, then got replaced with a
calendar index plus a page per month. The old version is in git history if you
want to compare; what follows is what's actually built.

### `src/pages/monthlog/index.astro` — the calendar

- `groupByYear(await getPublishedMonths())` → `{ year, entries }[]`, newest year
  first. The grouping relies on the input already being sorted: a `Map` preserves
  insertion order, so walking a descending list produces descending years with no
  second sort — and no way for the year order and the within-year order to
  disagree.
- Only months that **exist** get a card. No dimmed placeholder cells for months
  you didn't write, so the grid looks right from the first entry instead of after
  a year of them.
- Each year is a `<section>` with the year as a real `<h2>` (it's a section of the
  archive, and it's what someone navigating by headings would use), a hairline
  rule under it, then a `<ul>` grid at `sm:grid-cols-2 lg:grid-cols-3`.
- This page renders **no MDX at all** — it's navigation. The content lives on the
  month pages.

### `src/components/monthlog/MonthCard.astro` — the tile

- **The whole card is the link.** `PostCard` couldn't do that because its tag
  pills are links and a link inside a link is invalid HTML; there is nothing else
  interactive in a month tile, so the entire target is clickable and the 44px
  touch minimum comes free.
- `group` on the `<li>` plus `group-hover:` inside coordinates one hover state
  across the whole tile: an accent rail scales in from the top-left
  (`origin-top scale-y-0 → scale-y-100`, a transform so it composites, unlike
  animating height), the month number and name pick up the accent, and the `Read
  →` arrow slides.
- `line-clamp-2` on the title (core Tailwind in v4, no plugin) plus `h-full` on
  the anchor keeps every tile in a row the same height whatever the title length.
- `mt-auto` pins the `Read →` affordance to the bottom so it lines up across a
  row.
- Shows the month **number** in mono and the month **name** large. The year is
  the group heading above, so repeating it in the card would be noise.

### `src/pages/monthlog/[month].astro` — one month

- `[month]`, a **single** param — not the `[...slug]` rest param blog and
  snippets use. Those need a rest param because glob ids keep folder structure
  and can contain a slash. A month is `YYYY-MM`, enforced by the schema regex, so
  it's always exactly one segment. Use the narrower pattern when the data
  guarantees it.
- Adjacent-month links are computed in `getStaticPaths`, not in the page body —
  that's the only place with the whole sorted list in hand.
- **`?? null` on the adjacent lookups is load-bearing, and TypeScript will not
  tell you so.** `noUncheckedIndexedAccess` is off in this project, so
  `months[-1]` types as `MonthlogEntry` while being `undefined` at runtime.
  Without the coalesce the first and last months render a link to
  `/monthlog/undefined`.
- Older left, newer right, via `mr-auto` / `ml-auto` on the links themselves so a
  lone link still lands on its correct side. An empty spacer span would be
  fragile.
- Body headings start at `##` here: the entry title is the `h1` on this page. (On
  the old single-page version they had to be `###`; that constraint is gone, and
  `_TEMPLATE.mdx` says so.)

**Done when:** the calendar shows year groups newest-first; a month with no
neighbour on one side renders one link, not a broken one; no `/monthlog/undefined`
appears in any built page; and the outline is `h1 → h2` on a month page and
`h1 → h2 (year) → h3 (month)` on the calendar.

---

# Phase C — wiring

## Step 10 — the hub: rewrite `src/components/sections/Writing.astro`

From "h2 + three `PostCard`s" to a three-card category grid.

- `grid-cols-1 md:grid-cols-3`.
- Each card: name, one line of what-it-is, a **live count**
  (`(await getCollection('snippets')).length`), the newest item's title as a
  teaser, and a link to the route.
- Keep the `posts.length === 0` instinct, generalised: a card whose collection is
  empty should say so rather than render a blank teaser line.
- Cards keep `data-avatar-react`.

You lose the three-post teaser. The per-card "latest" line carries most of its
value and `/blog` is one click away.

**Done when:** the three counts match `npm run build`'s actual page counts, the
section still ships zero JS, and it reads at 375px (three cards stacked).

---

## Step 11 — `src/components/ui/Nav.astro`

Two lines. The mobile context link keys off
`onBlog = pathname === '/blog' || pathname.startsWith('/blog/')`, so from
`/snippets` it currently offers `writing →` when it should offer `← writing`.

Generalise to a prefix list: `/blog`, `/snippets`, `/monthlog`. The desktop links
don't change — they're still three in-page anchors, and `writing` still points at
`/#writing`.

**Done when:** `← writing` appears on the mobile bar from all three sections'
pages, and `writing →` still appears on `/`.

---

## Step 12 — `src/pages/rss.xml.ts`

Add monthlog to the existing feed. Snippets stay out — a reference library isn't
a stream.

- Map monthlog entries to feed items. Each month has a real route now, so the
  link is that page — not an anchor:

```ts
items: months.map((m) => ({
  title: m.data.title,
  description: m.data.description ?? '',
  pubDate: new Date(`${m.data.month}-01T00:00:00Z`),
  link: `/monthlog/${m.data.month}/`,
}))
```

- Merge with the post items and sort the combined list by `pubDate` descending,
  so the feed reads chronologically rather than posts-then-updates.

**Done when:** `/rss.xml` still parses as XML, every `<link>` is absolute, and
items from both collections are interleaved by date.

---

## Applies to every step

- **Mobile-first.** Base classes are the small layout; `sm:`/`md:`/`lg:` are
  additions. Check 375px and 768px.
- **Tokens, not raw colors.** `text-foreground`, `text-muted`, `bg-surface`,
  `text-accent`.
- **`.astro` by default.** Nothing in this feature needs React — there is no
  component state anywhere in it.
- **`npm run check` after every step**, and a real `npm run build` before any
  claim that a route works. It's the only linter this project has.
- **Verify the guards, not just the happy path.** A `z.enum` you never watched
  reject a bad value is a guard you're only assuming works.

## Explicitly out of scope

Decided, so it doesn't get re-litigated mid-build:

- **A notes/quotes collection.** Considered and dropped. Two monthly collections
  (`notes` and `monthlog`) would have created a "which one does this go in?"
  decision every time. If you want it later, `monthlog` already has the key it
  would share.
- **Goal tracking.** Removed from the monthlog schema. Reintroducing it means
  goals carrying forward month to month, which is a real query, not a field.
- **Snippet tag pages** (`/snippets/tags/<tag>`). Tags render as labels until the
  library is big enough that language alone stops being enough to find things.
- **Copy-to-clipboard on snippets.** Tempting, and it would be the first genuine
  reason for a `<script>` on that page. Not now.
- **A `/writing` page.** The home-page section is the hub; the nav scrolls to it.
- **Pagination.** `paginate()` earns its place somewhere north of ~20 items.
- **Per-item OG images.** Same open question already tracked in `CLAUDE.md`.
