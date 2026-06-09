import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import Reveal from "@/components/ui/Reveal";
import Avatar from "@/components/Avatar/Avatar";

export default function Home() {
  return (
    // mobile: single column, avatar stacked on top.
    // md+: two columns (flex-row-reverse puts the avatar lane on the right).
    <main className="mx-auto flex max-w-7xl flex-col md:flex-row-reverse md:items-start">
      {/* Avatar lane. On md+ it's `sticky top-0 h-svh`, so it stays centered in
          the viewport while the content column scrolls past, releasing near the
          bottom. On mobile it's just a block at the top. */}
      <div className="flex justify-center px-6 pt-12 md:sticky md:top-0 md:h-svh md:w-2/5 md:shrink-0 md:items-center md:px-0 md:pt-0 lg:w-1/3">
        <div className="relative w-56 sm:w-72 md:w-full">
          {/* accent halo */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[-10%] -z-20 aspect-square w-[88%] -translate-x-1/2 rounded-full bg-accent/20 blur-2xl"
          />
          {/* light circle behind the head so the dark hair reads */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[-6%] -z-10 aspect-square w-[78%] -translate-x-1/2 rounded-full bg-linear-to-b from-zinc-100 to-zinc-300"
          />
          <Avatar className="h-auto w-full" />
        </div>
      </div>

      {/* Content lane. min-w-0 lets it shrink properly beside the avatar lane. */}
      <div className="md:min-w-0 md:flex-1">
        <Hero />
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Work />
        </Reveal>
        <Reveal>
          <Skills />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
      </div>
    </main>
  );
}
