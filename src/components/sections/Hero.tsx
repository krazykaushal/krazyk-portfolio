import { useRef } from "react";

import { gsap, useGSAP, SplitText } from "@/lib/gsap-react";

const ROLE = "Software Engineer | AI/ML & Full Stack";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // On-load intro: eyebrow fades in, the name rises in char-by-char, the role
  // line decrypts/scrambles into place, then the CTAs fade in. gsap.from tweens
  // immediate-render their start state inside useGSAP's layout effect, so the
  // text starts hidden before paint — no flash of the final text.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Split the name into characters to stagger them. aria:"auto" keeps the
      // heading readable to screen readers (split spans hidden; original text
      // exposed as a label on the <h1>).
      const split = SplitText.create(nameRef.current, {
        type: "chars",
        aria: "auto",
      });

      // Hide the role until its turn — in JS, not CSS, so reduced-motion
      // visitors (who skip this effect) still see it.
      gsap.set(roleRef.current, { opacity: 0 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(eyebrowRef.current, { y: 12, opacity: 0, duration: 0.5 })
        .from(
          split.chars,
          {
            y: 44,
            opacity: 0,
            stagger: 0.035,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.2",
        )
        .set(roleRef.current, { opacity: 1 }, ">-0.1")
        .to(
          roleRef.current,
          {
            duration: 2,
            // scrambleText cycles random glyphs, then resolves to `text`.
            scrambleText: {
              text: ROLE,
              chars: "01!<>-_/[]{}=+*#",
              speed: 0.4,
              revealDelay: 0.3,
            },
          },
          "<",
        )
        .from(ctaRef.current, { y: 12, opacity: 0, duration: 0.5 }, "-=0.4");
    },
    { scope: containerRef },
  );

  return (
    // Text only — the avatar lives in a sticky lane at the page level
    // (see app/page.tsx) so it can stay in view while sections scroll past.
    <section
      ref={containerRef}
      id="hero"
      className="flex flex-col items-center px-6 pt-6 pb-16 text-center md:min-h-svh md:items-start md:justify-center md:px-16 md:py-0 md:text-left lg:px-24"
    >
      <p
        ref={eyebrowRef}
        className="mb-3 text-sm font-medium uppercase tracking-widest text-accent"
      >
        Hello, I&apos;m
      </p>

      <h1
        ref={nameRef}
        className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
      >
        Kaushal Patel
      </h1>

      <p className="mt-4 max-w-md text-base text-muted sm:text-lg">
        {/* Screen readers get the real role; the visible copy (aria-hidden)
            scrambles into place via ScrambleText. */}
        <span className="sr-only">{ROLE}</span>
        <span ref={roleRef} aria-hidden="true">
          {ROLE}
        </span>
      </p>

      <div
        ref={ctaRef}
        className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
      >
        <a
          href="#work"
          data-avatar-react
          className="rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-background transition-opacity hover:opacity-80"
        >
          See my work
        </a>
        <a
          href="#contact"
          data-avatar-react
          className="rounded-full border border-foreground/20 px-6 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:border-foreground/50"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
