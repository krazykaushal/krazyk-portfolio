"use client";

// A theme toggle styled like a boolean config flag:  darkMode ●━○ true
//
// Flipping the theme is just toggling the .dark class on <html> (globals.css
// keys every color token off it) and remembering the choice in localStorage.
// The matching inline script in layout.tsx reapplies that choice before paint
// on every load, so there's no flash of the wrong theme.
//
// Deliberately holds NO React state for the theme: the knob position, track
// color, and true/false label are all pure CSS (Tailwind `dark:` variants
// driven by the .dark class the script already set). That sidesteps a
// server/client hydration mismatch — the server can't know the visitor's
// theme, but the CSS doesn't care who set the class.
export default function ThemeToggle() {
  const toggleTheme = () => {
    // classList.toggle returns true when the class ends up present (= dark).
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      // Fixed in the corner (no nav bar to live in). z-50 keeps it above the
      // sticky avatar lane; the frosted surface bg keeps it legible over
      // whatever scrolls behind. h-11 meets the 44px touch-target minimum.
      className="fixed right-4 top-4 z-50 inline-flex h-11 items-center gap-2 rounded-md border border-foreground/15 bg-surface/80 px-3 font-mono text-xs text-muted shadow-sm backdrop-blur transition-colors hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span className="text-foreground">darkMode</span>

      {/* Switch track + sliding knob — pure CSS via the dark: variant. The knob
          slides right and the track turns accent in dark mode. The CSS net in
          globals.css strips these transitions under prefers-reduced-motion, so
          the knob just jumps. aria-hidden: it's decorative, the label names it. */}
      <span
        aria-hidden="true"
        className="relative inline-flex h-4 w-8 items-center rounded-full bg-foreground/20 px-0.5 transition-colors dark:bg-accent"
      >
        <span className="h-3 w-3 rounded-full bg-background shadow transition-transform duration-200 dark:translate-x-4" />
      </span>

      {/* The flag's value. Both are in the DOM; CSS shows the one matching the
          theme (the hidden one is display:none, so it's inert). */}
      <span aria-hidden="true" className="text-muted dark:hidden">
        false
      </span>
      <span aria-hidden="true" className="hidden text-accent dark:inline">
        true
      </span>
    </button>
  );
}
