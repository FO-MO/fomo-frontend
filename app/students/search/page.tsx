"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo, useEffect } from "react";
import SearchCard, { Profile } from "@/components/student-section/SearchCard";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { StudentProfile } from "@/lib/supabase/types";

const PAGE_SIZE = 20;

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [followingFilter, setFollowingFilter] = useState<
    "all" | "following" | "not-following"
  >("all");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const supabase = getSupabaseClient();
        const from = (currentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        // Prevent the page from getting stuck forever if the network call hangs.
        const queryPromise = supabase
          .from("student_profiles")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(from, to);

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error("Request timed out"));
          }, 15000);
        });

        const { data, error, count } = await Promise.race([
          queryPromise,
          timeoutPromise,
        ]);

        if (error) {
          console.error("Error fetching profiles:", error);
          setProfiles([]);
          setTotalProfiles(0);
          setErrorMessage("Could not load candidates. Please try again.");
          return;
        }

        const fetchedProfiles: Profile[] = (data || []).map(
          (profile: StudentProfile) => ({
            id: profile.id,
            documentId: profile.user_id ?? undefined,
            studentId: profile.user_id || "unknown",
            name: profile.name || "Unknown User",
            email: profile.email || "No email",
            skills: profile.skills || [],
            followers: [],
            following: [],
            isFollowing: false,
            avatarUrl: profile.profile_pic || null,
          }),
        );

        setProfiles(fetchedProfiles);
        setTotalProfiles(typeof count === "number" ? count : 0);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setProfiles([]);
        setTotalProfiles(0);
        setErrorMessage(
          "Loading candidates took too long. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [currentPage, refreshNonce]);

  // Filter profiles based on search query and following filter
  const filteredProfiles = useMemo(() => {
    let filtered = profiles;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (profile: Profile) =>
          profile.name.toLowerCase().includes(query) ||
          profile.email?.toLowerCase().includes(query) ||
          profile.skills?.some((skill: string) =>
            skill.toLowerCase().includes(query),
          ),
      );
    }

    // Filter by following status
    if (followingFilter === "following") {
      filtered = filtered.filter((profile: Profile) => profile.isFollowing);
    } else if (followingFilter === "not-following") {
      filtered = filtered.filter((profile: Profile) => !profile.isFollowing);
    }

    return filtered;
  }, [searchQuery, followingFilter, profiles]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFollowingFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery.trim().length > 0 || followingFilter !== "all";

  const handleProfileClick = (profile: Profile) => {
    if (profile.documentId) {
      router.push(`/profile?userId=${profile.studentId}`);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalProfiles / PAGE_SIZE));

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRetry = () => {
    setRefreshNonce((prev) => prev + 1);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-20 bg-white min-h-screen">
      <section className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold">Find People</h1>
          </div>
        </div>

        {/* search & filters */}
        <div className="mt-6 flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2  border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none px-4 py-3 pl-12 pr-10 transition-colors"
                placeholder="Search by name, email or skills..."
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">
              Filter:
            </span>
            <span className="text-xs font-medium text-gray-700 sm:hidden">
              Filters
            </span>
            <div className="flex gap-1 sm:gap-2 flex-wrap">
              <button
                onClick={() => setFollowingFilter("all")}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  followingFilter === "all"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({profiles.length})
              </button>
              <button
                onClick={() => setFollowingFilter("following")}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  followingFilter === "following"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Following (
                {profiles.filter((p: Profile) => p.isFollowing).length})
              </button>
              <button
                onClick={() => setFollowingFilter("not-following")}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  followingFilter === "not-following"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                New ({profiles.filter((p: Profile) => !p.isFollowing).length})
              </button>
              <button
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            {searchQuery && (
              <span>
                Found{" "}
                <span className="font-semibold text-gray-900">
                  {filteredProfiles.length}
                </span>{" "}
                result
                {filteredProfiles.length !== 1 ? "s" : ""} for &quot;
                {searchQuery}&quot;
              </span>
            )}
          </div>
        </div>

        {/* grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading profiles...</p>
            </div>
          ) : errorMessage ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-600 font-medium">{errorMessage}</p>
              <button
                onClick={handleRetry}
                className="mt-4 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Retry
              </button>
            </div>
          ) : filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile: Profile) => (
              <div
                key={profile.id}
                onClick={() => handleProfileClick(profile)}
                className="transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer"
              >
                <SearchCard
                  profile={profile}
                  onFollowToggle={(profileId) => {
                    console.log("Follow toggled for profile:", profileId);
                    // Here you would typically update the profile's following status
                  }}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you&apos;re
                looking for.
              </p>
            </div>
          )}
        </div>

        {!loading && totalProfiles > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing page <span className="font-semibold">{currentPage}</span>
              {" "}of <span className="font-semibold">{totalPages}</span>
              {" "}({totalProfiles} students)
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
