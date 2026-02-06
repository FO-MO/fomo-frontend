"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCurrentUser, getStudentProfile } from "@/lib/supabase";

export interface VerificationState {
  isLoading: boolean;
  verificationStatus: number | null; // 0 = pending, 1 = verified, -1 = rejected
  isVerified: boolean;
}

/**
 * Hook to check if user is verified
 * Returns verification status and whether user is verified
 */
export function useVerificationCheck(): VerificationState {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const checkVerification = async () => {
      // Don't check on auth pages
      const isAuthPage = pathname?.startsWith("/auth");
      if (isAuthPage) {
        setIsLoading(false);
        return;
      }

      const { user } = await getCurrentUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch student profile to get verification status
        const profile = await getStudentProfile(user.id);
        const status = profile?.verification ?? 0; // Default to pending if not set

        setVerificationStatus(status);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to check verification status:", err);
        setVerificationStatus(0); // Default to pending on error
        setIsLoading(false);
      }
    };

    checkVerification();
  }, [pathname]);

  return {
    isLoading,
    verificationStatus,
    isVerified: verificationStatus === 1,
  };
}
