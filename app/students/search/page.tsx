"use client";

import React, { useState, useMemo } from "react";
import SearchCard, { Profile } from "@/components/student-section/SearchCard";
import { Search, X } from "lucide-react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const token = localStorage.getItem("fomo_token");
const res = await fetch(`${BACKEND_URL}/api/student-profiles?populate=*`, {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await res.json();

console.log("Fetched jobs:", data.data);

const mockProfiles: Profile[] = data.data.map((search: any) => {
  return {
    id: search.id,
    documentId: search.documentId,
    name: search.name,
    email: search.email,
    skills: search.skills,
    followersCount: search.followers,
    followingCount: search.following,
    isFollowing: false,
    avatarUrl: null, //`${BACKEND_URL}` + search.profilePic.url,
  };
});

console.log("Fetched jobs:", mockProfiles);

const mockProfiles_: Profile[] = [
  {
    id: "1",
    name: "Damon",
    email: "bloodhuntersplayzone@gmail.com",
    skills: ["React", "TypeScript", "Node.js"],
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
    avatarUrl: null,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@university.edu",
    skills: ["Python", "Data Science", "Machine Learning", "Django"],
    followersCount: 245,
    followingCount: 89,
    isFollowing: true,
    avatarUrl: null,
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@techcorp.com",
    skills: ["Java", "Spring Boot", "Microservices", "Docker"],
    followersCount: 156,
    followingCount: 203,
    isFollowing: false,
    avatarUrl: null,
  },
  {
    id: "4",
    name: "Priya Sharma",
    email: "priya.sharma@startup.io",
    skills: ["Frontend", "React", "UI/UX", "Figma"],
    followersCount: 89,
    followingCount: 134,
    isFollowing: false,
    avatarUrl: null,
  },
  {
    id: "5",
    name: "Alex Rodriguez",
    email: "alex.r@devstudio.com",
    skills: ["Full Stack", "Vue.js", "PostgreSQL", "AWS"],
    followersCount: 67,
    followingCount: 92,
    isFollowing: true,
    avatarUrl: null,
  },
  {
    id: "6",
    name: "Emma Thompson",
    email: "emma.thompson@design.co",
    skills: ["Product Design", "Prototyping", "User Research"],
    followersCount: 312,
    followingCount: 156,
    isFollowing: false,
    avatarUrl: null,
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [followingFilter, setFollowingFilter] = useState<
    "all" | "following" | "not-following"
  >("all");

  // Filter profiles based on search query and following filter
  const filteredProfiles = useMemo(() => {
    let filtered = mockProfiles;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (profile) =>
          profile.name.toLowerCase().includes(query) ||
          profile.email.toLowerCase().includes(query) ||
          profile.skills?.some((skill) => skill.toLowerCase().includes(query))
      );
    }

    // Filter by following status
    if (followingFilter === "following") {
      filtered = filtered.filter((profile) => profile.isFollowing);
    } else if (followingFilter === "not-following") {
      filtered = filtered.filter((profile) => !profile.isFollowing);
    }

    return filtered;
  }, [searchQuery, followingFilter]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <main className="w-full px-6 sm:px-8 pt-10 pb-16">
      <div className="max-w-6xl mx-auto">
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
                className="w-full border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none px-4 py-3 pl-12 pr-10 transition-colors"
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
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFollowingFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  followingFilter === "all"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({mockProfiles.length})
              </button>
              <button
                onClick={() => setFollowingFilter("following")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  followingFilter === "following"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Following ({mockProfiles.filter((p) => p.isFollowing).length})
              </button>
              <button
                onClick={() => setFollowingFilter("not-following")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  followingFilter === "not-following"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Not Following (
                {mockProfiles.filter((p) => !p.isFollowing).length})
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
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <a
                href="backendpeep"
                key={profile.id}
                className="transition-transform duration-300 ease-in-out hover:-translate-y-2"
              >
                <SearchCard
                  key={profile.id}
                  profile={profile}
                  onFollowToggle={(profileId) => {
                    console.log("Follow toggled for profile:", profileId);
                    // Here you would typically update the profile's following status
                  }}
                />
              </a>
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
      </div>
    </main>
  );
}
