import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { RightNav } from "@/components/layout/RightNav";
import { BottomDock } from "@/components/layout/BottomDock";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ScrollProgressBar } from "@/components/layout/ScrollProgressBar";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { NameBadge } from "@/components/layout/NameBadge";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://omkeshjadhav.dev";
const SITE_TITLE = "Omkesh Jadhav — Full Stack Developer";
const SITE_DESCRIPTION =
  "Full Stack Developer building modern, scalable web applications with React, Next.js, Node.js and TypeScript.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Omkesh Jadhav",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Omkesh Jadhav",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Portfolio",
  ],
  authors: [{ name: "Omkesh Jadhav" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Omkesh Jadhav",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

// Structured data (schema.org Person) — helps search engines understand
// this is a personal portfolio, surfaces sitelinks/knowledge panel data.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Omkesh Jadhav",
  jobTitle: "Full Stack Developer",
  url: SITE_URL,
  sameAs: [
    "https://github.com/omkeshjadhav",
    "https://linkedin.com/in/omkeshjadhav",
    "https://x.com/omkeshjadhav",
  ],
  knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
};

// Runs before hydration to set the .dark class synchronously, preventing
// a flash of the wrong theme on load. Reads the same localStorage key
// that useTheme() reads/writes.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-md focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <AmbientBackground />
        <CustomCursor />
        <ScrollProgressBar />
        <ThemeToggle />
        <NameBadge />
        <MobileNav />
        <SmoothScrollProvider>
          <RightNav />
          <main id="main-content" className="relative z-10">
            {children}
          </main>
          <Footer />
          <BottomDock />
        </SmoothScrollProvider>
        <LoadingScreen />
      </body>
    </html>
  );
}
