"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {
  title?: string;
  theme?: "white" | "black" | "home";
  user?: User | null;
};

type User = {
  name: string;
  abbreviation: string;
  userType: "student" | "college" | "employer";
  loggedIn: boolean;
};

const DASHBOARD_ROUTES: Record<User["userType"], string> = {
  student: "/students",
  college: "/colleges/dashboard",
  employer: "/employees",
};

export default function TopBar({
  title = "Fomo",
  theme = "white",
  user = null,
}: Props) {
  const [open, setOpen] = useState(false);

  // TODO: replace with real auth context/state
  const mockUser = user;
  const isAuthenticated = Boolean(mockUser?.loggedIn);
  const authenticatedUser: User | null =
    isAuthenticated && mockUser ? mockUser : null;

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

  const navLinkBase = "font-semibold transition-all duration-200";
  const navLinkColor =
    theme === "black"
      ? "text-black hover:text-[#0f4f4a] hover:-translate-y-0.5"
      : "text-white/95 hover:text-[#d6ff3a] hover:-translate-y-0.5";
  const greetingColor = theme === "black" ? "text-gray-900" : "text-white";

  return (
    <div
      role="banner"
      className={`fixed inset-x-0 top-0 z-50 ${navbarClasses}`}
      style={backgroundStyle}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-13 w-13 items-center justify-center rounded-lg bg-[#d6ff3a] text-xl font-extrabold text-[#082926] shadow-[0_3px_0_rgba(0,0,0,0.12)]">
            F
          </div>
          <Link href="/">
            <span
              className={`${
                theme === "black" ? "text-black" : "text-white"
              } text-3xl font-semibold`}
            >
              {title}
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-4" aria-label="Primary">
          {!authenticatedUser ? (
            <>
              <div className="hidden items-center gap-7 sm:flex">
                <a
                  className={`${navLinkBase} ${navLinkColor}`}
                  href="/students"
                >
                  For Students
                </a>
                <a
                  className={`hidden md:inline-block ${navLinkBase} ${navLinkColor}`}
                  href="#"
                >
                  For Employers
                </a>
                <a
                  className={`hidden lg:inline-block ${navLinkBase} ${navLinkColor}`}
                  href="/colleges/dashboard"
                >
                  For Colleges
                </a>
              </div>

              <a
                className="transform rounded-2xl bg-[#d6ff3a] px-4 py-2 font-extrabold text-[#082926] shadow-[0_6px_0_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_0_rgba(0,0,0,0.12)]"
                href="/auth/login"
              >
                Login
              </a>

              <button
                className={`ml-2 inline-flex items-center justify-center rounded-md p-2 transition-colors duration-200 sm:hidden ${
                  theme === "black"
                    ? "text-black hover:bg-black/5"
                    : "text-white/90 hover:bg-white/10"
                }`}
                aria-label="Toggle menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? (
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
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-sm font-semibold text-white">
                {authenticatedUser.abbreviation}
              </span> */}
              <span
                className={`rounded-2xl px-4 py-2 text-sm font-medium ${greetingColor}`}
              >
                Hi {authenticatedUser.name}!
              </span>
              <a
                className="transform rounded-2xl bg-[#d6ff3a] px-4 py-2 font-extrabold text-[#082926] shadow-[0_6px_0_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_0_rgba(0,0,0,0.12)]"
                href={DASHBOARD_ROUTES[authenticatedUser.userType]}
              >
                Dashboard
              </a>
            </div>
          )}
        </nav>
      </div>

      {!isAuthenticated && (
        <div
          id="mobile-menu"
          className={`sm:hidden overflow-hidden transition-max-h duration-300 ease-in-out ${
            open ? "max-h-60" : "max-h-0"
          }`}
        >
          <div className="border-t border-white/5 bg-[#0f4f4a]/95 px-6 py-4 backdrop-blur-md">
            <div className="flex flex-col gap-3">
              <a
                className={`py-2 font-semibold transition-all duration-200 ${
                  theme === "black"
                    ? "text-black hover:text-[#0f4f4a] hover:translate-x-1"
                    : "text-white/95 hover:text-[#d6ff3a] hover:translate-x-1"
                }`}
                href="#"
              >
                For Students
              </a>
              <a
                className={`py-2 font-semibold transition-all duration-200 ${
                  theme === "black"
                    ? "text-black hover:text-[#0f4f4a] hover:translate-x-1"
                    : "text-white/95 hover:text-[#d6ff3a] hover:translate-x-1"
                }`}
                href="#"
              >
                For Employers
              </a>
              <a
                className={`py-2 font-semibold transition-all duration-200 ${
                  theme === "black"
                    ? "text-black hover:text-[#0f4f4a] hover:translate-x-1"
                    : "text-white/95 hover:text-[#d6ff3a] hover:translate-x-1"
                }`}
                href="#"
              >
                For Colleges
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
