"use client";
import React, { useState, useEffect } from "react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FiMapPin, FiDollarSign, FiCalendar } from "react-icons/fi";
import { fetchData } from "@/lib/strapi/strapiData";
import JobDetailsModal from "@/components/student-section/JobDetailsModal";
import { getAuthTokenCookie } from "@/lib/cookies";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedDate: string;
  description: string;
  tags: string[];
  type: string;
}

const employers = [
  {
    name: "Connect",
    joined: "Sep 12, 2025",
    description: "",
    tag: null,
    website: null,
  },
  {
    name: "uplyfto pvt ltd",
    joined: "Sep 12, 2025",
    description: "",
    tag: null,
    website: null,
  },
  {
    name: "Connect",
    joined: "Aug 3, 2025",
    description: "AI that automates in upskilling and networking",
    tag: "ed tech",
    website: null,
  },
  {
    name: "FOOMO",
    joined: "Jul 28, 2025",
    description: "AI that automates in upskilling and networking",
    tag: null,
    website: "#",
  },
];

export default function JobsPage() {
  const [tab, setTab] = useState<"jobs" | "employers">("jobs");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mockJobs, setMockJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = getAuthTokenCookie();
        const data = (await fetchData(token, "jobs?populate=*")) as {
          data?: Array<{
            id?: number;
            title?: string;
            company?: string;
            location?: string;
            date?: string;
            description?: string;
            salary?: string;
            skill?: string[];
          }>;
        };

        const jobs: Job[] = (data.data || []).map((job) => {
          return {
            id: job.id || 0,
            title: job.title || "Unknown Job",
            company: job.company || "Unknown Company",
            location: job.location || "Unknown Location",
            postedDate: job.date || "Unknown Date",
            description: job.description || "No description",
            salary: job.salary || "Not specified",
            tags: job.skill || [],
            type: "internship",
          };
        });

        console.log("Fetched jobs:", jobs);
        setMockJobs(jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleApply = () => {
    alert(
      `Application submitted for ${selectedJob?.title} at ${selectedJob?.company}!`
    );
    handleCloseModal();
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-20 bg-white min-h-screen">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6">Jobs & Employers</h1>
        <div className="flex gap-2 mb-8">
          <button
            className={`px-5 py-2 rounded-xl border-2 font-medium shadow-sm focus:outline-none focus:ring-2 ring-offset-2 transition-all duration-100 ${
              tab === "jobs"
                ? "bg-white border-[#0f4f4a] text-black"
                : "bg-white border-[#f1f1f1] text-black"
            }`}
            onClick={() => setTab("jobs")}
          >
            College Jobs{" "}
            <span className="ml-1 text-gray-500">({mockJobs.length})</span>
          </button>
          <button
            className={`px-5 py-2 rounded-xl border-2 font-medium shadow-sm focus:outline-none focus:ring-2 ring-offset-2 transition-all duration-100 ${
              tab === "employers"
                ? "bg-white border-[#0f4f4a] text-black"
                : "bg-white border-[#f1f1f1] text-black"
            }`}
            onClick={() => setTab("employers")}
          >
            Employers <span className="ml-1">(4)</span>
          </button>
        </div>

        {tab === "jobs" && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-600">Loading jobs...</p>
              </div>
            ) : mockJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No jobs available at the moment.
              </div>
            ) : (
              mockJobs.map((job: Job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleJobClick(job)}
                >
                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center gap-5 flex-1">
                      <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                        <HiOutlineBuildingOffice2 className="text-3xl text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl font-semibold">
                            {job.title}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {job.company}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500 text-sm mb-2 flex-wrap">
                          <span className="flex items-center gap-1">
                            <FiMapPin /> {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            {"₹" + job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar /> Posted {job.postedDate}
                          </span>
                        </div>
                        <div className="mb-2 text-black line-clamp-2">
                          {job.description}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {job.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      className="bg-[#185c5a] hover:bg-[#134846] text-white px-7 py-3 rounded-xl font-semibold text-lg transition-colors flex-shrink-0 ml-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobClick(job);
                      }}
                    >
                      View Details
                    </button>
                  </div>

                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                        <HiOutlineBuildingOffice2 className="text-2xl text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {job.company}
                        </p>
                        <div className="flex flex-col gap-1 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <FiMapPin className="w-3 h-3" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            {"₹" + job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" /> Posted{" "}
                            {job.postedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                        {job.description}
                      </p>
                      <div className="flex gap-1 flex-wrap">
                        {job.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {job.tags.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs font-medium">
                            +{job.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      className="w-full bg-[#185c5a] hover:bg-[#134846] text-white py-3 rounded-lg font-medium text-sm transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobClick(job);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "employers" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {employers.map((emp, idx) => (
              <div
                key={emp.name + idx}
                className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 flex flex-col min-h-[180px] justify-between"
              >
                <div className="flex items-center gap-5 mb-2">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <HiOutlineBuildingOffice2 className="text-3xl text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-semibold">{emp.name}</span>
                      {emp.tag && (
                        <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium ml-2">
                          {emp.tag}
                        </span>
                      )}
                    </div>
                    {emp.description && (
                      <div className="text-black text-sm mb-1">
                        {emp.description}
                      </div>
                    )}
                    <div className="text-gray-500 text-sm">
                      Joined {emp.joined}
                    </div>
                  </div>
                </div>
                {emp.website && (
                  <a
                    href={emp.website}
                    className="mt-4 inline-block px-6 py-2 rounded-xl border border-[#e5e7eb] bg-white text-black font-semibold text-base text-center hover:bg-gray-50 transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Job Details Modal */}
        <JobDetailsModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onApply={handleApply}
        />
      </section>
    </div>
  );
}
