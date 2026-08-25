// Query helpers for the `snippets` collection. Mirrors blog.ts deliberately —
// same shape, different collection.
//
// These are intentionally NOT generic over the collection. A
// `getPublished<C extends CollectionKey>()` fights TypeScript hard (the entry
// type, the sort key and the draft field all vary) and buys nothing: a
// three-line sort duplicated across two files is cheaper than a bad
// abstraction. Note there's no `readingTime` here — it's meaningless for a
// snippet, so it stays in blog.ts.

import { getCollection, type CollectionEntry } from "astro:content";

/**
 * One snippet, typed from the schema in `src/content.config.ts`.
 *
 * The useful fields:
 *   - `id`               the slug, from the filename ('debounce')
 *   - `data.language`    one of the z.enum members — never an arbitrary string
 *   - `data.tags`        always string[], always lowercase (schema transform)
 *   - `body`            the raw MDX source, before it's compiled
 */
export type Snippet = CollectionEntry<"snippets">;

/**
 * Every snippet that should be visible, newest first.
 *
 * Drafts are dropped in production only: `import.meta.env.PROD` is a
 * compile-time constant, so in a build the predicate collapses to
 * `!entry.data.draft`, while `astro dev` keeps showing work in progress.
 *
 * `toSorted` rather than `sort` so the array `getCollection` handed us is never
 * mutated — it returns the sorted copy, which is what we return.
 */
export async function getPublishedSnippets(): Promise<Snippet[]> {
  const snippets = await getCollection(
    "snippets",
    (entry) => !import.meta.env.PROD || !entry.data.draft,
  );

  return snippets.toSorted(
    (a, b) => b.data.addedDate.valueOf() - a.data.addedDate.valueOf(),
  );
}

/**
 * Every language actually in use, alphabetically.
 *
 * This feeds the browse pages' `getStaticPaths`, so it decides which URLs
 * exist. Note it's derived from the *snippets*, not from the z.enum — a
 * language you've declared but never used generates no page, which is what you
 * want: no empty browse pages.
 */
export function allLanguages(snippets: Snippet[]): string[] {
  return [...new Set(snippets.map((snippet) => snippet.data.language))].sort();
}

/** The snippets written in `language`, order preserved. */
export function snippetsByLanguage(
  snippets: Snippet[],
  language: string,
): Snippet[] {
  return snippets.filter((snippet) => snippet.data.language === language);
}

/**
 * How many snippets each language has, for the filter row's counts.
 *
 * A Map rather than a plain object because the keys are data, not code — and a
 * Map won't collide with inherited Object properties if a language is ever
 * named something like `constructor`.
 */
export function languageCounts(snippets: Snippet[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const snippet of snippets) {
    const language = snippet.data.language;
    counts.set(language, (counts.get(language) ?? 0) + 1);
  }
  return counts;
}
