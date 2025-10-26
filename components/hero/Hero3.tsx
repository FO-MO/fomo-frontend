"use client";

import React from "react";

export default function Hero3() {
  const cards = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
        </svg>
      ),
      badge: "Jobs",
      title: "Personalized job recs",
      description:
        "Get AI-powered suggestions for jobs and opportunities based on your profile, interests, skills, and where you are in your career journey.",
      bgColor: "bg-gradient-to-br from-orange-400 to-orange-500",
      badgeBg: "bg-white/20",
      badgeText: "text-white",
      clr: "white",
      clrdesc: "white/95",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z" />
        </svg>
      ),
      badge: "Advice",
      title: "Real career advice",
      description:
        "Grow your career with posts, videos, and articles from people who've done it before. Learn from expert-led clubs and industry professionals.",
      bgColor: "bg-gradient-to-br from-purple-300 to-purple-400",
      badgeBg: "bg-white/20",
      badgeText: "text-purple-900",
      clr: "black",
      clrdesc: "black/95",
    },
  ];

  return (
    <section className="w-full bg-[#4a8a82] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} rounded-3xl p-8 py-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
            >
              {/* Badge and Icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`${card.badgeBg} p-3 rounded-xl text-white`}>
                  {card.icon}
                </div>
                <span
                  className={`${card.badgeBg} ${card.badgeText} px-4 py-1.5 rounded-full text-sm font-semibold`}
                >
                  {card.badge}
                </span>
              </div>

              {/* Title */}
              <h3
                className={`text-3xl sm:text-4xl font-bold text-${card.clr} mb-4`}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p
                className={`text-base sm:text-xl text-${card.clrdesc} leading-relaxed`}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
