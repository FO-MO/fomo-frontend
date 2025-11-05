"use client";

import React, { useEffect } from "react";
import { removeAuthToken } from "@/lib/strapi/auth";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
      removeAuthToken();
      try {
        localStorage.removeItem("fomo_user");
      } catch {}
      router.push("/");
      router.refresh();
    };
    signOut();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Signing out...
        </h2>
        <p className="text-gray-600">Please wait while we log you out.</p>
      </div>
    </div>
  );
}
