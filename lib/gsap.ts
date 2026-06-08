"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Register plugins once, on the client, in a single place. Registering useGSAP
// guards it against tree-shaking. ScrollTrigger gets added here in Phase 3.
gsap.registerPlugin(useGSAP);

// Import gsap/useGSAP from here (not directly) so registration always runs.
export { gsap, useGSAP };
