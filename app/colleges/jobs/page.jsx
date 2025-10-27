"use client";

import React, { useState } from "react";
import CollegesSideBar from "@/components/collegesSideBar";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/Jobcard";


export default function CollegeDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Jobs"); 
  const tabs = ["Overview", "Students", "Jobs", "Events", "Analytics"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <Navbar />

      {/* BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed left-0 top-0 z-50 w-56 h-full transform transition-transform duration-300 ease-in-out sm:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <CollegesSideBar active="dashboard" />
      </div>

      {/* HAMBURGER BUTTON */}
      <button
        className="fixed top-12 left-0 z-[1001] p-2 rounded-t-lg cursor-pointer bg-gray-50 sm:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {sidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* MAIN HEADER */}
      <main className="sm:ml-56 pt-20 p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m-1 4h1m4-8h1m-1 4h1m-1 4h1"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600">College Name</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out ${
                activeTab === tab
                  ? "bg-teal-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
                <div className="flex gap-3">
                <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Add Job</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <JobCard />
                <JobCard title="Frontend Developer" status="Closed" />
                <JobCard title="Backend Engineer" status="Active" company="TechNova" />
                <JobCard title="DevOps Engineer" status="Closed" />
                <JobCard title="Cloud Engineer" status="Active" company="TechNova" />
            </div>
        </div>

      </main>
    </div>
  );
}
