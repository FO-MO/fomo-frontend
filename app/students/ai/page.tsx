"use client";

import React from "react";
import {
  Lightbulb,
  Target,
  Users,
  TrendingUp,
  Rocket,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

type ProjectIdea = {
  id: string;
  title: string;
  icon: React.ReactNode;
};

const projectIdeas: ProjectIdea[] = [
  {
    id: "1",
    title: "Mobile App Development",
    icon: <Lightbulb className="w-6 h-6" />,
  },
  {
    id: "2",
    title: "Startup Business Plan",
    icon: <Target className="w-6 h-6" />,
  },
  {
    id: "3",
    title: "Team Collaboration Tool",
    icon: <Users className="w-6 h-6" />,
  },
  {
    id: "4",
    title: "Data Analytics Dashboard",
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    id: "5",
    title: "E-commerce Platform",
    icon: <Rocket className="w-6 h-6" />,
  },
  {
    id: "6",
    title: "Social Media Platform",
    icon: <MessageSquare className="w-6 h-6" />,
  },
];

export default function AIProjectGuidePage() {
  const router = useRouter();

  const handleProjectClick = (projectId: string) => {
    console.log("Selected project:", projectId);
    // TODO: Navigate to project discussion or details
  };

  const handleStartDiscussion = () => {
    console.log("Start new project discussion");
    // TODO: Open chat or discussion interface
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white px-6 sm:px-8 pt-8 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-12">
          {/* Icon */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center mb-6 shadow-lg">
            <Rocket className="w-16 h-16 text-teal-700" />
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            AI Project Guide
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
            Your intelligent assistant for project planning, execution, and
            success. Get personalized project suggestions and step-by-step
            guidance.
          </p>
        </div>

        {/* Popular Project Ideas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Project Ideas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectIdeas.map((project) => (
              <button
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-teal-500 hover:shadow-lg transition-all duration-300 text-left group"
              >
                <div className="text-gray-600 group-hover:text-teal-700 transition-colors">
                  {project.icon}
                </div>
                <span className="text-base font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                  {project.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Start New Discussion Button */}
        <div className="flex justify-center">
          <button
            onClick={handleStartDiscussion}
            className="px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Start New Project Discussion
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            What I can help you with:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Project Ideas
              </h4>
              <p className="text-sm text-gray-600">
                Get innovative project suggestions tailored to your interests
                and skills
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Step-by-Step Guidance
              </h4>
              <p className="text-sm text-gray-600">
                Receive detailed roadmaps and actionable steps for project
                execution
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Team Collaboration
              </h4>
              <p className="text-sm text-gray-600">
                Find the right team members and manage your project effectively
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
