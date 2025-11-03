"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ showProfile = true }: { showProfile?: boolean }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-10 h-20 border-b border-white/40 bg-gradient-to-r from-[#cfd5df]/60 via-white/30 to-white/20 backdrop-blur-xl"
        role="banner"
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-8">
          <Link href="/" className="text-3xl font-semibold text-gray-900">
            FOOMO
          </Link>

          {showProfile && (
              <div className="flex items-center gap-6 text-gray-700">
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    SM
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-base font-semibold text-gray-900">
                          My Account
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href="/students/profile"
                          className="block px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Settings
                        </Link>
                      </div>

                      {/* Log out */}
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            // TODO: Add logout functionality
                            console.log("Log out clicked");
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </header>
      ;
    </>
  );
}
