"use client";

import React, { useState } from "react";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  Send,
} from "lucide-react";

type PostAuthor = {
  name: string;
  initials: string;
  avatarUrl?: string | null;
  title?: string; // Job title or student status
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
  images?: string[]; // Array of image URLs
  stats: PostStats;
  isLiked?: boolean;
};

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  const { author, postedAgo, message, images, stats } = post;
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(stats.likes);
  const [showFullText, setShowFullText] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  // Truncate long messages
  const shouldTruncate = message.length > 200;
  const displayMessage =
    shouldTruncate && !showFullText ? message.slice(0, 200) + "..." : message;

  return (
    <article className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Header with author info */}
      <header className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          {author.avatarUrl ? (
            <img
              src={author.avatarUrl}
              alt={author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-sm font-bold text-white">
              {author.initials.toUpperCase()}
            </div>
          )}

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 hover:text-teal-700 cursor-pointer text-sm">
              {author.name}
            </p>
            {author.title && (
              <p className="text-xs text-gray-600 leading-tight">
                {author.title}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-0.5">{postedAgo}</p>
          </div>
        </div>

        {/* Options Menu */}
        <button
          type="button"
          className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
          aria-label="Post options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </header>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
          {displayMessage}
        </div>
        {shouldTruncate && (
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="text-gray-600 hover:text-teal-700 font-medium text-sm mt-1"
          >
            {showFullText ? "Show less" : "...see more"}
          </button>
        )}
      </div>

      {/* Images */}
      {images && images.length > 0 && (
        <div className="mb-3">
          {images.length === 1 && (
            <div className="w-full">
              <img
                src={images[0]}
                alt="Post content"
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          {images.length === 2 && (
            <div className="grid grid-cols-2 gap-0.5">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Post content ${idx + 1}`}
                  className="w-full h-80 object-cover"
                />
              ))}
            </div>
          )}

          {images.length === 3 && (
            <div className="grid grid-cols-2 gap-0.5">
              <img
                src={images[0]}
                alt="Post content 1"
                className="w-full h-full row-span-2 object-cover"
              />
              <img
                src={images[1]}
                alt="Post content 2"
                className="w-full h-40 object-cover"
              />
              <img
                src={images[2]}
                alt="Post content 3"
                className="w-full h-40 object-cover"
              />
            </div>
          )}

          {images.length >= 4 && (
            <div className="grid grid-cols-2 gap-0.5">
              {images.slice(0, 3).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Post content ${idx + 1}`}
                  className="w-full h-40 object-cover"
                />
              ))}
              <div className="relative">
                <img
                  src={images[3]}
                  alt="Post content 4"
                  className="w-full h-40 object-cover"
                />
                {images.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      +{images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reactions Summary */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          {likeCount > 0 && (
            <>
              <div className="flex items-center -space-x-1">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center border border-white">
                  <ThumbsUp className="w-3 h-3 text-white fill-white" />
                </div>
              </div>
              <span className="hover:text-teal-700 hover:underline cursor-pointer ml-1">
                {likeCount}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {stats.comments > 0 && (
            <span className="hover:text-teal-700 hover:underline cursor-pointer">
              {stats.comments} {stats.comments === 1 ? "comment" : "comments"}
            </span>
          )}
          {(stats.shares ?? 0) > 0 && (
            <span className="hover:text-teal-700 hover:underline cursor-pointer">
              {stats.shares} {stats.shares === 1 ? "share" : "shares"}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 px-2 py-1">
        <div className="flex items-center justify-around">
          <button
            onClick={handleLike}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors flex-1 ${
              isLiked ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <ThumbsUp className={`w-5 h-5 ${isLiked ? "fill-blue-600" : ""}`} />
            <span className="text-sm font-semibold">Like</span>
          </button>

          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors flex-1 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Comment</span>
          </button>

          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors flex-1 text-gray-600">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-semibold">Share</span>
          </button>

          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors flex-1 text-gray-600">
            <Send className="w-5 h-5" />
            <span className="text-sm font-semibold">Send</span>
          </button>
        </div>
      </div>
    </article>
  );
}
