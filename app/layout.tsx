import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "./context/AuthContext";
import QueryProvider from "@/components/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pawcircle.app"),
  title: "PawCircle | Build your pet's village",
  description:
    "PawCircle helps pet parents bring their village together. Share updates, set a wishlist, and let friends and fans chip in for real care and happy moments.",
  keywords: [
    "PawCircle",
    "pet parents",
    "pet community",
    "pet wishlist",
    "dog app",
    "cat app",
    "support pets",
    "fur baby village",
  ],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "PawCircle | Build your pet's village",
    description:
      "Create your pet’s page, share updates, wishlists, and real support in one place.",
    url: "https://www.pawcircle.app",
    siteName: "PawCircle",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PawCircle | Build your pet's village",
    description:
      "Updates, wishlists, and support in one link. Join the waitlist at pawcircle.app.",
  },
  alternates: {
    canonical: "https://www.pawcircle.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
      </QueryProvider>
    </html>
  );
}
