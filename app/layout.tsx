import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./case-studies.css";
import "./font-awesome.min.css";

// Geist and Geist_Mono were imported here and set as --font-geist-sans /
// --font-geist-mono, but no stylesheet consumed either variable. next/font
// downloads and subsets them anyway, so both were being fetched on every page
// load and never rendered. The site is set in Hype and Glacial Indifference;
// those two faces are the whole type system now.

export const metadata: Metadata = {
  title: "Victor Arsenie - Full-Stack Developer & Systems Integrator",
  // This description is what a search result and a link preview show, so it
  // has to be true on its own rather than by reference to the page. It said
  // "Ten years of WHMCS extensions", which was a claim retracted on the site
  // and unsupported here. It now says what the work is, and leads with the
  // local-AI angle the case studies are actually about.
  description:
    "I wire billing platforms, backup software, DNS and support desks together so data in one shows up in the others - and I run the local LLM stack that does the migrating, on my own GPU.",
  // Victor Arsenie, not Alexandru. Both appear in the source material; the
  // site's own contact block and the git remote both use Arsenie, and a
  // metadata author that disagrees with the page it describes is a small
  // correctness bug rather than a style choice.
  authors: [{ name: "Victor Arsenie" }],
  keywords: [
    "full-stack developer",
    "systems integrator",
    "API orchestration",
    "WHMCS developer",
    "PHP developer",
    "data pipelines",
    "legacy modernisation",
    "local LLM",
    "Next.js",
  ],
  icons: {
    icon: [{ url: "/images/fav-logo.png", sizes: "50x50", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* `min-h-screen`, not `h-screen`. A fixed 100vh on <html> stops the
       document growing, and because <body> is a flex column, `main` is a flex
       item and gets shrunk to one viewport while its content overflows. That was
       invisible on the home page, where every section paints its own
       background, but on a long note the single dark band behind the article
       stopped at 900px and the rest of the text sat on the white body. */
    <html lang="en" className="min-h-screen antialiased">
      <body className="flex flex-col">{children}</body>
    </html>
  );
}