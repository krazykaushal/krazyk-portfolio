// Formatting helpers shared across content collections.
//
// Why this file exists: `formatPostDate` lived in `blog.ts` and worked fine
// there — right up until `snippets.ts` needed the same formatting. Two callers
// is normally below the "extract on the third use" threshold, but the trigger
// here isn't the count, it's that the NAME would start lying: `snippets.ts`
// importing `formatPostDate` from `blog.ts` teaches you something false about
// how this code is organised. When a second caller makes the existing name
// wrong, that's the moment to move it.
//
// Everything collection-specific stays in blog.ts / snippets.ts / monthlog.ts.

/**
 * Format a date for display: `new Date('2026-08-24')` → "Aug 24, 2026".
 *
 * `Intl.DateTimeFormat` is the built-in that the whole date-formatting-library
 * industry exists to wrap — no dependency, and it knows every locale.
 *
 * The locale is pinned to 'en-US' rather than left as `undefined` (which would
 * use the runtime's locale) because this runs at BUILD time: whatever the build
 * machine's locale happens to be would otherwise get baked into the HTML.
 *
 * `timeZone: 'UTC'` matters for the same reason. A frontmatter date like
 * `2026-08-24` parses as midnight UTC, so formatting it in a timezone behind
 * UTC would render the 23rd.
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Format a `YYYY-MM` month for display: `'2026-08'` → "August 2026".
 *
 * Takes a string rather than a Date because that's how `monthlog` stores it —
 * `YYYY-MM` sorts correctly with a plain string comparison, so ordering needs no
 * Date at all. Only display does.
 *
 * The `-01T00:00:00Z` suffix is load-bearing. `new Date('2026-01')` parses as
 * midnight UTC, and formatting that in any timezone behind UTC renders
 * *December 2025* — a bug that only shows up in January and only for some
 * visitors. Spelling out the day and the Z, plus `timeZone: 'UTC'` below, makes
 * the whole path timezone-independent.
 *
 * Locale is pinned for the same reason as `formatDate`: this runs at build time.
 */
export function formatMonth(month: string): string {
  const date = new Date(`${month}-01T00:00:00Z`);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
