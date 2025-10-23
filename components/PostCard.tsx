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
    <article className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
      <header className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
            {author.initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">
              {author.name}
            </p>
            <p className="text-sm text-gray-500">{postedAgo}</p>
          </div>
        </div>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition"
          aria-label="Post options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </header>

      <p className="text-gray-800 whitespace-pre-line">{message}</p>

      <footer className="flex items-center gap-6 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          {stats.likes}
        </span>
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3.75h5.25m-10.5 3.375V6.75a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6.75v8.629a2.25 2.25 0 01-2.25 2.25H8.309a2.25 2.25 0 00-1.591.659l-2.772 2.772c-.516.516-1.401.151-1.401-.58z"
            />
          </svg>
          {stats.comments}
        </span>
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12a7.5 7.5 0 0112.38-5.742l.87-.87a.75.75 0 011.28.53v4.25a.75.75 0 01-.75.75h-4.25a.75.75 0 01-.53-1.28l1.22-1.22A5.998 5.998 0 006 12a6 6 0 009.743 4.743.75.75 0 11.994 1.124A7.5 7.5 0 114.5 12z"
            />
          </svg>
          {stats.shares ?? 0}
        </span>
      </footer>
    </article>
  );
}
