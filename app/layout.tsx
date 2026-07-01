import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Cursor from "@/components/ui/Cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadataBase makes the OG/Twitter image URLs absolute. On Vercel it resolves
// to the production domain automatically; locally it falls back to localhost.
// Override by setting NEXT_PUBLIC_SITE_URL.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const title = "Kaushal Patel — Software Engineer";
const description = "Software Engineer | AI/ML & Full Stack";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Kaushal Patel",
  },
  description,
  keywords: [
    "Kaushal Patel",
    "Software Engineer",
    "Full Stack Developer",
    "AI/ML",
    "Next.js",
    "React",
    "Python",
  ],
  authors: [{ name: "Kaushal Patel" }],
  creator: "Kaushal Patel",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Kaushal Patel",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

// Runs before first paint (a blocking inline <script>, mounted below): set the
// .dark class from the saved choice, falling back to the OS preference. Inline
// scripts block parsing, so the class is correct before anything paints — no
// flash of the wrong theme (FOUC). To always default new visitors to dark
// regardless of their OS, swap the matchMedia(...) call for `true`.
const themeScript = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the script below mutates this element's class
    // before React hydrates, so the server-rendered class and the live DOM can
    // differ on <html>. This silences the warning for this one node only.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        {/* Pre-paint theme script — must run before the body content renders. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeToggle />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
