"use client";

import React from "react";

export type Profile = {
  id: string | number;
  name: string;
  email: string;
  avatarUrl?: string | null;
  skills?: string[];
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
};

type Props = {
  profile: Profile;
  onFollowToggle?: (profileId: string | number) => void;
};

export default function SearchCard({ profile, onFollowToggle }: Props) {
  const handleFollowClick = () => {
    if (onFollowToggle) {
      onFollowToggle(profile.id);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  return (
    <article className="w-full bg-white rounded-2xl overflow-hidden shadow-md p-6 flex flex-col h-96 relative">
      {/* Follow Button - Absolutely positioned */}
      <button
        onClick={handleFollowClick}
        className="absolute cursor-pointer top-8 right-5 bg-teal-700 text-white px-1 py-1.5 rounded-md text-[10px] font-medium hover:bg-teal-800 transition-colors flex items-center gap-1 z-10"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
        </svg>
        {profile.isFollowing ? "Following" : "Follow"}
      </button>

      {/* Profile Header */}
      <div className="flex items-start mb-6 min-h-[80px] pr-20">
        <div className="flex items-center gap-4">
          {/* Profile Picture */}
          <div className="w-14 h-14 rounded-full bg-teal-700 flex items-center justify-center">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="text-white text-base font-semibold">
                {getInitials(profile.name)}
              </div>
            )}
          </div>

          {/* Name and Email */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
              {profile.name}
            </h3>
            <p className="text-gray-600 text-sm truncate">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-6 flex-1 min-h-[100px] flex flex-col">
        <h4 className="text-gray-700 font-medium mb-3 text-sm">Skills</h4>
        <div className="flex flex-wrap gap-2 flex-1 content-start">
          {profile.skills && profile.skills.length > 0 ? (
            <>
              {profile.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full h-fit"
                >
                  {skill}
                </span>
              ))}
              {profile.skills.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full h-fit">
                  +{profile.skills.length - 3} more
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400 text-sm">No skills listed</span>
          )}
        </div>
      </div>

      {/* Followers and Following */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 min-h-[70px]">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {profile.followersCount ?? 0}
          </div>
          <div className="text-sm text-gray-600 mt-1">Followers</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {profile.followingCount ?? 0}
          </div>
          <div className="text-sm text-gray-600 mt-1">Following</div>
        </div>
      </div>
    </article>
  );
}
