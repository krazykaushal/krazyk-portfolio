"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
};

// Wraps any content and fades/slides it up the first time it scrolls into view.
// Server-rendered children pass straight through; only this wrapper is client.
export default function Reveal({ children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // Reduced motion: leave content in its natural, visible state.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // gsap.from animates FROM these values TO the element's natural state
      // (opacity 1, y 0). The scrollTrigger ties that playback to scroll.
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%", // when el's top hits 80% down the viewport
          once: true, // reveal once, then stop watching
        },
      });
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
