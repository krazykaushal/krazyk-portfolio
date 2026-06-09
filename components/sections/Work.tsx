// Project data — add a new object here and a new card appears automatically.
// `link` is optional (note the `?`): not every project has a live deployment,
// only a repo. We'll use that below to show the "Live" button conditionally.
type Project = {
  name: string;
  desc: string;
  tech: string[];
  repo: string;
  link?: string;
};

const projects: Project[] = [
  {
    name: "Krazy-Anime",
    desc: "Web app to stream anime",
    tech: ["Next.js", "Tailwind", "React Query"],
    repo: "https://github.com/krazykaushal/krazy_anime_stream",
    link: "https://krazy-anime-stream.vercel.app/",
  },
  {
    name: "DA-SH",
    desc: "Educational networking tool for college students",
    tech: ["React", "Express", "Node", "MongoDB"],
    repo: "https://github.com/krazykaushal/Educational-Networking-Tools-for-Students",
    link: "https://da-sh.vercel.app/",
  },
  {
    name: "Purveying-F.E.E",
    desc: "Tool to connect those who need help to the providers",
    tech: ["React", "Express", "Node", "MongoDB"],
    repo: "https://github.com/krazykaushal/Purveying-Fee-KrazyK",
  },
  {
    name: "Zoo-B-DB",
    desc: "SQL database management system for zoos and national parks",
    tech: ["React", "Express", "PostgreSQL", "Node"],
    repo: "https://github.com/krazykaushal/Zoo-B-DB",
  },
  {
    name: "Promptopia",
    desc: "Open-source AI prompting tool to discover, create, and share creative prompts",
    tech: ["Next.js", "Tailwind"],
    repo: "https://github.com/krazykaushal/Promptopia",
  },
];

export default function Work() {
  return (
    <section id="work" className="px-6 py-24 md:px-16 lg:px-24">
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Work
      </h2>

      {/* 1 col on mobile, 2 cols on md+. gap-6 gives the cards breathing room. */}
      <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <li
            key={project.name}
            data-avatar-react
            className="flex flex-col rounded-xl border border-foreground/10 bg-surface p-6 transition-colors hover:border-accent/40"
          >
            <h3 className="text-lg font-semibold text-foreground">
              {project.name}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              {project.desc}
            </p>

            {/* Nested map: each tech tag becomes a pill */}
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
                >
                  {tag}
                </li>
              ))}
            </ul>

            {/* mt-auto pushes this row to the card bottom; pt-6 keeps spacing
                even when tech tags wrap to two lines */}
            <div className="mt-auto flex gap-4 pt-6 text-sm font-medium">
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-foreground"
              >
                GitHub →
              </a>

              {/* Live link only renders when project.link exists */}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent transition-colors hover:opacity-80"
                >
                  Live →
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
