// GSAP core + plugin registration, framework-agnostic.
//
// Why this is split from `gsap-react.ts`: in Astro, GSAP is used from two very
// different places — React islands (via `useGSAP`) and plain `<script>` tags in
// .astro components. If registration lived in one module that also imported
// `@gsap/react`, every .astro `<script>` that touched GSAP would drag React
// into its bundle. So this file stays React-free and is the only thing an
// .astro `<script>` needs; React islands import `gsap-react.ts` instead, which
// layers `useGSAP` on top.
//
// Registering here (module scope) is safe because both consumers are
// client-only: Astro `<script>` tags never run on the server, and island code
// only executes in the browser.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

// SplitText + ScrambleText have been free since GSAP 3.13 and ship in the
// public npm package — they power the hero text intro.
gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

// Import from here (not from 'gsap' directly) so registration always runs first.
export { gsap, ScrollTrigger, SplitText };
