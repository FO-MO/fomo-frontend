"use client";

import "../globals.css";
import SideBar from "@/components/bars/sideBar";
import Navbar from "@/components/bars/Navbar";
import { useProfileCheck } from "@/lib/useProfileCheck";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if user has completed profile, redirect if not
  const { isLoading, hasProfile } = useProfileCheck(true);

  // Show loading state while checking profile
  if (isLoading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If no profile, the hook will redirect to setup-profile
  // But we still show loading state to prevent flash of content
  if (!hasProfile) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Redirecting to profile setup...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar - Desktop only, Mobile uses bottom nav */}
      <SideBar />
      <Navbar />

      {/* Main content area with responsive padding */}
      <main className="sm:ml-56 w-full min-h-screen">
        {/* Top padding for navbar, generous bottom padding for bottom navigation */}
        <div className="pt-20 pb-32">{children}</div>
      </main>
    </div>
  );
}
