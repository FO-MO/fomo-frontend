"use client";

import React, { useState } from "react";
import ProjectCard, { Project } from "@/components/student-section/ProjectCard";
import CreateProjectModal from "@/components/student-section/CreateProjectModal";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const token = localStorage.getItem("fomo_token");
const res = await fetch(`${BACKEND_URL}/api/projects?populate=*`, {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await res.json();

console.log("Fetched projects:", data.data);

const mockProjects: Project[] = data.data.map((project: any) => {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    tags: ["Project"],
    creator: { name: project.author, avatarUrl: null },
    skills: project.skills,
    membersCount: project.no_member,
    // joined: project.join,
    imageUrl: `${BACKEND_URL}` + project.image.url,
    actions: [{ label: "Join Project", href: "#" }],
  };
});

console.log("Fetched projects:", mockProjects);

// const mockProjects: Project[] = [
//   {
//     id: "1",
//     title: "Custom Memory Allocator",
//     description:
//       "Build a custom memory allocation and deallocation system similar to malloc and free. Focus on fragmentation and performance.",
//     tags: ["Project"],
//     creator: { name: "biyon binu", avatarUrl: null },
//     membersCount: 1,
//     skills: [
//       "C",
//       "C++",
//       "Pointers",
//       "Memory Management",
//       "Linked Lists",
//       "OS Concepts",
//     ],
//     actions: [{ label: "Join Project", href: "#" }],
//     imageUrl: null,
//   },
//   {
//     id: "2",
//     title: "AI Chatbot for Campus",
//     description:
//       "Create an LLM-based chatbot to answer student queries about courses and campus life.",
//     tags: ["Project"],
//     creator: { name: "alice doe", avatarUrl: null },
//     membersCount: 3,
//     skills: ["Python", "NLP", "APIs"],
//     actions: [{ label: "View", href: "#" }],
//     imageUrl: null,
//   },
//   {
//     id: "3",
//     title: "Custom Memory Allocator",
//     description:
//       "Build a custom memory allocation and deallocation system similar to malloc and free. Focus on fragmentation and performance.",
//     tags: ["Project"],
//     creator: { name: "biyon binu", avatarUrl: null },
//     membersCount: 1,
//     skills: [
//       "C",
//       "C++",
//       "Pointers",
//       "Memory Management",
//       "Linked Lists",
//       "OS Concepts",
//     ],
//     actions: [{ label: "Join Project", href: "#" }],
//     imageUrl: null,
//   },
//   {
//     id: "4",
//     title: "AI Chatbot for Campus",
//     description:
//       "Create an LLM-based chatbot to answer student queries about courses and campus life.",
//     tags: ["Project"],
//     creator: { name: "alice doe", avatarUrl: null },
//     membersCount: 3,
//     skills: ["Python", "NLP", "APIs"],
//     actions: [{ label: "View", href: "#" }],
//     imageUrl: null,
//   },
//   {
//     id: "5",
//     title: "AI Chatbot for Campus",
//     description:
//       "Create an LLM-based chatbot to answer student queries about courses and campus life.",
//     tags: ["Project"],
//     creator: { name: "alice doe", avatarUrl: null },
//     membersCount: 3,
//     skills: ["Python", "NLP", "APIs"],
//     actions: [{ label: "View", href: "#" }],
//     imageUrl: null,
//   },
// ];

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
    <main className="w-full px-6 sm:px-8 pt-8 pb-16">
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

      <div className="mt-6 flex gap-4 items-center">
        <div className="flex-1">
          <input
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Search projects..."
          />
        </div>

        <select className="border rounded-lg px-4 py-3">
          <option>Newest</option>
        </select>

        <select className="border rounded-lg px-4 py-3">
          <option>All Projects</option>
        </select>
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
    </main>
  );
}
