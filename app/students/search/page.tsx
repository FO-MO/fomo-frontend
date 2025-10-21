"use client";

import React from "react";
import SearchCard, { Profile } from "@/components/SearchCard";

const mockProfiles: Profile[] = [
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
  return (
    <main className="w-full px-6 sm:px-8 pt-10 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold">Find People</h1>
          </div>
        </div>

        {/* search & filters */}
        <div className="mt-6 flex justify-center sm:justify-normal flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                className="w-[70%] border-2 rounded-xl focus:border-blue-400 px-2 py-3 pl-4"
                placeholder="Search by name,username or bio..."
              />
            </div>
          </div>
        </div>

        {/* grid */}
        <div className="mt-8 flex flex-row flex-wrap w-[105%] gap-6">
          {mockProfiles.map((profile) => (
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
          ))}
        </div>
      </div>
    </main>
  );
}
