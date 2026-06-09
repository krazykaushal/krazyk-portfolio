import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
