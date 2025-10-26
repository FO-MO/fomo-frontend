"use client";

import { Typewriter } from "react-simple-typewriter";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

function Writer() {
  return (
    <h1 className="mt-12 text-center text-[#d6ff3a] font-extrabold leading-none tracking-tight text-7xl sm:text-8xl md:text-9xl">
      <Typewriter
        words={["NEVER FEAR\nMISSING OUT"]}
        loop={1}
        cursor
        cursorStyle="|"
        typeSpeed={80}
        delaySpeed={1000}
      />
    </h1>
  );
}

export default function LandingSection() {
  //ANIMATE INFO BAR
  const entrydiv = useRef(null);
  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(
      entrydiv.current,
      {
        y: 100,
        opacity: 0,
        scale: 0.8,
      },
      "+=2.0"
    ).to(entrydiv.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
    });
  }, []);
  //

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

        <Writer />

        <p className="mt-8 text-center text-white/90 text-lg max-w-2xl mx-auto">
          Join the network built for automating your upskilling and networking
          with AI
        </p>

        <div className="mt-10 max-w-3xl mx-auto">
          <div
            className="flex gap-4 items-center bg-white rounded-xl p-2 shadow-md"
            ref={entrydiv}
            style={{ opacity: 0 }}
          >
            <input
              aria-label="Email"
              className="flex-1 bg-white rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 outline-none"
              placeholder="Type school or personal email here"
            />
            <Link href="/auth/signup">
              <button className="bg-[#d6ff3a] cursor-pointer text-[#082926] font-extrabold px-6 py-3 hover:-translate-y-1 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_0_rgba(0,0,0,0.3)]">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
