"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const em = (text: string) => (
  <span className="font-medium text-foreground">{text}</span>
);

// The commands we type out, each paired with the output it reveals.
const commands = ["whoami", "cat highlights.txt"];

const whoamiOutput = (
  <p>
    Hi! I&apos;m Kaushal Patel, a software developer living at the crossroads
    of {em("backend engineering, AI/ML, and data science")}. I love building
    systems that are not just functional but genuinely{" "}
    {em("intelligent and scalable")}.
  </p>
);

const highlights: ReactNode[] = [
  <>Building scalable backend systems & AI integrations at {em("InfoAnalytica")}</>,
  <>Deep interest in {em("NLP, LLMs & ML pipelines")}</>,
  <>Currently exploring {em("RAG, MLOps & Vector Databases")}</>,
  <>Always learning, always shipping</>,
];

const highlightsOutput = (
  <ul className="space-y-1">
    {highlights.map((item, i) => (
      <li key={i}>
        <span aria-hidden className="select-none text-accent">
          •{" "}
        </span>
        {item}
      </li>
    ))}
  </ul>
);

const outputs = [whoamiOutput, highlightsOutput];

// Prompt prefix and cursor are chrome: aria-hidden + select-none so they're
// neither read aloud nor copied.
const Prompt = () => (
  <span aria-hidden className="select-none text-accent">
    ${" "}
  </span>
);

const Cursor = () => (
  <span
    aria-hidden
    className="ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] animate-pulse bg-foreground"
  />
);

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  const [typed, setTyped] = useState<string[]>(() => commands.map(() => ""));
  const [shown, setShown] = useState<boolean[]>(() => commands.map(() => false));
  const [done, setDone] = useState(false);

  // Start the sequence when the section scrolls into view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The sequence: type each command char by char, reveal its output, repeat.
  // The cancelled flag stops it cleanly if we unmount mid-run.
  useEffect(() => {
    if (!started) return;
    let cancelled = false;

    (async () => {
      // Reduced motion: skip the typing and show the full output at once.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTyped(commands);
        setShown(commands.map(() => true));
        setDone(true);
        return;
      }

      for (let i = 0; i < commands.length; i++) {
        const full = commands[i];
        for (let c = 1; c <= full.length; c++) {
          if (cancelled) return;
          setTyped((prev) => {
            const next = [...prev];
            next[i] = full.slice(0, c);
            return next;
          });
          await sleep(45 + Math.random() * 35); // jittered keystrokes feel human
        }
        await sleep(250); // a beat before the command "runs"
        if (cancelled) return;
        setShown((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        await sleep(450);
      }
      if (!cancelled) setDone(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [started]);

  // Which command line shows the cursor: the first not-yet-run one whose
  // predecessor has finished. -1 once everything is done.
  const activeCmd =
    started && !done
      ? shown.findIndex((s, i) => !s && (i === 0 || shown[i - 1]))
      : -1;

  return (
    <section ref={sectionRef} id="about" className="px-6 py-24 md:px-16 lg:px-24">
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        About
      </h2>

      {/* Terminal-style window. Colors come from theme tokens so it adapts to
          light/dark; only the traffic-light dots are fixed. The blinking cursor
          uses animate-pulse, which the reduced-motion net in globals.css
          neutralizes. */}
      <div className="mt-6 max-w-2xl overflow-hidden rounded-lg border border-foreground/10 bg-surface font-mono text-sm shadow-lg">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-foreground/10 bg-foreground/5 px-4 py-2.5">
          <span aria-hidden className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </span>
          <span className="ml-2 text-xs text-muted">
            kaushal@portfolio: ~/about
          </span>
        </div>

        {/* Body */}
        <div className="space-y-4 px-4 py-4 leading-relaxed text-muted sm:px-5">
          {commands.map((_, i) => (
            <div key={i}>
              {/* Command line is chrome (aria-hidden); SR gets the output. */}
              <p aria-hidden>
                <Prompt />
                <span className="text-foreground">{typed[i]}</span>
                {activeCmd === i && <Cursor />}
              </p>
              {/* Output stays in the DOM (real content for SR + crawlers, and
                  no layout shift); only its visibility animates. */}
              <div
                className={`mt-1 transition-opacity duration-300 ${
                  shown[i] ? "opacity-100" : "opacity-0"
                }`}
              >
                {outputs[i]}
              </div>
            </div>
          ))}

          {/* Idle prompt once everything has run. */}
          {done && (
            <p aria-hidden>
              <Prompt />
              <Cursor />
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
