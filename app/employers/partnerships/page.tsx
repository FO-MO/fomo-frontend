"use client";

import React, { useState } from "react";
import PartnershipCard from "@/components/employee-section/PartnershipCard";
import SubBar from "@/components/subBar";

export default function PartnershipsPage() {
  const [partnerships, setPartnerships] = useState([
    {
      id: 1,
      name: "Indian Institute of Technology Delhi",
      location: "New Delhi",
      verified: true,
      badge: "Platinum",
      tier: "Tier-1",
      placementRate: 95.5,
      avgPackage: "₹18.0L",
      students: "8.5K",
      placementTrend: [60, 70, 75, 85, 95],
      packageGrowth: [50, 60, 70, 75, 80],
      activeJobs: 1,
      rating: 4.7,
    },
    {
      id: 2,
      name: "Indian Institute of Technology Bombay",
      location: "Mumbai",
      verified: true,
      badge: "Gold",
      tier: "Tier-1",
      placementRate: 97.2,
      avgPackage: "₹22.0L",
      students: "9.0K",
      placementTrend: [65, 75, 80, 90, 97],
      packageGrowth: [55, 65, 75, 85, 10],
      activeJobs: 3,
      rating: 4.6,
    },
    {
      id: 3,
      name: "Birla Institute of Technology and Science",
      location: "Pilani",
      verified: true,
      badge: "Bronze",
      tier: "Tier-1",
      placementRate: 94.1,
      avgPackage: "₹16.0L",
      students: "4.2K",
      placementTrend: [58, 68, 78, 88, 94],
      packageGrowth: [48, 20, 68, 73, 78],
      activeJobs: 0,
      rating: 4.5,
    },
    {
      id: 4,
      name: "National Institute of Technology Trichy",
      location: "Tiruchirappalli",
      verified: true,
      badge: "Bronze",
      tier: "Tier-1",
      placementRate: 92.8,
      avgPackage: "₹14.0L",
      students: "6.5K",
      placementTrend: [55, 65, 75, 85, 93],
      packageGrowth: [45, 55, 65, 70, 75],
      activeJobs: 0,
      rating: 4.5,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All Tiers");
  const [locationFilter, setLocationFilter] = useState("All Locations");

  //SEARCH BAR MECHANISM
  const filteredPartnerships = partnerships.filter((partnership) => {
    const matchesSearch =
      partnership.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partnership.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier =
      tierFilter === "All Tiers" || partnership.tier === tierFilter;
    const matchesLocation =
      locationFilter === "All Locations" ||
      partnership.location.includes(locationFilter);
    return matchesSearch && matchesTier && matchesLocation;
  });
  //

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <SubBar
          items={[
            { url: "/employers/overview", name: "Overview", logo: "👤" },
            {
              url: "/employers/performance",
              name: "Applications",
              logo: "📈",
            },
            {
              url: "/employers/partnerships",
              name: "College Partnerships",
              logo: "💬",
            },
            {
              url: "/employers/overview/engagement",
              name: "Job Postings",
              logo: "💬",
            },
            {
              url: "/employers/overview/engagement",
              name: "Analytics",
              logo: "💬",
            },
          ]}
          className="mb-10"
        />
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                College Partnerships
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Build relationships with top educational institutions
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-semibold">
                <span>+</span>
                Add Partnership
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search colleges by name or location..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
            >
              <option>All Tiers</option>
              <option>Tier-1</option>
              <option>Tier-2</option>
              <option>Tier-3</option>
            </select>
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option>All Locations</option>
              <option>Delhi</option>
              <option>Mumbai</option>
              <option>Pilani</option>
              <option>Tiruchirappalli</option>
            </select>
          </div>
        </div>

        {/* Partnership Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPartnerships.map((partnership) => (
            <PartnershipCard key={partnership.id} {...partnership} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPartnerships.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No partnerships found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
