// The React-flavoured entry point for GSAP. Import this from React islands;
// import `./gsap` from .astro `<script>` tags (see the note in that file).
//
// `useGSAP` is a drop-in `useLayoutEffect` that reverts every animation created
// inside it on cleanup — which matters in React StrictMode, where effects run
// twice in dev. https://gsap.com/resources/React
import { useGSAP } from '@gsap/react';

import { gsap, ScrollTrigger, SplitText } from './gsap';

// Registering useGSAP guards it against tree-shaking.
gsap.registerPlugin(useGSAP);

export { gsap, useGSAP, ScrollTrigger, SplitText };
