// Skills grouped by category. This is one level "deeper" than the Work data:
// an array of groups, each holding its own `items` array. We map over groups,
// then over each group's items.
//
// TODO(you): these lists are inferred from your projects + About section.
// Edit them — add what's missing, remove what you don't want to claim.
type SkillGroup = {
  label: string;
  items: string[];
};

const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "SQL"],
  },
  {
    label: "Frameworks & Libraries",
    items: [
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "Tailwind CSS",
      "React Query",
    ],
  },
  {
    label: "Databases",
    items: ["MongoDB", "PostgreSQL", "Vector Databases"],
  },
  {
    label: "AI & Data",
    items: ["NLP", "LLMs", "RAG", "ML Pipelines", "Data Science"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="px-6 py-24 md:px-16 lg:px-24">
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Skills
      </h2>

      {/* Outer map: one block per category */}
      <div className="mt-8 flex flex-col gap-8">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <h3 className="text-sm font-medium uppercase tracking-widest text-muted">
              {group.label}
            </h3>

            {/* Inner map: the pills for this category */}
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-foreground/10 bg-surface px-3 py-1.5 text-sm text-foreground"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
