import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

//SEO NEEDS TO BE DONE...

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FOMO - AI-Powered Career Platform for Students & Job Seekers",
  description:
    "Never Fear Missing Out on your dream job. FOMO automates your career journey with AI-powered job recommendations, personalized upskilling, networking automation, and direct college placement connections.",
  keywords: [
    "AI career platform",
    "student job placement",
    "AI-powered job search",
    "career automation",
    "college placement",
    "student networking",
    "personalized learning paths",
    "upskilling platform",
    "job recommendations",
    "campus placements",
    "career development for students",
    "AI networking",
    "automated job matching",
    "student career platform",
    "entry-level jobs",
    "internship opportunities",
    "college to career",
    "job portal for students",
    "AI career advisor",
    "career guidance platform",
  ],
  authors: [{ name: "FOMO Team" }],
  creator: "FOMO",
  publisher: "FOMO",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fomo.app",
    title: "FOMO - AI-Powered Career Platform for Students",
    description:
      "Automate your entire career journey with AI-powered upskilling, networking, and college placement automation. Never miss out on your dream job.",
    siteName: "FOMO",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FOMO - AI-Powered Career Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FOMO - AI-Powered Career Platform for Students",
    description:
      "Automate your career journey with AI-powered job recommendations, upskilling, and networking automation.",
    images: ["/og-image.png"],
    creator: "@fomo_app",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://fomo.app",
  },
  category: "Career Development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        {children}
      </body>
    </html>
  );
}
