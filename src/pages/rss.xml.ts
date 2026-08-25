// The RSS feed. A `.ts` file under src/pages/ is an *endpoint*, not a page: it
// exports HTTP verb handlers instead of markup, and the filename is the whole
// route — so this file is literally `/rss.xml`.
//
// https://docs.astro.build/en/guides/rss/
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";

import { getPublishedPosts } from "@/lib/blog";
import { getPublishedMonths } from "@/lib/monthlog";

// `APIRoute` types the handler: `context` in, a Response out. With static output
// this runs once at build time and the returned body is written to disk as
// dist/rss.xml — the same build-time-not-request-time model as every page here.
export const GET: APIRoute = async (context) => {
  const [posts, months] = await Promise.all([
    getPublishedPosts(),
    getPublishedMonths(),
  ]);

  // `context.site` is the `site` value from astro.config.mjs (the Astro.site
  // equivalent for endpoints). RSS requires absolute URLs, so without it the
  // feed would be invalid — hence a real error rather than a silent fallback.
  // It's typed `URL | undefined` because `site` is optional in Astro; this guard
  // is how you satisfy that without an `!` assertion that just hides the case.
  if (!context.site) {
    throw new Error(
      "`site` must be set in astro.config.mjs — RSS needs it to build absolute URLs.",
    );
  }

  return rss({
    title: "Kaushal Patel — Writing",
    description:
      "Notes on building for the web — Astro, React, animation, and whatever I'm learning.",
    site: context.site,

    // Posts and monthlog entries, interleaved by date. Snippets stay out — a
    // reference library isn't a stream, and a burst of ten snippets would bury
    // everything else in a subscriber's reader.
    //
    // Metadata only, no bodies. Putting the rendered MDX in here means
    // sanitizing it for feed readers, which is `sanitize-html` + `markdown-it`
    // — two dependencies for a feature nobody has asked for yet.
    //
    // `link` is relative on purpose: rss() resolves each one against `site`, so
    // this is the one place we DON'T hand-build an absolute URL. The trailing
    // slash matches what the static build emits (/blog/<slug>/index.html).
    items: [
      ...posts.map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/blog/${post.id}/`,
        categories: post.data.tags,
      })),
      ...months.map((month) => ({
        title: month.data.title,
        // The feed spec wants a description; monthlog's is optional, so fall
        // back to something rather than emitting an empty element.
        description:
          month.data.description ?? `Monthlog for ${month.data.month}.`,
        // `month` is a YYYY-MM string, so build the Date explicitly at UTC
        // midnight on the 1st. `new Date('2026-01')` would render as December
        // 2025 anywhere behind UTC — same trap `formatMonth` guards against.
        pubDate: new Date(`${month.data.month}-01T00:00:00Z`),
        link: `/monthlog/${month.data.month}/`,
        categories: ["monthlog"],
      })),
      // Sort the merged list, so the feed reads chronologically rather than
      // all-posts-then-all-months. Each collection arrives already sorted, but
      // concatenating two sorted lists does not give you a sorted list.
    ].toSorted((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()),

    // Anything the RSS spec allows that the helper has no named option for goes
    // in as a raw XML string.
    customData: "<language>en-us</language>",
  });
};
