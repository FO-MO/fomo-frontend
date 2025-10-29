"use client";

import React from "react";

type PostAuthor = {
  name: string;
  initials: string;
};

type PostStats = {
  likes: number;
  comments: number;
  shares?: number;
};

export type Post = {
  id: string;
  author: PostAuthor;
  postedAgo: string;
  message: string;
  stats: PostStats;
};

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  const { author, postedAgo, message, stats } = post;

  return (
    <article className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 flex flex-col gap-3">
      {/* Header with author info and menu */}
      <header className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-black">
            {author.initials.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-black leading-tight text-sm">
              {author.name}
            </p>
            <p className="text-xs text-gray-600">{postedAgo}</p>
          </div>
        </div>

        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-md transition"
          aria-label="Post options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </header>

      {/* Post Message */}
      <div className="text-black whitespace-pre-line">
        <p className="text-sm leading-relaxed">{message}</p>
      </div>

      {/* Reactions Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 py-2 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="font-medium text-black">{stats.likes} Likes</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-medium text-black hover:text-gray-700 cursor-pointer">
            {stats.comments} Comments
          </span>
          <span className="font-medium text-black hover:text-gray-700 cursor-pointer">
            {stats.shares ?? 0} Shares
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 pt-2">
        <div className="grid grid-cols-4 gap-1">
          <button className="flex items-center justify-center gap-1 py-2 rounded-md hover:bg-gray-100 transition text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2.293-2.293a1 1 0 00-1.414 0L13 8m7-1l-2 2m0 0L9 4m0 0l2 2m0 0l7 7"
              />
            </svg>
            <span className="hidden sm:inline text-xs font-medium">Like</span>
          </button>

          <button className="flex items-center justify-center gap-1 py-2 rounded-md hover:bg-gray-100 transition text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.966 9.966 0 01-4.255-.876L3 20l1.276-3.744A9.966 9.966 0 014 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="hidden sm:inline text-xs font-medium">
              Comment
            </span>
          </button>

          <button className="flex items-center justify-center gap-1 py-2 rounded-md hover:bg-gray-100 transition text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="hidden sm:inline text-xs font-medium">Share</span>
          </button>

          <button className="flex items-center justify-center gap-1 py-2 rounded-md hover:bg-gray-100 transition text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="hidden sm:inline text-xs font-medium">Send</span>
          </button>
        </div>
      </div>
    </article>
  );
}
