import Avatar from "@/components/Avatar/Avatar";

export default function Hero() {
  return (
    // Stacked column on mobile; two columns side-by-side on md+.
    <section
      id="hero"
      className="flex min-h-svh flex-col items-center justify-center gap-12 px-6 md:flex-row md:justify-evenly md:gap-12 md:px-16 lg:gap-20 lg:px-24"
    >
      {/* Text column */}
      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
          Hello, I&apos;m
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Kaushal Patel
        </h1>

        <p className="mt-4 max-w-md text-base text-muted sm:text-lg">
          {/* TODO(you): replace with your actual tagline */}
          Software engineer. Problem solver. Creative thinker.
        </p>

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
      </div>

      {/* Avatar column. A lighter circle sits behind the figure so the dark hair
          reads against the dark page; a blurred accent halo peeks out for depth.
          Both layers are decorative -> aria-hidden. */}
      <div className="relative w-64 shrink-0 sm:w-96 lg:w-[30rem]">
        {/* accent halo (slightly larger, blurred -> reads as a soft ring) */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[-10%] -z-20 aspect-square w-[88%] -translate-x-1/2 rounded-full bg-accent/20 blur-2xl"
        />
        {/* light circle behind the head (figure now fills the box, so this sits
            high; shoulders rise into its lower edge) */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[-6%] -z-10 aspect-square w-[78%] -translate-x-1/2 rounded-full bg-linear-to-b from-zinc-100 to-zinc-300"
        />
        <Avatar className="h-auto w-full" />
      </div>
    </section>
  );
}
