"use client";

import React, { useState, useEffect } from "react";
import ClubCard from "@/components/student-section/ClubCard";
import { Club } from "@/lib/interfaces";
import { getClubsWithAuthors } from "@/lib/supabase/database";
import { getMediaUrl } from "@/lib/utils";
import { Json } from "@/lib/supabase/types";

// Type for the raw club data from database
interface ClubWithAuthor {
  id: string;
  title: string | null;
  description: string | null;
  no_member: number | null;
  skills: Json;
  pic: string | null;
  authors?: {
    id: string;
    profile_pic: string | null;
    user_profiles?: {
      username: string;
    } | null;
  } | null;
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getClubsWithAuthors();

        if (!data || !Array.isArray(data)) {
          setClubs([]);
          return;
        }

        const transformedClubs: Club[] = data.map(
          (clubData: ClubWithAuthor) => {
            // Get author name from the joined data
            const authorName =
              clubData.authors?.user_profiles?.username || "Unknown Author";
            const authorPic = clubData.authors?.profile_pic || null;

            // Parse skills from Json type
            const skills = Array.isArray(clubData.skills)
              ? (clubData.skills as string[])
              : [];

            return {
              id: clubData.id,
              name: clubData.title || "Untitled Club", // Club interface expects both name and title
              title: clubData.title || "Untitled Club",
              description: clubData.description || "",
              tags: skills,
              leader: {
                name: authorName,
                avatarUrl: authorPic ? getMediaUrl(authorPic) : null,
              },
              membersCount: clubData.no_member || 0,
              joined: false, // Default to false since this field doesn't exist in schema
              imageUrl: clubData.pic ? getMediaUrl(clubData.pic) : null,
              badge: "Expert-led",
              videos: [], // Videos are in separate table, would need additional query
            };
          },
        );

        setClubs(transformedClubs);
      } catch (err) {
        console.error("Failed to load clubs:", err);
        setError("Failed to load clubs. Please try again later.");
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-20 bg-white min-h-screen">
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading clubs...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-20 bg-white min-h-screen">
      <section className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold">Clubs</h1>
            <p className="text-gray-600 mt-2">
              Join expert-led clubs to access curated learning resources
            </p>
          </div>

          <div className="ml-auto hidden sm:block">
            {/* placeholder for actions */}
          </div>
        </div>

        {/* search & filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                className="w-full border rounded-lg px-4 py-3 pl-10"
                placeholder="Search clubs..."
              />
              <div className="absolute left-3 top-3 text-gray-400">🔍</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select className="border rounded-lg px-4 py-3 bg-white">
              <option>Most Popular</option>
            </select>

            <select className="border rounded-lg px-4 py-3 bg-white">
              <option>All Topics</option>
            </select>
          </div>
        </div>

        {/* grid */}
        {error ? (
          <div className="mt-8 text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800"
            >
              Retry
            </button>
          </div>
        ) : clubs.length === 0 ? (
          <div className="mt-8 text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No clubs available yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Check back later for new clubs
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((c) => (
              <ClubCard key={c.id} club={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
