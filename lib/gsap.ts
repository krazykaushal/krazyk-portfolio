"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins once, on the client, in a single place. Registering useGSAP
// guards it against tree-shaking.
gsap.registerPlugin(useGSAP, ScrollTrigger);

// Import gsap/useGSAP/ScrollTrigger from here (not directly) so registration
// always runs first.
export { gsap, useGSAP, ScrollTrigger };
