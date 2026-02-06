"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser, getStudentProfile } from "@/lib/supabase";

/**
 * Hook to check if user has completed their profile
 * Redirects to setup-profile page if profile is incomplete
 * @param redirectIfIncomplete - Whether to redirect if profile is incomplete (default: true)
 */
export function useProfileCheck(redirectIfIncomplete: boolean = true) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      // Don't check on auth pages or setup-profile page
      const isAuthPage = pathname?.startsWith("/auth");
      if (isAuthPage) {
        setIsLoading(false);
        return;
      }

      const { user } = await getCurrentUser();
      if (!user) {
        // Not authenticated, redirect to login
        if (redirectIfIncomplete) {
          router.push("/auth/login");
        }
        setIsLoading(false);
        return;
      }

      // Check if profile exists and is complete
      const profile = await getStudentProfile(user.id);

      const isComplete = !!(
        profile &&
        profile.name &&
        profile.college &&
        profile.course &&
        profile.graduation_year &&
        profile.about
      );

      setHasProfile(isComplete);
      setIsLoading(false);

      // Redirect to setup if incomplete
      if (!isComplete && redirectIfIncomplete) {
        router.push("/auth/setup-profile");
      }
    };

    checkProfile();
  }, [pathname, router, redirectIfIncomplete]);

  return { isLoading, hasProfile };
}

/**
 * Simple function to check if profile exists (non-hook version for server components)
 */
export async function checkProfileExists(userId: string): Promise<boolean> {
  try {
    const profile = await getStudentProfile(userId);
    return !!(
      profile &&
      profile.name &&
      profile.college &&
      profile.course &&
      profile.graduation_year &&
      profile.about
    );
  } catch (err) {
    console.error("Failed to check profile:", err);
    return false;
  }
}
