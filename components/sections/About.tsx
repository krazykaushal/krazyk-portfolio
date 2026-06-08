import type { ReactNode } from "react";

const em = (text: string) => (
  <span className="font-medium text-foreground">{text}</span>
);

const highlights: ReactNode[] = [
  <>Building scalable backend systems & AI integrations at {em("InfoAnalytica")}</>,
  <>Deep interest in {em("NLP, LLMs & ML pipelines")}</>,
  <>Currently exploring {em("RAG, MLOps & Vector Databases")}</>,
  <>Always learning, always shipping</>,
];

export default function About() {
  return (
    <section id="about" className="px-6 py-24 md:px-16 lg:px-24">
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        About
      </h2>

      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        Hi! I&apos;m Kaushal Patel, a software developer living at the
        crossroads of{" "}
        <span className="font-medium text-foreground">
          backend engineering, AI/ML, and data science
        </span>
        . I love building systems that are not just functional but genuinely{" "}
        <span className="font-medium text-foreground">
          intelligent and scalable
        </span>
        .
      </p>

      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {highlights.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span className="text-sm text-muted sm:text-base">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
