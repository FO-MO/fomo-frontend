"use client";

import React, { useEffect, useState } from "react";
import { getCurrentUser, signOut } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function UserProfileClient() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) setUser(currentUser);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) return <div className="text-gray-600">Loading...</div>;

  if (!user) {
    return (
      <div className="flex gap-2">
        <a
          href="/auth/login"
          className="px-4 py-2 text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          Login
        </a>
        <a
          href="/auth/signup"
          className="px-4 py-2 text-sm font-medium text-white bg-teal-900 rounded-md hover:bg-teal-800"
        >
          Sign Up
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <p className="font-medium text-gray-900">
          {user.user_metadata?.username || user.email}
        </p>
        <p className="text-gray-600">{user.email}</p>
      </div>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
}
