"use client";

import React, { useState } from "react";
import ProjectCard, { Project } from "@/components/student-section/ProjectCard";
import CreateProjectModal from "@/components/student-section/CreateProjectModal";
import { fetchData } from "@/lib/strapi/strapiData";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://tbs9k5m4-1337.inc1.devtunnels.ms";
const token = localStorage.getItem("fomo_token");
const data = await fetchData(token, "projects?populate=*");

const mockProjects: Project[] = data.data.map((project: any) => {
  return {
    id: project.documentId,
    title: project.title,
    description: project.description,
    tags: ["Project"],
    creator: { name: project.author, avatarUrl: null },
    skills: project.skills,
    membersCount: project.no_member,
    // joined: project.join,
    imageUrl: project.image ? `${BACKEND_URL}${project.image.url}` : null,
    actions: [{ label: "Join Project", href: "#" }],
  };
});

console.log("Fetched projects:", mockProjects);

export default function StudentsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateProject = async (projectData: {
    name: string;
    description: string;
    githubUrl: string;
    coverImageUrl?: string;
    skills: string[];
    tags: string[];
  }) => {
    // TODO: Implement API call to create project
    // Example:
    // const response = await fetch('/api/projects', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(projectData)
    // });
    // if (response.ok) {
    //   // Refresh projects list
    // }

    console.log("Create project data:", projectData);
    alert("Project created! (Connect to your API)");
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-20 bg-white min-h-screen">
      <section className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold">Projects</h1>
            <p className="text-gray-600 mt-2">
              Join or create projects to collaborate with other students
            </p>
          </div>

          <div className="ml-auto">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#0f4f4a] text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-[#0d3f3b] transition-colors"
            >
              <span className="text-2xl">+</span>
              <span>Create Project</span>
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* Search input - full width on mobile */}
          <div className="w-full">
            <input
              className="w-full border rounded-lg px-4 py-3 text-base"
              placeholder="Search projects..."
            />
          </div>

          {/* Filters - stacked on mobile, side by side on larger screens */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select className="border rounded-lg px-4 py-3 text-base flex-1 sm:flex-initial">
              <option>Newest</option>
              <option>Oldest</option>
              <option>Most Popular</option>
            </select>

            <select className="border rounded-lg px-4 py-3 text-base flex-1 sm:flex-initial">
              <option>All Projects</option>
              <option>Web Development</option>
              <option>Mobile Apps</option>
              <option>AI/ML</option>
              <option>Game Development</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <CreateProjectModal
            onClose={() => setShowCreateModal(false)}
            onCreateProject={handleCreateProject}
          />
        )}
      </section>
    </div>
  );
}
