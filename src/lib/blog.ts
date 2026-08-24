// Shared blog helpers. This is the `src/lib` half of the convention in
// CLAUDE.md: logic that more than one component needs lives here, so the
// components stay about markup.

import { getCollection, type CollectionEntry } from "astro:content";

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
export type Post = CollectionEntry<"blog">;

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
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Every post that should be visible, newest first.
 *
 * Drafts are dropped in production only: `import.meta.env.PROD` is a
 * compile-time constant, so in a build the predicate collapses to
 * `!entry.data.draft`, while `astro dev` keeps showing work in progress.
 *
 * `toSorted` rather than `sort` so the array `getCollection` handed us is never
 * mutated — it returns the sorted copy, which is what we return.
 *
 * https://docs.astro.build/en/reference/modules/astro-content/#getcollection
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const blogPosts = await getCollection(
    "blog",
    (entry) => !import.meta.env.PROD || !entry.data.draft,
  );

  const sortedBlogPosts = blogPosts.toSorted(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  return sortedBlogPosts;
}

/**
 * Estimated read time in whole minutes, minimum 1.
 *
 *
 * Known imprecision, and why we're accepting it: `body` is the source, so
 * import lines, JSX tags and code fences all count as words. That inflates a
 * code-heavy post. The honest alternatives are a remark plugin or an MDX AST
 * walk — both are more machinery than a "5 min read" badge deserves. If it
 * bothers you later, stripping lines matching /^import\s/ is a cheap 80% fix.
 */
export function readingTime(post: Post): number {
  const body = post.body ?? "";
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  return readTime;
}

/**
 * Every distinct tag across the given posts, alphabetically.
 * This feeds the tag pages' `getStaticPaths`, so it decides which URLs exist.
 */
export function allTags(posts: Post[]): string[] {
  return [...new Set(posts.flatMap((post) => post.data.tags))].sort();
}

/**
 * The subset of `posts` carrying `tag`, order preserved.
 */
export function postsByTag(posts: Post[], tag: string): Post[] {
  return posts.filter((post) => post.data.tags.includes(tag));
}
