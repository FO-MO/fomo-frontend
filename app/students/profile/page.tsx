"use client";

import { useState } from "react";
import ProfileProjectCard from "@/components/student-section/ProfileProjectCard";
import ProfileClubCard from "@/components/student-section/ProfileClubCard";
import ProfileInternshipCard from "@/components/student-section/ProfileInternshipCard";
import EditProfileModal from "@/components/student-section/EditProfileModal";
import { profile } from "console";

type TabKey = "projects" | "clubs" | "internships";

const profileData = {
  name: "Simon Mattekkatt",
  email: "robertcresol@gmail.com",
  initials: "SM",
  backgroundImageUrl:
    "https://images.ctfassets.net/nnkxuzam4k38/2SvDjcgyav5C1DOb79JKXl/d3b06db5bb6bdb4ab237f666b5b4980e/compute-ea4c57a4.png",
  profileImageUrl: "https://images.hitpaw.com/topics/3d/profile-photo-1.jpg",
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveProfile = (data: {
    name: string;
    email: string;
    profileImage: File | null;
    backgroundImage: File | null;
  }) => {
    // TODO: Implement API call to save profile data
    console.log("Saving profile:", data);
    setIsEditModalOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "projects":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {profileData.projects.map((project, index) => (
              <div
                key={project.title}
                className="transform transition-all duration-300 hover:-translate-y-1"
              >
                <ProfileProjectCard
                  title={project.title}
                  description={project.description}
                  status={project.status}
                  tags={project.tags}
                />
              </div>
            ))}
          </div>
        );
      case "clubs":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {profileData.clubs.map((club, index) => (
              <div
                key={club.name}
                className="transform transition-all duration-300 hover:-translate-y-1"
              >
                <ProfileClubCard
                  name={club.name}
                  description={club.description}
                  tags={club.tags}
                  badge={club.badge}
                />
              </div>
            ))}
          </div>
        );
      case "internships":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {profileData.internships.map((internship, index) => (
              <div
                key={internship.role}
                className="transform transition-all duration-300 hover:-translate-y-1"
              >
                <ProfileInternshipCard
                  role={internship.role}
                  timeline={internship.timeline}
                  location={internship.location}
                  status={internship.status}
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Cover Image */}
      <div className="w-full h-48 relative overflow-hidden">
        {profileData.backgroundImageUrl ? (
          <>
            <img
              src={profileData.backgroundImageUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </>
        ) : (
          <>
            <div className="w-full h-full bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDQwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCA0MGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Avatar - positioned to overlap cover image */}
          <div className="relative -mt-20 mb-6">
            <div className="relative inline-block">
              {profileData.profileImageUrl ? (
                <img
                  src={profileData.profileImageUrl}
                  alt={profileData.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white border-4 border-white shadow-2xl">
                  {profileData.initials}
                </div>
              )}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
          </div>

          {/* Name, Info and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Name and Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {profileData.name}
              </h1>
              <p className="text-gray-600 text-base mb-3">
                @{profileData.email.split("@")[0]}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="text-sm font-bold text-gray-900">
                    {profileData.followers}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <span className="text-sm text-gray-600">Following</span>
                  <span className="text-sm font-bold text-gray-900">
                    {profileData.following}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pb-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                Edit Profile
              </button>
              <button className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-md border border-gray-200 transition-all duration-300">
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex gap-1 bg-white rounded-xl p-1.5 shadow-md border border-gray-200">
            {profileData.tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-teal-700 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="pb-16">{renderTabContent()}</div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentData={{
          name: profileData.name,
          email: profileData.email,
          profileImageUrl: profileData.profileImageUrl,
          backgroundImageUrl: profileData.backgroundImageUrl,
        }}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
