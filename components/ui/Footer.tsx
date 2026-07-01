// Site footer: copyright + license. A server component on purpose — it's static
// content with no browser events, so it stays off the client bundle (same
// reasoning as SocialLinks). Rendered *outside* <main> in app/page.tsx so it
// spans the full width and isn't swept into the main content landmark.
//
// No data-avatar-react on the license link (unlike SocialLinks): the avatar
// lives in a sticky lane *inside* <main>, which has scrolled out of view by the
// time you reach the footer — a hover reaction here would never be seen.
export default function Footer() {
  // Evaluated on the server. The home page is statically generated, so this is
  // baked at build time and refreshes on every deploy. Computing it in a
  // 'use client' component instead would risk a hydration mismatch at the turn
  // of the year (server HTML vs the browser's clock) and ship needless JS.
  const year = new Date().getFullYear();

  return (
    // Its own max-w-7xl + mx-auto so it lines up with <main> even though it
    // sits outside it. Tokens (text-muted, foreground/10) keep it theme-aware.
    <footer className="mx-auto max-w-7xl border-t border-foreground/10 px-6 py-8 text-center text-sm text-muted">
      <p>© {year} Kaushal Patel</p>
      <p className="mt-1">
        Code licensed under{" "}
        <a
          href="https://github.com/krazykaushal/krazyk-portfolio/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-foreground"
        >
          MIT
        </a>{" "}
        &middot; Content &amp; artwork all rights reserved
      </p>
    </footer>
  );
}
