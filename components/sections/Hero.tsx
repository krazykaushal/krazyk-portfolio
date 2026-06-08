export default function Hero() {
  return (
    // min-h-svh: "small viewport height" — safer than min-h-screen on mobile
    // because mobile browsers shrink/expand the toolbar, and svh = the guaranteed
    // visible area. Avoids content being clipped behind the browser chrome.
    <section
      id="hero"
      className="flex min-h-svh flex-col items-center justify-center px-6 text-center md:items-start md:text-left md:px-16 lg:px-24"
    >
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
        Hello, I&apos;m
      </p>

      {/* Mobile-first font scale: 4xl → 6xl → 8xl as viewport grows */}
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-8xl">
        Kaushal Patel
      </h1>

      <p className="mt-4 max-w-md text-base text-muted sm:text-lg">
        {/* TODO(you): replace with your actual tagline */}
        Software engineer. Problem solver. Creative thinker.
      </p>

      {/* Stacked on mobile, side-by-side on sm+ */}
      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <a
          href="#work"
          className="rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-background transition-opacity hover:opacity-80"
        >
          See my work
        </a>
        <a
          href="#contact"
          className="rounded-full border border-foreground/20 px-6 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:border-foreground/50"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
