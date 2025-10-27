"use client";

import React, { useState } from "react";
import CollegesSideBar from "@/components/collegesSideBar";
import Navbar from "@/components/Navbar";

export default function CollegeDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Students"); // ✅ default active tab
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

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-md bg-gray-200 text-grey-800 hover:bg-gray-300 transition">
              Export Data
            </button>
            <button className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700transition">
              Add Student
            </button>
          </div>
        </div>


        <div className="overflow-x-auto mt-6 rounded-lg">
          <table className="min-w-full border border-gray-200 bg-white rounded-lg">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Student</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Course</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Year</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Applications</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ai Score</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-m">
                  <p className="text-gray-800 font-medium">Aarav Sharma</p>
                  <p className="text-gray-500 text-sm">student@college.edu</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">Computer Science</td>
                <td className="px-6 py-4 text-sm text-gray-700">Final Year</td>
                <td className="px-6 py-4 text-sm text-gray-700">12</td>
                <td className="px-6 py-4 text-sm text-gray-700"><button disabled className="px-2 rounded-full bg-green-300 text-green-900 cursor-default select-none">Hired</button></td>
                <td className="px-6 py-4 text-sm text-gray-700">95%</td>
                <td className="px-6 py-4 text-sm text-gray-700">View</td>
                <td className="px-6 py-4 text-sm text-gray-700"><button className="px-4 py-2 rounded-md bg-white text-teal-700 border border-teal-700 hover:bg-teal-700 hover:text-white transition">Message</button></td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-m">
                  <p className="text-gray-800 font-medium">Priya Patel</p>
                  <p className="text-gray-500 text-sm">student@college.edu</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">Computer Science</td>
                <td className="px-6 py-4 text-sm text-gray-700">Final Year</td>
                <td className="px-6 py-4 text-sm text-gray-700">12</td>
                <td className="px-6 py-4 text-sm text-gray-700"><button disabled className="px-2 rounded-full bg-yellow-200 text-yellow-1000 cursor-default select-none">Interview</button></td>
                <td className="px-6 py-4 text-sm text-gray-700">95%</td>
                <td className="px-6 py-4 text-sm text-gray-700">View</td>
                <td className="px-6 py-4 text-sm text-gray-700"><button className="px-4 py-2 rounded-md bg-white text-teal-700 border border-teal-700 hover:bg-teal-700 hover:text-white transition">Message</button></td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-m">
                  <p className="text-gray-800 font-medium">Rahul Kumar</p>
                  <p className="text-gray-500 text-sm">student@college.edu</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">Computer Science</td>
                <td className="px-6 py-4 text-sm text-gray-700">Final Year</td>
                <td className="px-6 py-4 text-sm text-gray-700">12</td>
                <td className="px-6 py-4 text-sm text-gray-700"><button disabled className="px-2 rounded-full bg-gray-400 text-gray-800 cursor-default select-none">Pending</button></td>
                <td className="px-6 py-4 text-sm text-gray-700">95%</td>
                <td className="px-6 py-4 text-sm text-gray-700">View</td>
                <td className="px-6 py-4 text-sm text-gray-700"><button className="px-4 py-2 rounded-md bg-white text-teal-700 border border-teal-700 hover:bg-teal-700 hover:text-white transition">Message</button></td>
              </tr>   
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
