// Shared blog helpers. This is the `src/lib` half of the convention in
// CLAUDE.md: logic that more than one component needs lives here, so the
// components stay about markup.
//
// PAIRING NOTE: `formatPostDate` below is written out as the worked example —
// read it, then implement the four `TODO(you)` functions underneath it. Each
// stub throws, so if a component calls one before it's implemented you get a
// loud error instead of a silently blank page.

import type { CollectionEntry } from 'astro:content';

/**
 * One blog post entry, typed from the schema in `src/content.config.ts`.
 *
 * `CollectionEntry<'blog'>` is a generated type — change the Zod schema and
 * this follows automatically. The useful fields are:
 *   - `id`       the slug, derived from the filename ('hello-world')
 *   - `data`     the validated frontmatter (title, description, pubDate, ...)
 *   - `body`     the raw MDX source, before it's compiled
 * To get renderable HTML you call `render(entry)` from 'astro:content' in the
 * page, not here — rendering belongs to the component that displays it.
 */
export type Post = CollectionEntry<'blog'>;

/** Average adult reading speed, words per minute. Used by `readingTime`. */
const WORDS_PER_MINUTE = 200;

/**
 * Format a post date for display: `new Date('2026-08-24')` → "Aug 24, 2026".
 *
 * `Intl.DateTimeFormat` is the built-in the whole date-formatting-library
 * industry exists to wrap — it needs no dependency and knows every locale.
 * We pin the locale to 'en-US' rather than passing `undefined` (which would
 * use the runtime's locale) because this runs at BUILD time: whatever the
 * build machine's locale happens to be would get baked into the HTML.
 *
 * `timeZone: 'UTC'` matters for the same reason. A frontmatter date like
 * `2026-08-24` parses as midnight UTC, so formatting it in a timezone behind
 * UTC would render the 23rd.
 */
export function formatPostDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/**
 * Every post that should be visible, newest first.
 *
 * TODO(you): implement.
 *   1. `import { getCollection } from 'astro:content'` at the top of this file.
 *   2. `await getCollection('blog')` gives you every entry, unsorted.
 *      getCollection also takes an optional filter callback — that's the
 *      idiomatic place to drop drafts.
 *   3. Hide drafts in production only: `import.meta.env.PROD` is `true` during
 *      `astro build` and `false` in `astro dev`, so you keep writing drafts
 *      locally and they never ship.
 *   4. Sort by `pubDate` descending. Dates subtract into a number, so
 *      `b.data.pubDate.valueOf() - a.data.pubDate.valueOf()` is your comparator.
 *      Careful: `Array.prototype.sort` mutates and returns the same array — fine
 *      here since getCollection hands us a fresh one.
 *
 * https://docs.astro.build/en/reference/modules/astro-content/#getcollection
 */
export async function getPublishedPosts(): Promise<Post[]> {
  throw new Error('TODO(you): implement getPublishedPosts in src/lib/blog.ts');
}

/**
 * Estimated read time in whole minutes, minimum 1.
 *
 * TODO(you): implement.
 *   1. `post.body` is the raw MDX source and is typed as possibly `undefined`
 *      (not every loader provides one), so start with `post.body ?? ''`.
 *   2. Count words: split on whitespace and drop empty strings.
 *      `text.split(/\s+/).filter(Boolean).length` is enough.
 *   3. Divide by WORDS_PER_MINUTE and `Math.ceil`, then `Math.max(1, ...)` so a
 *      two-line post doesn't read "0 min".
 *
 * Known imprecision, and why we're accepting it: `body` is the source, so
 * import lines, JSX tags and code fences all count as words. That inflates a
 * code-heavy post. The honest alternatives are a remark plugin or an MDX AST
 * walk — both are more machinery than a "5 min read" badge deserves. If it
 * bothers you later, stripping lines matching /^import\s/ is a cheap 80% fix.
 */
export function readingTime(post: Post): number {
  throw new Error('TODO(you): implement readingTime in src/lib/blog.ts');
}

/**
 * Every distinct tag across the given posts, alphabetically.
 *
 * TODO(you): implement.
 *   1. `posts.flatMap((post) => post.data.tags)` flattens every tag array into
 *      one list. (`tags` has `.default([])` in the schema, so it's never
 *      undefined and needs no guard — that's the default earning its keep.)
 *   2. `new Set(...)` dedupes; spread it back into an array.
 *   3. `.sort()` — the default comparator is fine for plain lowercase strings.
 *
 * This feeds the tag pages' `getStaticPaths`, so it decides which URLs exist.
 */
export function allTags(posts: Post[]): string[] {
  throw new Error('TODO(you): implement allTags in src/lib/blog.ts');
}

/**
 * The subset of `posts` carrying `tag`, order preserved.
 *
 * TODO(you): implement — a one-line `filter` with `Array.prototype.includes`.
 * Decide whether the match should be case-sensitive. Simplest defensible
 * answer: lowercase both sides, and treat lowercase tags as the convention.
 */
export function postsByTag(posts: Post[], tag: string): Post[] {
  throw new Error('TODO(you): implement postsByTag in src/lib/blog.ts');
}
