"use client";

import { useEffect, useRef } from "react";

// Adapted from reactbits.dev "Squares": a faint grid of squares drifting slowly
// behind the hero. Canvas-based (no dependency) and ambient/non-interactive, so
// it never competes with the avatar's cursor tracking. The line color is read
// from our --foreground token (and re-read when the theme toggles), and the
// canvas is masked to fade out before the next section. Respects
// prefers-reduced-motion by drawing one static grid instead of animating.
type HeroBackgroundProps = {
  squareSize?: number;
  speed?: number; // px per frame the grid drifts (diagonally)
};

export default function HeroBackground({
  squareSize = 44,
  speed = 0.4,
}: HeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Grid color follows the theme: read --foreground so it's light lines on a
    // dark page and dark lines on a light one.
    let lineColor = "#888888";
    const readColor = () => {
      const fg = getComputedStyle(document.documentElement)
        .getPropertyValue("--foreground")
        .trim();
      if (fg) lineColor = fg;
    };

    const offset = { x: 0, y: 0 };
    let raf = 0;

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 0.08; // keep it faint
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      const ox = offset.x % squareSize;
      const oy = offset.y % squareSize;
      for (let x = -ox; x < w + squareSize; x += squareSize) {
        for (let y = -oy; y < h + squareSize; y += squareSize) {
          ctx.strokeRect(x, y, squareSize, squareSize);
        }
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      // Match the backing store to the display size × DPR for crisp 1px lines.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const tick = () => {
      offset.x += speed;
      offset.y += speed;
      draw();
      raf = requestAnimationFrame(tick);
    };

    readColor();
    resize();
    if (!reduced) raf = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    // Re-read the color (and redraw if static) whenever the theme class flips.
    const observer = new MutationObserver(() => {
      readColor();
      if (reduced) draw();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [squareSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-30 h-svh w-full mask-[linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)]"
    />
  );
}
