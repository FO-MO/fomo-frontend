"use client";

import Link from "next/link";

interface Hero5Props {
  onSignupClick?: () => void;
}

export default function Hero5({ onSignupClick }: Hero5Props) {
  return (
    <section className="w-full bg-[#0f4f4a] text-white border-b-1 border-gray-400/35  py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Ready to Get Hired?
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Join thousands of students already using AI to land their dream jobs
          through automated upskilling and networking.
        </p>
        <Link href="/auth/signup">
          <button
            onClick={(e) => {
              if (onSignupClick) {
                e.preventDefault();
                onSignupClick();
              }
            }}
            className="group relative cursor-pointer bg-[#d6ff3a] text-[#082926] font-bold px-8 py-4 rounded-lg text-base sm:text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(214,255,58,0.3)] hover:-translate-y-1"
          >
            <span className="flex items-center gap-2">
              Get Started Now
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>
        </Link>
      </div>
    </section>
  );
}
