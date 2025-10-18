import React from "react";

export default function LandingSection() {
  return (
    <section
      className="w-full bg-[#0f4f4a] text-white"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 10px, transparent 10px, transparent 20px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 bg-white/6 border border-white/10 rounded-full px-4 py-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#d6ff3a] block" />
            <span className="font-semibold">
              Fomo is now available for all students
            </span>
          </div>
        </div>

        <h1 className="mt-12 text-center text-[#d6ff3a] font-extrabold leading-none tracking-tight text-7xl sm:text-8xl md:text-9xl">
          NEVER FEAR
          <br />
          MISSING OUT
        </h1>

        <p className="mt-8 text-center text-white/90 text-lg max-w-2xl mx-auto">
          Join the network built for automating your upskilling and networking
          with AI
        </p>

        <div className="mt-10 max-w-3xl mx-auto">
          <div className="flex gap-4 items-center bg-white rounded-xl p-2 shadow-md">
            <input
              aria-label="Email"
              className="flex-1 bg-white rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 outline-none"
              placeholder="Type school or personal email here"
            />
            <button className="bg-[#d6ff3a] text-[#082926] font-extrabold px-6 py-3 rounded-lg shadow-[0_6px_0_rgba(0,0,0,0.12)]">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
