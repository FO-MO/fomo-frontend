"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ArrowRight,
  User,
  GraduationCap,
  MapPin,
  BookOpen,
} from "lucide-react";
import { getAuthToken } from "@/lib/strapi/auth";
import { createStudentProfile } from "@/lib/strapi/profile";
import Link from "next/link";
import { connect } from "http2";

// Predefined options
const AVAILABLE_SKILLS = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "Machine Learning",
  "UI/UX Design",
  "Docker",
  "AWS",
  "GraphQL",
  "TensorFlow",
  "MongoDB",
  "PostgreSQL",
  "Git",
  "Figma",
  "Flutter",
  "Swift",
  "Kotlin",
];

const AVAILABLE_INTERESTS = [
  "Artificial Intelligence",
  "Web Development",
  "Mobile Development",
  "Startups",
  "Product Design",
  "Open Source",
  "Hackathons",
  "Data Science",
  "Cloud Computing",
  "Cybersecurity",
  "Blockchain",
  "Game Development",
  "IoT",
  "DevOps",
];

export default function SetupProfilePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [institution, setInstitution] = useState("");
  const [major, setMajor] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Get user info from localStorage
    try {
      const userStr = localStorage.getItem("fomo_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.username) {
          setName(user.username);
        }
      }
    } catch (err) {
      console.error("Failed to parse user data:", err);
    }
  }, [router]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!name.trim()) {
          setError("Name is required");
          return false;
        }
        return true;
      case 2:
        if (!institution.trim() || !major.trim() || !graduationYear.trim()) {
          setError("All education fields are required");
          return false;
        }
        return true;
      case 3:
        if (!bio.trim() || !location.trim()) {
          setError("Bio and location are required");
          return false;
        }
        return true;
      case 4:
        if (selectedSkills.length === 0) {
          setError("Please select at least one skill");
          return false;
        }
        if (selectedInterests.length === 0) {
          setError("Please select at least one interest");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    setError("");
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        setError("You must be signed in to create a profile");
        setLoading(false);
        return;
      }

      // Get student ID from stored user
      let studentId: string | null = null;
      try {
        const userStr = localStorage.getItem("fomo_user");
        if (userStr) {
          const user = JSON.parse(userStr);
          studentId = user?.documentId || user?.id || null;
        }
      } catch (err) {
        console.error("Failed to get student ID:", err);
      }

      if (!studentId) {
        setError("Failed to identify user. Please log in again.");
        setLoading(false);
        return;
      }

      // Create profile
      const profileData = {
        studentId,
        name,
        about: bio,
        college: institution,
        course: major,
        graduationYear,
        location,
        skills: selectedSkills,
        interests: selectedInterests,
        user: {
          connect: [studentId],
        },
      };

      const result = await createStudentProfile(profileData, token);

      if (result) {
        // Profile created successfully
        // Store profile completion flag
        localStorage.setItem("profile_completed", "true");

        // Redirect to students dashboard
        router.push("/students");
      } else {
        setError("Failed to create profile. Please try again.");
      }
    } catch (err) {
      console.error("Profile creation error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Basic Information
              </h2>
              <p className="text-gray-600">Let's start with your name</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Education
              </h2>
              <p className="text-gray-600">
                Tell us about your academic background
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Institution *
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="e.g., Massachusetts Institute of Technology"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Major/Course *
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="e.g., Computer Science"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Graduation Year *
              </label>
              <input
                type="text"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="e.g., 2026"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                About You
              </h2>
              <p className="text-gray-600">Share more about yourself</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio *
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 resize-none"
                placeholder="Tell us about yourself, your interests, goals, and what you're passionate about..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., Cambridge, MA"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Skills & Interests
              </h2>
              <p className="text-gray-600">Choose what describes you best</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Skills * ({selectedSkills.length} selected)
              </label>
              <div className="max-h-60 overflow-y-auto border-2 border-gray-300 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-teal-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Interests * ({selectedInterests.length} selected)
              </label>
              <div className="max-h-60 overflow-y-auto border-2 border-gray-300 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <Link href="/">
        <div className="w-full border-b border-gray-300 py-4 px-12">
          <h1 className="text-black text-3xl font-bold">FOOMO</h1>
        </div>
      </Link>

      {/* Main Content */}
      <div className="flex flex-1 justify-center items-center p-4">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Step {currentStep} of 4
              </span>
              <span className="text-sm font-semibold text-teal-700">
                {Math.round((currentStep / 4) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg font-medium border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Profile..." : "Complete Setup"}
                  {!loading && <Check className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>

          {/* Skip Button */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => router.push("/students")}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Skip for now (you can complete this later)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
