import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./font-awesome.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-screen antialiased`}
    >
      <body className="flex flex-col">{children}</body>
    </html>
  );
}