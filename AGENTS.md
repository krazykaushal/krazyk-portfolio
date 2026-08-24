# AGENTS.md

Astro framework conventions for coding agents.

> **Read `CLAUDE.md` first.** It owns the project intent, the working agreement
> (this is a pairing/learning project — small diffs, explain before coding), the
> avatar design, and the Next.js → Astro mapping. This file only covers Astro
> framework specifics.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

Two more that this project leans on directly:

- [Client-side scripts](https://docs.astro.build/en/guides/client-side-scripts/) — the `<script>` behavior the non-island components rely on
- [Fonts](https://docs.astro.build/en/guides/fonts/) — the `next/font` replacement configured in `astro.config.mjs`
