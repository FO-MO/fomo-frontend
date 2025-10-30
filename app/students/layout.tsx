import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import SideBar from "@/components/bars/sideBar";
import Navbar from "@/components/bars/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fomo - Connect, Learn, Grow",
  description: "A platform for students to connect and grow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      {/* Sidebar fixed on left */}
      <div className="hidden md:block">
        <SideBar />
      </div>
      <Navbar />

      {/* Main content area. Add left margin equal to sidebar width on md+ and top padding for the fixed TopBar */}
      <main className="md:ml-56 w-full">
        <div className="pt-20">{children}</div>
      </main>
    </div>
  );
}
