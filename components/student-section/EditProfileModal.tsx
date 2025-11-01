"use client";

import { X, Upload, Camera, Check } from "lucide-react";
import { useState, useRef } from "react";

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

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    name: string;
    email: string;
    profileImageUrl: string | null;
    backgroundImageUrl: string | null;
    institution?: string;
    major?: string;
    graduationYear?: string;
    location?: string;
    bio?: string;
    skills?: string[];
    interests?: string[];
  };
  onSave: (data: {
    name: string;
    email: string;
    profileImage: File | null;
    backgroundImage: File | null;
    institution: string;
    major: string;
    graduationYear: string;
    location: string;
    bio: string;
    skills: string[];
    interests: string[];
  }) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentData,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(currentData.name);
  const [email, setEmail] = useState(currentData.email);
  const [institution, setInstitution] = useState(currentData.institution || "");
  const [major, setMajor] = useState(currentData.major || "");
  const [graduationYear, setGraduationYear] = useState(
    currentData.graduationYear || ""
  );
  const [location, setLocation] = useState(currentData.location || "");
  const [bio, setBio] = useState(currentData.bio || "");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentData.skills || []
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentData.interests || []
  );

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    currentData.profileImageUrl
  );
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<
    string | null
  >(currentData.backgroundImageUrl);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(
    null
  );

  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      email,
      profileImage: profileImageFile,
      backgroundImage: backgroundImageFile,
      institution,
      major,
      graduationYear,
      location,
      bio,
      skills: selectedSkills,
      interests: selectedInterests,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Background Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Background Image
              </label>
              <div className="relative">
                {backgroundImagePreview ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                    <img
                      src={backgroundImagePreview}
                      alt="Background preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => backgroundImageInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => backgroundImageInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-teal-500 hover:bg-teal-50/50 transition-all"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600 font-medium">
                      Click to upload background image
                    </span>
                  </button>
                )}
                <input
                  ref={backgroundImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Profile Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Profile Picture
              </label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {profileImagePreview ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                      <img
                        src={profileImagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => profileImageInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => profileImageInputRef.current?.click()}
                      className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-teal-500 hover:bg-teal-50/50 transition-all"
                    >
                      <Upload className="w-6 h-6 text-gray-400" />
                    </button>
                  )}
                  <input
                    ref={profileImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => profileImageInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                  >
                    Change Picture
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Institution
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="e.g., Massachusetts Institute of Technology"
              />
            </div>

            {/* Major and Graduation Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Major
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., 2026"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                placeholder="e.g., Cambridge, MA"
              />
            </div>

            {/* Skills Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Skills ({selectedSkills.length} selected)
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
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

            {/* Interests Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Interests ({selectedInterests.length} selected)
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
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

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg font-medium border border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
