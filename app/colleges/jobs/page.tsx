"use client";

import React, { useState } from "react";
import CollegesSideBar from "@/components/bars/collegesSideBar";
import Navbar from "@/components/bars/Navbar";
import Link from "next/link";

export default function CollegeJobs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = "/colleges/jobs";

  const tabs = [
    { label: "Overview", href: "/colleges/dashboard" },
    { label: "Students", href: "/colleges/students" },
    { label: "Jobs", href: "/colleges/jobs" },
    { label: "Events", href: "/colleges/events" },
    { label: "Analytics", href: "/colleges/analytics" },
  ];

  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen mt-6 sm:mt-16 bg-gray-50 overflow-x-hidden">
      <Navbar />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`
        fixed left-0 top-0 z-50 w-56 h-full transform transition-transform duration-300 ease-in-out sm:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
      `}
      >
        <CollegesSideBar active="placements" />
      </div>

      <button
        className="fixed top-20 left-0 px-3 scale-110 z-[60] py-[3px] border-1 border-black/30 cursor-pointer rounded-br-2xl bg-white shadow-lg sm:hidden hover:bg-gray-50 transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-5 h-5 text-black object-cover"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {sidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <main className="sm:ml-56 pt-20 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Job Postings
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Manage Job Opportunities</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
              + Post New Job
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex bg-white border-1 border-black/5 rounded-full overflow-x-auto gap-2 mb-8 py-1 -mx-4 px-4 sm:mx-0 sm:px-2 scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-1 sm:px-2 py-1 flex-1 sm:py-2 cursor-pointer rounded-lg whitespace-nowrap text-sm sm:text-base font-medium transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md flex-shrink-0 scale-95 text-center ${
                  isActive
                    ? "bg-teal-800 text-white shadow-lg -translate-y-0.5"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Software Engineer</h3>
                  <p className="text-sm text-gray-600">Google</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
            </div>
            <p className="text-gray-600 mb-4">Looking for talented software engineers to join our team...</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>📍 Mountain View, CA</span>
              <span>💰 $120K - $180K</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">42 applications</span>
              <button className="text-teal-600 hover:text-teal-700 font-medium">View Details →</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Product Manager</h3>
                  <p className="text-sm text-gray-600">Microsoft</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
            </div>
            <p className="text-gray-600 mb-4">Join our product team to build innovative solutions...</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>📍 Seattle, WA</span>
              <span>💰 $130K - $160K</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">28 applications</span>
              <button className="text-teal-600 hover:text-teal-700 font-medium">View Details →</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
