"use client";

import { X, Upload, Camera } from "lucide-react";
import { useState, useRef } from "react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    name: string;
    email: string;
    profileImageUrl: string | null;
    backgroundImageUrl: string | null;
  };
  onSave: (data: {
    name: string;
    email: string;
    profileImage: File | null;
    backgroundImage: File | null;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      email,
      profileImage: profileImageFile,
      backgroundImage: backgroundImageFile,
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
