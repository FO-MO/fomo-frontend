"use client";

import React from "react";

export default function OverviewCards2() {
  const performanceData = [
    {
      label: "Application Rate",
      percentage: 68,
      change: "+24% this month",
      color: "bg-teal-700",
    },
    {
      label: "Interview Conversion",
      percentage: 68,
      change: null,
      color: "bg-teal-700",
    },
    {
      label: "Offer Acceptance",
      percentage: 85,
      change: null,
      color: "bg-teal-700",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-[0px_0px_3px_#0006] p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        <h2 className="text-xl font-bold text-gray-900">Hiring Performance</h2>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-6">
        {performanceData.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                {item.change && (
                  <span className="text-xs font-semibold text-gray-900">
                    {item.change}
                  </span>
                )}
                {!item.change && (
                  <span className="text-sm font-bold text-gray-900">
                    {item.percentage}%
                  </span>
                )}
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
