export default function Hero() {
  return (
    // Text only now — the avatar lives in a sticky lane at the page level
    // (see app/page.tsx) so it can stay in view while sections scroll past.
    <section
      id="hero"
      className="flex flex-col items-center px-6 pt-6 pb-16 text-center md:min-h-svh md:items-start md:justify-center md:px-16 md:py-0 md:text-left lg:px-24"
    >
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
        Hello, I&apos;m
      </p>

      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
        Kaushal Patel
      </h1>

      <p className="mt-4 max-w-md text-base text-muted sm:text-lg">
        Software Engineer | AI/ML &amp; Full Stack
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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
