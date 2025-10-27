"use client";
import React from "react";

export default function JobCard({
  title = "Software Engineer",
  status = "Active",
  company = "Fomo College",
  type = "Full-time",
  duration = "6 months",
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 w-full hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h2>
        <button
          disabled
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </button>
      </div>

      {/* Details */}
      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <p className="flex items-center gap-2 text-sm text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-500"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>{company}</p>
        <p className="flex items-center gap-2 text-sm text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-500"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>{type}</p>
        <p className="flex items-center gap-2 text-sm text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>{duration}</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-between gap-2 mt-auto">
        <button className="flex-1 sm:flex-none px-3 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition">
          View Details
        </button>
        <button className="flex-1 sm:flex-none px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          Manage
        </button>
      </div>
    </div>
  );
}
