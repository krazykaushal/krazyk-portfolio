// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import { loadEnv } from "vite";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

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
  // `weight: '100 900'` pulls the single variable font file for the whole range.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Geist",
      cssVariable: "--font-geist-sans",
      weights: ["100 900"],
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

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});
