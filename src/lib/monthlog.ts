// Query helpers for the `monthlog` collection. Smaller than blog.ts or
// snippets.ts because there's only one page to serve: /monthlog renders every
// month on one page, so there's no per-entry route and nothing to look up by id.

import { getCollection, type CollectionEntry } from "astro:content";

/**
 * One month's entry, typed from the schema in `src/content.config.ts`.
 * `id` and `data.month` are the same value — see the schema comment for why
 * both exist.
 */
export type MonthlogEntry = CollectionEntry<"monthlog">;

/**
 * Every visible month, newest first.
 *
 * Drafts are dropped in production only: `import.meta.env.PROD` is a
 * compile-time constant, so in a build the predicate collapses to
 * `!entry.data.draft`, while `astro dev` keeps showing work in progress.
 *
 * The sort is a plain string comparison, not a date comparison. `YYYY-MM` is
 * ISO-ordered, so lexicographic order IS chronological order — no Date parsing,
 * no timezone to get wrong. `localeCompare` with the arguments reversed gives
 * descending.
 */
export async function getPublishedMonths(): Promise<MonthlogEntry[]> {
  const months = await getCollection(
    "monthlog",
    (entry) => !import.meta.env.PROD || !entry.data.draft,
  );

  return months.toSorted((a, b) => b.data.month.localeCompare(a.data.month));
}

/** One year's worth of entries, for the calendar's year groupings. */
export type MonthlogYear = {
  year: string;
  entries: MonthlogEntry[];
};

/**
 * Group entries by year, newest year first, entries newest-first within a year.
 *
 * Relies on the input already being sorted (i.e. straight out of
 * `getPublishedMonths`): a Map preserves insertion order, so walking a
 * descending list produces descending years for free — no second sort, and no
 * chance of the year order and the within-year order disagreeing.
 *
 * The year is sliced off the `YYYY-MM` string rather than parsed as a Date. Same
 * reasoning as the sort: the format is fixed by the schema regex, so string
 * operations are exact and can't drift by a timezone.
 */
export function groupByYear(entries: MonthlogEntry[]): MonthlogYear[] {
  const byYear = new Map<string, MonthlogEntry[]>();

  for (const entry of entries) {
    const year = entry.data.month.slice(0, 4);
    const bucket = byYear.get(year);
    if (bucket) {
      bucket.push(entry);
    } else {
      byYear.set(year, [entry]);
    }
  }

  return [...byYear].map(([year, yearEntries]) => ({
    year,
    entries: yearEntries,
  }));
}
