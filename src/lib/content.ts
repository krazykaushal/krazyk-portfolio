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
