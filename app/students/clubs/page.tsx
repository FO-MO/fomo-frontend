"use client";
import React from "react";
import ClubCard, { Club } from "@/components/student-section/ClubCard";
import { getAuthToken } from "@/lib/strapi/auth";
import { backendurl, fetchFromBackend } from "@/lib/tools";

const x = await fetchFromBackend("clubs?populate=*");
const mockClubs: Club[] = x.map((club: any) => {
  return {
    id: club.documentId,
    title: club.title,
    description: club.description,
    tags: club.skills,
    leader: { name: club.author, avatarUrl: null },
    membersCount: club.no_member,
    joined: club.join,
    imageUrl: `${backendurl}` + club.image.url,
    badge: "Expert-led",
    videos: club.videos.map((video: any) => `${backendurl}` + video.url) || [],
  };
});

console.log("Fetched clubs:", mockClubs);

// const mockClubs: Club[] = [
//   {
//     id: "1",
//     title: "Web Development",
//     description:
//       "Master modern web technologies including HTML, CSS, JavaScript, React, and more.",
//     tags: ["HTML/CSS", "JavaScript", "React"],
//     leader: { name: "Dr. Sarah Johnson", avatarUrl: null },
//     membersCount: 124,
//     joined: true,
//     badge: "Expert-led",
//     imageUrl: null,
//   },
//   {
//     id: "2",
//     title: "Python",
//     description:
//       "Learn Python programming from basics to advanced concepts. Cover data science, web, and automation.",
//     tags: ["Python Basics", "Data Science", "Django"],
//     leader: { name: "Dr. Michael Chen", avatarUrl: null },
//     membersCount: 98,
//     joined: true,
//     badge: "Expert-led",
//     imageUrl: null,
//   },
//   {
//     id: "3",
//     title: "Java",
//     description:
//       "Comprehensive Java programming course covering OOP, Spring framework, and more.",
//     tags: ["Core Java", "Spring Boot", "Hibernate"],
//     leader: { name: "Dr. Priya Sharma", avatarUrl: null },
//     membersCount: 76,
//     joined: true,
//     badge: "Expert-led",
//     imageUrl: null,
//   },
// ];

export default function ClubsPage() {
  return (
    <main className="w-full px-6 sm:px-8 pt-8 pb-16">
      <div className="max-w-6xl mx-auto">
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

        {/* Tabs Section */}
        <div className="mt-8 mb-8">
          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button className="bg-white text-gray-900 px-5 py-2 rounded-md text-sm font-medium shadow-sm">
              Browse Clubs
            </button>
            <button
              // onClick={() => router.push("/students/clubs")}
              className="text-gray-600 hover:bg-white hover:shadow-sm px-5 py-2 rounded-md text-sm font-medium transition-all"
            >
              Club videos
            </button>
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
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockClubs.map((c) => (
            <ClubCard key={c.id} club={c} />
          ))}
        </div>
      </div>
    </main>
  );
}
