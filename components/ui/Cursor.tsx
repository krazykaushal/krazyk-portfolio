"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

// A custom cursor: a solid dot that stays pinned to the pointer, plus an
// outlined ring that eases along behind it. The ring grows over interactive
// elements — we reuse the avatar's [data-avatar-react] set so "interactive"
// means one consistent thing across the site. Colors come from --foreground,
// so the cursor flips automatically with the light/dark toggle (it's a live
// CSS var — no MutationObserver needed).
//
// Mounted once in app/layout.tsx, next to <ThemeToggle />.
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Pointer-only: touch devices have no cursor, so we do nothing and leave the
    // native behavior alone. "(pointer: fine)" is true for a mouse/trackpad.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // Accessibility: with reduced motion we don't run a trailing follower —
    // keep the native cursor. (The divs stay opacity-0, so nothing shows.)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // We're taking over — hide the OS cursor everywhere (see globals.css).
    document.documentElement.classList.add("cursor-none");

    // Center each element on the pointer: x/y move the top-left corner, so we
    // offset by -50% of the element's own size. Set once; it composes with the
    // x/y tweens below and holds even when the ring scales up.
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    // Two quickTo setters per axis. The dot's short duration makes it feel
    // pinned; the ring's longer duration makes it trail. That speed gap *is*
    // the effect. (Set the dot's duration to 0 for a perfectly rigid dot.)
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

    // Fade the cursor in on the first move so it never flashes at (0,0).
    let revealed = false;
    const onMove = (e: MouseEvent) => {
      if (!revealed) {
        revealed = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    window.addEventListener("mousemove", onMove);

    // The ring's scale reflects two independent bits of state: whether we're
    // over an interactive element, and whether the mouse is pressed. Instead of
    // juggling competing tweens, we hold both as plain variables and let one
    // applyRing() compute the target from them. overwrite: "auto" means each
    // new call cleanly replaces the in-flight scale tween.
    let hoverScale = 1; // 1 = not hovering; set per element on enter
    let pressed = false;
    const applyRing = (duration = 0.3) =>
      gsap.to(ring, {
        scale: hoverScale * (pressed ? 0.72 : 1),
        duration,
        ease: "power2.out",
        overwrite: "auto",
      });

    // Grow the ring over interactive elements — the same [data-avatar-react]
    // set the avatar reacts to. The social rail (data-avatar-react="rail") gets
    // a slightly bigger swell, mirroring the avatar's larger "look over" there.
    const els = gsap.utils.toArray<HTMLElement>("[data-avatar-react]");
    const enter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      hoverScale = el.dataset.avatarReact === "rail" ? 2.2 : 1.8;
      applyRing();
    };
    const leave = () => {
      hoverScale = 1;
      applyRing();
    };
    els.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    // Click "press": snap the ring in on mousedown, ease it back on mouseup.
    // Because applyRing() derives the scale from state, the release lands on the
    // right size whether or not we're still hovering something.
    const down = () => {
      pressed = true;
      applyRing(0.12);
    };
    const up = () => {
      pressed = false;
      applyRing(0.35);
    };
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    // Cleanup: useGSAP reverts our tweens; we remove our own listeners + class.
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      document.documentElement.classList.remove("cursor-none");
    };
  });

  return (
    // aria-hidden: purely decorative, so screen readers skip it. opacity-0 until
    // the first move (see onMove). pointer-events-none so clicks pass through.
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-9999 h-2 w-2 rounded-full bg-foreground opacity-0"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-9999 h-8 w-8 rounded-full border border-foreground opacity-0"
      />
    </>
  );
}
