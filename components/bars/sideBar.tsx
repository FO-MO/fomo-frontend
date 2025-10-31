"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type Item = {
  key: string;
  label: string;
  href?: string;
};

type Props = {
  active?: string;
  className?: string;
};

const items: Item[] = [
  { key: "home", label: "Home", href: "/students" },
  { key: "projects", label: "Projects", href: "/students/projects" },
  { key: "clubs", label: "Clubs", href: "/students/clubs" },
  { key: "startups", label: "Startups", href: "/students/startups" },
  { key: "profile", label: "Profile", href: "/students/profile" },
  { key: "messages", label: "Messages", href: "/students/messages" },
  { key: "search", label: "Search", href: "/students/search" },
  { key: "copilot", label: "FOMO AI Copilot", href: "/students/ai" },
];

function Icon({ name }: { name: string }) {
  // simple inline icons for the set used in the sidebar
  switch (name) {
    case "home":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l9-9 9 9v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8z"
          />
        </svg>
      );
    case "projects":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7v10a2 2 0 0 0 2 2h4V5H5a2 2 0 0 0-2 2zM21 7v10a2 2 0 0 1-2 2h-4V5h4a2 2 0 0 1 2 2z"
          />
        </svg>
      );
    case "clubs":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 14l6.16-3.422A12.083 12.083 0 0119 8.5"
          />
        </svg>
      );
    case "startups":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8z"
          />
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21H5"
          />
        </svg>
      );
    case "profile":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.121 17.804A9 9 0 1118.88 6.196 9 9 0 015.12 17.804z"
          />
        </svg>
      );
    case "messages":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 8h10M7 12h8m-8 4h6"
          />
        </svg>
      );
    case "search":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      );
    case "copilot":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function SideBar({ active = "home", className = "" }: Props) {
  const pathname = usePathname();

  const getKeyFromPath = (p: string) => {
    if (!p) return "home";

    // Handle root path
    if (p === "/" || p === "") return "home";

    // Sort items by href length (descending) to match more specific routes first
    const sortedItems = [...items].sort((a, b) => {
      const lenA = a.href && a.href !== "#" ? a.href.length : 0;
      const lenB = b.href && b.href !== "#" ? b.href.length : 0;
      return lenB - lenA;
    });

    // Try to match routes - check if path starts with or matches the href
    const match = sortedItems.find((it) => {
      if (!it.href || it.href === "#") return false;
      // Exact match
      if (p === it.href) return true;
      // Path starts with the href (for nested routes)
      if (p.startsWith(it.href + "/")) return true;
      return false;
    });

    if (match) return match.key;
    return "home";
  };

  const [current, setCurrent] = useState<string>(() =>
    getKeyFromPath(pathname)
  );

  // Update the active item when the pathname changes
  useEffect(() => {
    const newKey = getKeyFromPath(pathname);
    setCurrent(newKey);
  }, [pathname]);

  return (
    <aside
      className={`hidden md:block fixed left-0 z-9 w-56 h-[calc(100vh-5rem)] ${className}`}
      aria-label="Sidebar"
    >
      <div className="h-full bg-[#192534] text-white min-h-screen p-6">
        <div className="flex flex-col gap-3 mt-20">
          {items.map((it) => {
            const isActive = it.key === current;
            const isClickable = it.href && it.href !== "#";

            const content = (
              <>
                <span className={`p-1 ${isActive ? "bg-transparent" : ""}`}>
                  <Icon name={it.key} />
                </span>
                <span className="font-medium">{it.label}</span>
              </>
            );

            const className = `flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-150 ${
              isActive
                ? "bg-gradient-to-r from-[#0f4f4a] to-[#0a6a60] text-white shadow-lg"
                : "text-white/90 hover:bg-white/3"
            }`;

            if (isClickable) {
              return (
                <Link key={it.key} href={it.href!} className={className}>
                  {content}
                </Link>
              );
            }

            return (
              <button key={it.key} className={className} disabled>
                {content}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
