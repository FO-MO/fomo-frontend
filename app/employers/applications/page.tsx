"use client";

import React, { useState } from "react";
import SubBar from "@/components/subBar";
import {
  Search,
  User2,
  Clock,
  Eye,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Building2,
} from "lucide-react";

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [collegeFilter, setCollegeFilter] = useState("All Colleges");

  const stats = [
    {
      label: "Total",
      value: 0,
      icon: <User2 className="h-5 w-5 text-gray-700" />,
      color: "bg-emerald-50 border-emerald-100",
    },
    {
      label: "Pending",
      value: 0,
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      color: "bg-yellow-50 border-yellow-100",
    },
    {
      label: "Reviewed",
      value: 0,
      icon: <Eye className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-50 border-blue-100",
    },
    {
      label: "Interview",
      value: 0,
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-50 border-purple-100",
    },
    {
      label: "Accepted",
      value: 0,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      color: "bg-green-50 border-green-100",
    },
    {
      label: "Rejected",
      value: 0,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      color: "bg-red-50 border-red-100",
    },
    {
      label: "Colleges",
      value: 0,
      icon: <Building2 className="h-5 w-5 text-indigo-500" />,
      color: "bg-indigo-50 border-indigo-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <SubBar
                      items={[
                        { url: "/employers/overview", name: "Overview", logo: "👤" },
                        { url: "/employers/applications", name: "Applications", logo: "📈" },
                        { url: "/employers/partnerships", name: "College Partnerships", logo: "🎓" },
                        { url: "/employers/jobpostings", name: "Job Postings", logo: "🧳" },
                        { url: "/employers/analytics", name: "Analytics", logo: "📊" },
                      ]}
                      className="mb-10"
                    />
            <div className="flex flex-col p-6 space-y-6">
            {/* Stats Section */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
                {stats.map((item, idx) => (
                <div
                    key={idx}
                    className={`flex flex-col items-center justify-center rounded-lg ${item.color} border shadow-sm p-5 transition hover:shadow-md hover:bg-white`}
                >
                    <div className="p-2 rounded-md bg-white shadow-sm mb-2">
                    {item.icon}
                    </div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="text-xl font-extrabold text-gray-900 mt-1">
                    {item.value}
                    </p>
                </div>
                ))}
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                {/* Search */}
                <div className="flex items-center w-full sm:w-1/2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-100">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-2 outline-none bg-transparent text-sm"
                />
                </div>

                {/* Filters */}
                <div className="flex gap-3 w-full sm:w-auto">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-100"
                >
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Reviewed</option>
                    <option>Interview</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                </select>

                <select
                    value={collegeFilter}
                    onChange={(e) => setCollegeFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-100"
                >
                    <option>All Colleges</option>
                    <option>IIT Delhi</option>
                    <option>IIT Bombay</option>
                    <option>NIT Trichy</option>
                    <option>VIT Vellore</option>
                    <option>SRM University</option>
                </select>
                </div>
            </div>

            {/* No Applications */}
            <div className="flex flex-col items-center justify-center bg-white p-12 rounded-lg border border-gray-100 shadow-sm">
                <User2 className="h-10 w-10 text-gray-400" />
                <p className="mt-3 text-lg font-semibold text-gray-700">
                No Applications Found
                </p>
                <p className="text-sm text-gray-500 mt-1">
                You haven't received any applications yet.
                </p>
            </div>
        </div>
        </div>
    </div>
  );
}
