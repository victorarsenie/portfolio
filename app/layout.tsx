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
  title: "Victor Arsenie - Full-Stack Web Developer",
  description: "Full-stack web developer with a great passion for coding. I enjoy creating websites of all kinds, with high attention to details.",
  authors: [{ name: "Victor Alexandru" }],
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