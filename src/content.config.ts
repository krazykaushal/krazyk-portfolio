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
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// `z` is Zod, the schema/validation library Astro bundles. It's also re-exported
// from 'astro:content', but that re-export is marked for removal, so we import
// from the stable path.
import { z } from 'astro/zod';

const blog = defineCollection({
  // The glob loader walks the filesystem and turns each matching file into an
  // entry, deriving the entry `id` from the path minus the extension —
  // `hello-world.mdx` → id `hello-world`. That id is what the post route's
  // [...slug] segment will use, so the filename IS the URL.
  //
  // The `[^_]` in the pattern means "first character is not an underscore",
  // which is how we keep `_TEMPLATE.mdx` (and anything in a `_drafts/` folder)
  // out of the collection entirely.
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/blog' }),

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
        tags: z.array(z.string()).default([]),

        // Hidden from production builds, visible in `astro dev`. The filtering
        // itself lives in src/lib/blog.ts, not here.
        draft: z.boolean().default(false),

        heroImage: image().optional(),
        heroImageAlt: z.string().optional(),
      })
      // Validation beyond types: an image without alt text is an accessibility
      // bug, so make it a build error rather than a thing to remember.
      .refine((data) => !data.heroImage || !!data.heroImageAlt, {
        message: 'heroImageAlt is required when heroImage is set',
        path: ['heroImageAlt'],
      }),
});

// The export name is the collection name: this is what makes
// getCollection('blog') work, and what types CollectionEntry<'blog'>.
export const collections = { blog };
