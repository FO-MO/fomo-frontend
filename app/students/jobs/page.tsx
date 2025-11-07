"use client";
import React, { useState } from "react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FiMapPin, FiDollarSign, FiCalendar } from "react-icons/fi";

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

// const mockJobs: Job[] = [
//   {
//     id: 1,
//     title: "Backend Developer",
//     company: "FOOMO",
//     location: "Remote",
//     salary: "Salary not specified",
//     postedDate: "Jul 28, 2025",
//     description:
//       "Looking for a intern in backend that understands backend API calls",
//     tags: ["internship", "mid"],
//     type: "internship",
//   },
//   {
//     id: 2,
//     title: "Frontend React Developer",
//     company: "TechCorp",
//     location: "San Francisco, CA",
//     salary: "$80,000 - $120,000",
//     postedDate: "Nov 1, 2025",
//     description:
//       "Build responsive web applications using React, TypeScript, and modern frontend technologies. Work with a talented team on cutting-edge projects.",
//     tags: ["full-time", "mid-level", "react", "typescript"],
//     type: "full-time",
//   },
//   {
//     id: 3,
//     title: "Full Stack Engineer Intern",
//     company: "Startup Labs",
//     location: "New York, NY",
//     salary: "$25/hour",
//     postedDate: "Oct 28, 2025",
//     description:
//       "Join our fast-paced startup as a full stack intern. Learn from experienced engineers while building real products. Experience with Node.js and React preferred.",
//     tags: ["internship", "entry-level", "full-stack"],
//     type: "internship",
//   },
//   {
//     id: 4,
//     title: "Data Scientist",
//     company: "DataVision AI",
//     location: "Boston, MA",
//     salary: "$110,000 - $150,000",
//     postedDate: "Oct 25, 2025",
//     description:
//       "Analyze large datasets, build machine learning models, and derive actionable insights. Strong Python and ML experience required.",
//     tags: ["full-time", "senior", "machine-learning", "python"],
//     type: "full-time",
//   },
//   {
//     id: 5,
//     title: "Mobile App Developer - iOS",
//     company: "AppWorks",
//     location: "Remote",
//     salary: "$90,000 - $130,000",
//     postedDate: "Oct 22, 2025",
//     description:
//       "Develop native iOS applications using Swift and SwiftUI. 3+ years of experience building production iOS apps required.",
//     tags: ["full-time", "mid-level", "ios", "swift"],
//     type: "full-time",
//   },
//   {
//     id: 6,
//     title: "DevOps Engineer",
//     company: "CloudScale",
//     location: "Austin, TX",
//     salary: "$100,000 - $140,000",
//     postedDate: "Oct 20, 2025",
//     description:
//       "Manage cloud infrastructure, CI/CD pipelines, and deployment automation. Experience with AWS, Docker, and Kubernetes required.",
//     tags: ["full-time", "senior", "devops", "aws"],
//     type: "full-time",
//   },
//   {
//     id: 7,
//     title: "UI/UX Design Intern",
//     company: "DesignHub",
//     location: "Los Angeles, CA",
//     salary: "$20/hour",
//     postedDate: "Oct 18, 2025",
//     description:
//       "Create beautiful user interfaces and engaging user experiences. Portfolio required. Experience with Figma and Adobe XD preferred.",
//     tags: ["internship", "entry-level", "design", "ui/ux"],
//     type: "internship",
//   },
//   {
//     id: 8,
//     title: "Product Manager",
//     company: "InnovateTech",
//     location: "Seattle, WA",
//     salary: "$120,000 - $160,000",
//     postedDate: "Oct 15, 2025",
//     description:
//       "Lead product strategy and roadmap for our flagship SaaS platform. Work cross-functionally with engineering, design, and business teams.",
//     tags: ["full-time", "senior", "product", "saas"],
//     type: "full-time",
//   },
//   {
//     id: 9,
//     title: "Cybersecurity Analyst",
//     company: "SecureNet",
//     location: "Washington, DC",
//     salary: "$85,000 - $115,000",
//     postedDate: "Oct 12, 2025",
//     description:
//       "Monitor security systems, respond to incidents, and implement security best practices. Security+ or CISSP certification preferred.",
//     tags: ["full-time", "mid-level", "security", "cybersecurity"],
//     type: "full-time",
//   },
//   {
//     id: 10,
//     title: "Machine Learning Research Intern",
//     company: "AI Research Lab",
//     location: "Cambridge, MA",
//     salary: "$30/hour",
//     postedDate: "Oct 10, 2025",
//     description:
//       "Contribute to cutting-edge ML research projects. Strong background in mathematics, statistics, and deep learning required. PhD students preferred.",
//     tags: ["internship", "research", "machine-learning", "ai"],
//     type: "internship",
//   },
//   {
//     id: 11,
//     title: "QA Automation Engineer",
//     company: "TestPro",
//     location: "Denver, CO",
//     salary: "$75,000 - $100,000",
//     postedDate: "Oct 8, 2025",
//     description:
//       "Build and maintain automated testing frameworks. Experience with Selenium, Jest, and CI/CD pipelines required.",
//     tags: ["full-time", "mid-level", "qa", "automation"],
//     type: "full-time",
//   },
//   {
//     id: 12,
//     title: "Software Engineering Intern - Summer 2026",
//     company: "Google",
//     location: "Mountain View, CA",
//     salary: "$45/hour",
//     postedDate: "Oct 5, 2025",
//     description:
//       "Work on Google's core products and infrastructure. Exceptional coding skills and CS fundamentals required. Currently pursuing a CS degree.",
//     tags: ["internship", "entry-level", "software-engineering"],
//     type: "internship",
//   },
// ];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const token = localStorage.getItem("fomo_token");
const res = await fetch(`${BACKEND_URL}/api/jobs?populate=*`, {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await res.json();

console.log("Fetched jobs:", data.data);

const mockJobs: Job[] = data.data.map((job: any) => {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    postedDate: job.date,
    description: job.description,
    salary: job.salary,
    tags: job.skill,
    type: "internship",
  };
});

console.log("Fetched jobs:", mockJobs);

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

  return (
    <main className="w-full px-6 sm:px-8 pt-8 pb-16">
      <h1 className="text-3xl font-extrabold mb-6">Jobs & Employers</h1>
      <div className="flex gap-2 mb-8">
        <button
          className={`px-5 py-2 rounded-xl border-2 font-medium shadow-sm focus:outline-none focus:ring-2 ring-offset-2 transition-all duration-100 mr-2 ${
            tab === "jobs"
              ? "bg-white border-[#0f4f4a] text-black"
              : "bg-white border-[#f1f1f1] text-black"
          }`}
          onClick={() => setTab("jobs")}
        >
          Job Listings{" "}
          <span className="ml-1 text-gray-500">({mockJobs.length})</span>
        </button>
        <button
          className={`px-5 py-2 rounded-xl border-2 font-medium shadow-sm focus:outline-none focus:ring-2 ring-offset-2 transition-all duration-100 ml-2 ${
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
          {mockJobs.map((job: Job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-5 flex-1">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <HiOutlineBuildingOffice2 className="text-3xl text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-semibold">{job.title}</span>
                    <span className="text-gray-500 text-sm">{job.company}</span>
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
              <button className="bg-[#185c5a] hover:bg-[#134846] text-white px-7 py-3 rounded-xl font-semibold text-lg transition-colors flex-shrink-0 ml-4">
                Apply Now
              </button>
            </div>
          ))}
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
    </main>
  );
}
