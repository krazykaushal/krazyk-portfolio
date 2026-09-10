// Content collections config. In Astro 5+ this file lives at `src/content.config.ts`
// (not inside src/content/), and it is the ONLY special-cased path — the post
// files themselves can live anywhere we point the loader at.
//
// Mental model: a collection is a typed table. The `loader` says where the rows
// come from, the `schema` says what shape a row must have. Astro validates every
// file against the schema at build time, so a typo'd frontmatter key fails the
// build instead of rendering `undefined` into the page. The schema is also where
// the TypeScript types come from — `CollectionEntry<'blog'>` is generated from it.
//
// https://docs.astro.build/en/guides/content-collections/
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

// `z` is Zod, the schema/validation library Astro bundles. It's also re-exported
// from 'astro:content', but that re-export is marked for removal, so we import
// from the stable path.
import { z } from "astro/zod";

const blog = defineCollection({
  // The glob loader walks the filesystem and turns each matching file into an
  // entry, deriving the entry `id` from the path minus the extension —
  // `hello-world.mdx` → id `hello-world`. That id is what the post route's
  // [...slug] segment will use, so the filename IS the URL.
  //
  // The `[^_]` in the pattern means "first character is not an underscore",
  // which is how we keep `_TEMPLATE.mdx` (and anything in a `_drafts/` folder)
  // out of the collection entirely.
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/blog" }),

  // Passing a function (instead of a plain object) gives us Astro's `image()`
  // helper, which validates that a referenced image exists and hands back an
  // optimized ImageMetadata object for <Image /> — the same treatment
  // src/assets images get. Only works for images under src/, not public/.
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),

        // Does triple duty: the card blurb, the page's <meta name="description">,
        // and the RSS item description. Keep it to ~1-2 sentences.
        description: z.string(),

        // YAML parses a bare `2026-08-24` into a Date, but a quoted one stays a
        // string — `coerce` accepts either and always hands us a real Date, so
        // sorting and formatting never have to guess.
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),

        // `.default([])` means downstream code can always call post.data.tags.map
        // without a null check — the default is applied during validation, and
        // the generated type is `string[]`, not `string[] | undefined`.
        tags: z
          .array(z.string())
          .default([])
          .transform((tags) => tags.map((t) => t.toLowerCase())),

        // Hidden from production builds, visible in `astro dev`. The filtering
        // itself lives in src/lib/blog.ts, not here.
        draft: z.boolean().default(false),

        heroImage: image().optional(),
        heroImageAlt: z.string().optional(),
      })
      // Validation beyond types: an image without alt text is an accessibility
      // bug, so make it a build error rather than a thing to remember.
      .refine((data) => !data.heroImage || !!data.heroImageAlt, {
        message: "heroImageAlt is required when heroImage is set",
        path: ["heroImageAlt"],
      }),
});

// ---------------------------------------------------------------------------
// snippets — a personal code reference. Different enough from `blog` to deserve
// its own schema: a snippet needs a language, and doesn't need a hero image or a
// reading time.
// ---------------------------------------------------------------------------
const snippets = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/snippets" }),

  // A plain object (not a function) because snippets have no images to
  // validate — the `image()` helper is the only reason `blog` needs the
  // function form.
  schema: z.object({
    title: z.string(),

    // One line: what this is for. Optional because some snippets are
    // self-explanatory from the title and the code.
    description: z.string().optional(),

    // A closed set, NOT z.string(). This is the whole reason for having a
    // language axis: writing `ts` one day and `typescript` the next would
    // silently produce a second browse page with one item in it. As an enum it
    // is a build error instead. Add a member when you write that language.
    language: z.enum(["typescript", "python", "bash", "css", "sql", "astro"]),

    // Free-form, for everything the language axis doesn't capture: work,
    // personal, a project name, a topic. Lowercased here so casing can never
    // fork a tag — same transform as `blog`, normalised once in the schema
    // rather than in every consumer.
    tags: z
      .array(z.string())
      .default([])
      .transform((tags) => tags.map((t) => t.toLowerCase())),

    // When it entered the library. `addedDate` rather than `pubDate` because
    // nothing here is "published" in the blog sense.
    addedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    // Where it came from, when it came from somewhere. Validating the format
    // means a typo'd link fails the build rather than shipping a dead anchor.
    //
    // `z.url()`, not `z.string().url()` — Astro bundles Zod 4, which moved the
    // string formats to top-level functions and deprecated the chained methods.
    // `astro check` flags the old spelling as a deprecation hint.
    //
    // `.default([])` rather than `.optional()`, same reasoning as `tags`: the
    // generated type is `string[]`, never `string[] | undefined`, so consumers
    // can go straight to `.length` / `.map` with no null check.
    source: z.array(z.url()).default([]),

    draft: z.boolean().default(false),
  }),
});

// ---------------------------------------------------------------------------
// monthlog — what I'm doing, one entry a month. Prose only.
//
// No `shipped`/`learning`/`goals` arrays: frontmatter arrays only earn their
// place when something *queries* them, and nothing here would. Markdown already
// has lists, so a month that wants bullets just writes them in the body.
// ---------------------------------------------------------------------------
const monthlog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/monthlog" }),

  schema: z.object({
    // Files are named `2026-08.mdx`, so the entry `id` is already "2026-08" —
    // the same value as this field. That redundancy is deliberate: the id is a
    // filesystem accident, while this is a declared value the schema can
    // validate. A file named `august.mdx` would give a "month" of `august`, and
    // this regex is what catches it.
    month: z.string().regex(/^\d{4}-\d{2}$/, "month must be YYYY-MM"),

    title: z.string(),

    // Used for the RSS item description when this lands in the feed.
    description: z.string().optional(),

    draft: z.boolean().default(false),
  }),
});

// The export names are the collection names: this is what makes
// getCollection('blog') work, and what types CollectionEntry<'blog'>.
export const collections = { blog, snippets, monthlog };
