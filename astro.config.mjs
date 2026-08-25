// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import { loadEnv } from "vite";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

// This config file runs before Astro wires up `import.meta.env`, so we load the
// .env files ourselves. Vite's loadEnv also merges in real process env vars, so
// host-provided values (Vercel, Netlify, CI) win over anything in .env.
const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

// Canonical origin, used for absolute canonical/OG URLs (`Astro.site`).
// This is the Next `metadataBase` equivalent. It's baked in at build time, so
// set PUBLIC_SITE_URL in the host's env; on Vercel we fall back to the
// project's production domain, and locally to the dev server.
const site =
  env.PUBLIC_SITE_URL ||
  (env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:4321");

// https://astro.build/config
export default defineConfig({
  site,

  // Astro's Fonts API — the `next/font/google` replacement. Astro downloads the
  // files at build time, self-hosts them, and exposes each family as a CSS
  // variable that `global.css` maps onto Tailwind's --font-sans / --font-mono.
  // A weight *range* (rather than a list) pulls one variable font file covering it.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Nunito",
      cssVariable: "--font-nunito",
      // Nunito's variable axis is 200-1000 (Geist's was 100-900) — asking for a
      // range the family doesn't have is how you end up with a synthesized,
      // smeared bold instead of a real one.
      weights: ["200 1000"],
      subsets: ["latin"],
    },
    {
      provider: fontProviders.google(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      weights: ["100 900"],
      subsets: ["latin"],
    },
  ],

  // Markdown/MDX rendering options. Astro ships Shiki for code highlighting
  // with no extra dependency; `themes` (plural) makes it emit BOTH palettes in
  // one pass — the light colors as real CSS, the dark ones as `--shiki-dark-*`
  // custom properties. That pairs with our class-based dark mode: one flip of
  // .dark on <html> swaps the code colors with no JS and no second render.
  // MDX inherits this config, so `.mdx` posts get it for free.
  // https://docs.astro.build/en/guides/syntax-highlighting/
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  // Order matters here: mdx() comes *after* react() so that by the time MDX
  // sets up its JSX pipeline, the React renderer is already registered — that
  // is what lets a .mdx post import a React island and hydrate it with a
  // client:* directive, exactly like a page would.
  // https://docs.astro.build/en/guides/integrations-guide/mdx/
  integrations: [react(), mdx()],
});
