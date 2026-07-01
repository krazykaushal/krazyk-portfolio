import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import Reveal from "@/components/ui/Reveal";
import Avatar from "@/components/Avatar/Avatar";
import SocialLinks from "@/components/ui/SocialLinks";
import HeroBackground from "@/components/ui/HeroBackground";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
      {/* Subtle drifting grid behind the hero, fading out before About.
          Rendered outside <main> (which is max-w-7xl) so it spans the full
          viewport width. Absolute + -z-30 keeps it behind both the content and
          the sticky avatar lane (whose halos sit at -z-20). */}
      <HeroBackground />

      {/* mobile: single column, avatar stacked on top.
          md+: two columns (flex-row-reverse puts the avatar lane on the right). */}
      <main className="mx-auto flex max-w-7xl flex-col md:flex-row-reverse md:items-start">
        {/* Avatar lane. On md+ it's `sticky top-0 h-svh`, so it stays centered
            in the viewport while the content column scrolls past, releasing near
            the bottom. On mobile it's just a block at the top. */}
        <div className="flex flex-col items-center justify-center gap-6 px-6 pt-12 md:sticky md:top-0 md:h-svh md:w-2/5 md:shrink-0 md:flex-row md:gap-4 md:px-0 md:pt-0 lg:w-1/3">
          <div className="relative w-56 shrink-0 sm:w-72 md:min-w-0 md:flex-1">
            {/* accent halo */}
            <div
              aria-hidden
              className="absolute left-1/2 top-[-10%] -z-20 aspect-square w-[88%] -translate-x-1/2 rounded-full bg-accent/20 blur-2xl"
            />
            {/* Light circle behind the head so the dark hair reads — only needed
                in dark mode; on a light page the dark figure reads on its own, so
                we hide it there (hidden dark:block) to avoid a gray smudge. */}
            <div
              aria-hidden
              className="absolute left-1/2 top-[-6%] -z-10 hidden aspect-square w-[78%] -translate-x-1/2 rounded-full bg-linear-to-b from-zinc-100 to-zinc-300 dark:block"
            />
            <Avatar className="h-auto w-full" />
          </div>

          {/* Social links. Mobile: a horizontal row centered under the avatar
              (no cursor to drive the hover reaction, so a thumb-friendly row
              beats a vertical rail). md+: a vertical rail on the avatar's right
              (SocialLinks switches direction itself). Each link carries
              data-avatar-react="rail", so the avatar turns to "look over" at it
              on hover (see Avatar.tsx). It's a server component, so the links
              are in the DOM when the avatar's hover hook runs. */}
          <SocialLinks className="shrink-0" />
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

      {/* Site footer — outside <main> so it's full-width and its own landmark. */}
      <Footer />
    </>
  );
}
