'use client'
export const dynamic = 'force-dynamic'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Link from 'next/link'

function Writer() {
  return (
    <h1 className='mt-12 text-center text-[oklch(43.7%_0.078_188.216)] font-extrabold leading-none tracking-tight text-7xl sm:text-8xl md:text-9xl'>
      NEVER FEAR
      <br />
      MISSING OUT
    </h1>
  )
}

export default function Hero1() {
  //ANIMATIONS
  const entrydiv = useRef(null)
  const textdiv = useRef(null)
  const availableTextRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()
    tl.to(
      entrydiv.current,
      {
        y: 100,
        opacity: 0,
        scale: 0.8,
      },
      '+=0.5'
    ).to(entrydiv.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.3,
    })
  }, [])

  useEffect(() => {
    const tl = gsap.timeline()
    tl.to(
      textdiv.current,
      {
        y: 0,
        opacity: 0,
        scale: 0.8,
      },
      '+=0.3'
    ).to(textdiv.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.2,
    })
  }, [])

  useEffect(() => {
    const tl = gsap.timeline()
    tl.to(
      availableTextRef.current,
      {
        y: 0,
        opacity: 0,
        scale: 0.8,
      },
      '+=0.3'
    ).to(availableTextRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.2,
    })
  }, [])
  //

  return (
    <section className='w-full min-h-[100vh] relative text-black overflow-hidden bg-white'>
      {/* Content Overlay */}
      <div className='relative z-10 max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28'>
        <div className='flex justify-center'>
          <div
            className='inline-flex opacity-0 items-center gap-3 bg-black/6 border border-black/10 rounded-full px-4 py-2 text-sm'
            ref={availableTextRef}
          >
            <span className='w-2 h-2 rounded-full bg-[oklch(43.7%_0.078_188.216)] block' />
            <span className='font-semibold text-black'>
              FOOMO is now available for all students
            </span>
          </div>
        </div>

        <Writer />

        <p
          className='mt-8 opacity-0 text-center text-black/90 text-lg max-w-2xl mx-auto'
          ref={textdiv}
        >
          Join the network built for automating your upskilling and networking
          with AI
        </p>

        <div className='mt-10 max-w-3xl mx-auto px-4'>
          <div
            className='flex justify-center'
            ref={entrydiv}
            style={{ opacity: 0 }}
          >
            <Link href='/auth/signup' className='w-full sm:w-auto max-w-xs'>
              <button className='w-full sm:w-auto bg-[oklch(43.7%_0.078_188.216)] cursor-pointer text-white font-extrabold px-8 py-4 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.3)] transform transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(0,0,0,0.3)] whitespace-nowrap text-lg'>
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
