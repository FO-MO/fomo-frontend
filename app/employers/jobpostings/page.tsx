"use client";

import React, { useState } from "react";
import SubBar from "@/components/subBar";

export default function JobPostingsPage() {
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    jobType: "Full Time",
    experience: "Entry Level",
    location: "",
    deadline: "",
    description: "",
    skills: [] as string[],
    requirements: [] as string[],
    benefits: [] as string[],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newReq, setNewReq] = useState("");
  const [newBen, setNewBen] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (formData.title.trim().length < 5)
      newErrors.title = "Job title must be at least 5 characters";
    if (!formData.location.trim())
      newErrors.location = "Location is required";
    if (formData.description.trim().length < 50)
      newErrors.description = "Job description must be at least 50 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const addItem = (field: "skills" | "requirements" | "benefits", value: string) => {
    if (!value.trim()) return;
    setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
    if (field === "skills") setNewSkill("");
    if (field === "requirements") setNewReq("");
    if (field === "benefits") setNewBen("");
  };

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
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Your Job Postings</h1>

          {/* Empty State */}
          <div className="border rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-white shadow-sm">
            <div className="text-gray-500 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2h6v2m2 0a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2m10 0H7" />
              </svg>
            </div>
            <p className="text-lg font-medium">No jobs posted yet</p>
            <p className="text-gray-500 mb-4">Start attracting top talent by posting your first job opening.</p>
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition flex items-center gap-2"
            >
              +
              <span>Post Your First Job</span>
            </button>
          </div>

          {/* Modal */}
          {open && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setOpen(false)}
                >
                  ✕
                </button>
                <h2 className="text-xl font-semibold mb-1">Post a New Job</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Fill out the details below to post a new job opening.
                </p>

                {/* Job Title */}
                <div className="mb-4">
                  <label className="text-sm font-medium">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Software Engineer, Product Manager"
                    className="mt-1 w-full border rounded-md p-2"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                {/* Job Type / Experience */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Job Type</label>
                    <select
                      className="mt-1 w-full border rounded-md p-2"
                      value={formData.jobType}
                      onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    >
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium">Experience Level</label>
                    <select
                      className="mt-1 w-full border rounded-md p-2"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    >
                      <option>Entry Level</option>
                      <option>Mid Level</option>
                      <option>Senior Level</option>
                    </select>
                  </div>
                </div>

                {/* Location / Deadline */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Location</label>
                    <input
                      type="text"
                      placeholder="e.g., San Francisco, CA or Remote"
                      className="mt-1 w-full border rounded-md p-2"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium">Application Deadline (Optional)</label>
                    <input
                      type="date"
                      className="mt-1 w-full border rounded-md p-2"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-4">
                  <label className="text-sm font-medium">Job Description</label>
                  <textarea
                    placeholder="Describe the role, responsibilities, and what you’re looking for in a candidate..."
                    className="mt-1 w-full border rounded-md p-2 h-24"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <label className="text-sm font-medium">Skills Required (Optional)</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      placeholder="Add a skill..."
                      className="flex-1 border rounded-md p-2"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <button
                      onClick={() => addItem("skills", newSkill)}
                      className="px-3 py-2 border rounded-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill, i) => (
                      <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <label className="text-sm font-medium">Requirements (Optional)</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      placeholder="Add a requirement..."
                      className="flex-1 border rounded-md p-2"
                      value={newReq}
                      onChange={(e) => setNewReq(e.target.value)}
                    />
                    <button
                      onClick={() => addItem("requirements", newReq)}
                      className="px-3 py-2 border rounded-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.requirements.map((req, i) => (
                      <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">{req}</span>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <label className="text-sm font-medium">Benefits (Optional)</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      placeholder="Add a benefit..."
                      className="flex-1 border rounded-md p-2"
                      value={newBen}
                      onChange={(e) => setNewBen(e.target.value)}
                    />
                    <button
                      onClick={() => addItem("benefits", newBen)}
                      className="px-3 py-2 border rounded-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.benefits.map((ben, i) => (
                      <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">{ben}</span>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 border rounded-md hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                  >
                    Post Job
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toast */}
          {showToast && (
            <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-md shadow-md">
              Job posted successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
