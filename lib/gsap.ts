"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

// Register plugins once, on the client, in a single place. Registering useGSAP
// guards it against tree-shaking. SplitText + ScrambleText (free since GSAP
// 3.13) power the hero text intro.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin);

// Import these from here (not directly) so registration always runs first.
export { gsap, useGSAP, ScrollTrigger, SplitText };
