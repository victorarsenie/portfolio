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
  description:
    "I make disconnected systems talk. Ten years of WHMCS extensions, multi-API orchestration and automated data pipelines - billing platforms, backup software, DNS and support desks wired together.",
  authors: [{ name: "Victor Alexandru" }],
  keywords: [
    "full-stack developer",
    "systems integrator",
    "API orchestration",
    "WHMCS developer",
    "PHP developer",
    "data pipelines",
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
    <html lang="en" className="h-screen antialiased">
      <body className="flex flex-col">{children}</body>
    </html>
  );
}