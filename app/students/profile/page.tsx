"use client";

import React, { useState } from "react";
import ProfileProjectCard from "@/components/ProfileProjectCard";
import ProfileClubCard from "@/components/ProfileClubCard";
import ProfileInternshipCard from "@/components/ProfileInternshipCard";

type TabKey = "projects" | "clubs" | "internships";

const profileData = {
  name: "Simon Mattekkatt",
  email: "robertcresol@gmail.com",
  initials: "SM",
  followers: 0,
  following: 0,
  tabs: [
    { key: "projects" as TabKey, label: "Projects" },
    { key: "clubs" as TabKey, label: "Clubs" },
    { key: "internships" as TabKey, label: "Internships" },
  ],
  projects: [
    {
      title: "EcoTrack Mobile App",
      description:
        "Building an app that helps users track and reduce their carbon footprint",
      status: "Active",
      tags: ["React Native", "UI/UX Design"],
    },
    {
      title: "College Resource Finder",
      description:
        "Web app that aggregates and organizes university resources for students",
      status: "Completed",
      tags: ["React", "Firebase", "Tailwind CSS"],
    },
  ],
  clubs: [
    {
      name: "AI Innovators",
      description: "Explore cutting-edge AI technologies with industry experts",
      tags: ["Artificial Intelligence", "Machine Learning"],
      badge: "Expert-led",
    },
    {
      name: "Product Design Lab",
      description:
        "Learn product design methodologies from Apple and Tesla designers",
      tags: ["Product Design", "UX"],
      badge: "Expert-led",
    },
  ],
  internships: [
    {
      role: "UI/UX Design Intern at Adobe",
      timeline: "Summer 2023",
      location: "San Francisco, CA",
      status: "Applied",
    },
    {
      role: "Frontend Developer Intern at Spotify",
      timeline: "Summer 2023",
      location: "Remote",
      status: "Applied",
    },
  ],
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("projects");

  const renderTabContent = () => {
    switch (activeTab) {
      case "projects":
        return (
          <div className="mt-6 flex flex-col gap-6">
            {profileData.projects.map((project) => (
              <ProfileProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                status={project.status}
                tags={project.tags}
              />
            ))}
          </div>
        );
      case "clubs":
        return (
          <div className="mt-6 flex flex-col gap-6">
            {profileData.clubs.map((club) => (
              <ProfileClubCard
                key={club.name}
                name={club.name}
                description={club.description}
                tags={club.tags}
                badge={club.badge}
              />
            ))}
          </div>
        );
      case "internships":
        return (
          <div className="mt-6 flex flex-col gap-6">
            {profileData.internships.map((internship) => (
              <ProfileInternshipCard
                key={internship.role}
                role={internship.role}
                timeline={internship.timeline}
                location={internship.location}
                status={internship.status}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-5">
      <div className="w-full h-32 bg-gradient-to-r from-gray-200 to-gray-300" />
      <div className="max-w-5xl mx-auto -mt-16 flex gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
              {profileData.initials}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold mb-1">
                {profileData.name}
              </h1>
              <div className="text-gray-500 text-lg">@{profileData.email}</div>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex gap-2 bg-gray-100 rounded-xl p-2 w-full max-w-xl">
              {profileData.tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`px-5 py-2 rounded-lg font-medium text-base transition-all duration-200 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#185c5a] ${
                    activeTab === tab.key
                      ? "bg-white text-gray-900 shadow-md scale-[1.02]"
                      : "text-gray-500 hover:bg-white/70 hover:text-gray-800 hover:shadow-sm hover:-translate-y-0.5"
                  }`}
                  aria-pressed={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {renderTabContent()}
        </div>

        <div className="w-72 pt-24">
          <div className="border-t pt-4">
            <div className="flex justify-between text-gray-700 font-medium mb-2">
              <span>Followers</span>
              <span>{profileData.followers}</span>
            </div>
            <div className="flex justify-between text-gray-700 font-medium">
              <span>Following</span>
              <span>{profileData.following}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
