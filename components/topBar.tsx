"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

type Props = {
  title?: string;
  theme?: "white" | "black" | "home";
};

export default function TopBar({ title = "FOMO", theme = "white" }: Props) {
  const [open, setOpen] = useState(false);

  // prevent background scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Determine styling based on theme
  const isHomeTheme = theme === "home";
  const navbarClasses = isHomeTheme ? "" : "backdrop-blur-md";
  const backgroundStyle = isHomeTheme
    ? {
        backgroundColor: "#0F4F4A",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }
    : {
        background:
          "linear-gradient(rgba(255,255,255,0.50), rgba(255,255,255,0.50))",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      };

  return (
    <div
      role="banner"
      className={`fixed inset-x-0 top-0 z-50 ${navbarClasses}`}
      style={backgroundStyle}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 h-20">
        <div className="flex items-center gap-3">
          <div className="w-13 h-13 rounded-lg bg-[#d6ff3a] text-[#082926] flex items-center justify-center font-extrabold text-xl shadow-[0_3px_0_rgba(0,0,0,0.12)]">
            F
          </div>
          <Link href="/">
            <div
              className={`${
                theme === "black" ? "text-black" : "text-white"
              } font-semibold text-3xl`}
            >
              {title}
            </div>
          </Link>
        </div>
        <nav className="flex items-center gap-4" aria-label="Primary">
          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-7">
            <a
              className={`${
                theme === "black" ? "text-black" : "text-white/95"
              } font-semibold`}
              href="/students"
            >
              For Students
            </a>
            <a
              className={`${
                theme === "black" ? "text-black" : "text-white/95"
              } font-semibold hidden md:inline-block`}
              href="/employees/overview"
            >
              For Employers
            </a>
            <a
              className={`${
                theme === "black" ? "text-black" : "text-white/95"
              } font-semibold hidden lg:inline-block`}
              href="/colleges/dashboard"
            >
              For Colleges
            </a>
          </div>

          {/* Dashboard button with hover animation */}
          <a
            className="bg-[#d6ff3a] text-[#082926] px-4 py-2 rounded-2xl font-extrabold shadow-[0_6px_0_rgba(0,0,0,0.12)] transform transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_0_rgba(0,0,0,0.12)]"
            href="#"
          >
            Dashboard
          </a>

          {/* Mobile hamburger */}
          <button
            className={`sm:hidden ml-2 p-2 rounded-md inline-flex items-center justify-center ${
              theme === "black" ? "text-black" : "text-white/90"
            } hover:bg-white/6`}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              // Close (X) icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`sm:hidden transition-max-h duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="bg-[#0f4f4a]/95 backdrop-blur-md border-t border-white/5 px-6 py-4">
          <div className="flex flex-col gap-3">
            <a
              className={`${
                theme === "black" ? "text-black" : "text-white/95"
              } font-semibold py-2`}
              href="#"
            >
              For Students
            </a>
            <a
              className={`${
                theme === "black" ? "text-black" : "text-white/95"
              } font-semibold py-2`}
              href="#"
            >
              For Employers
            </a>
            <a
              className={`${
                theme === "black" ? "text-black" : "text-white/95"
              } font-semibold py-2`}
              href="#"
            >
              For Colleges
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
