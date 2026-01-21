'use client'
export const dynamic = 'force-dynamic'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Link from 'next/link'

export default function Hero1() {
  const [email, setEmail] = useState('')
  const heroRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(
      heroRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.3,
      },
    )

    tl.fromTo(
      cardRef.current,
      {
        opacity: 0,
        x: 50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.2,
      },
      '-=0.6',
    )
  }, [])

  return (
    <section className='pt-32 pb-24 px-6 min-h-screen bg-background'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          {/* Left side - Hero content */}
          <div ref={heroRef} style={{ opacity: 0 }}>
            <p className='text-primary font-medium mb-4'>
              For students & professionals
            </p>
            <h1 className='text-4xl md:text-5xl font-bold leading-tight mb-6'>
              Share achievements,
              <br />
              <span className='text-primary'>grow together</span>
            </h1>
            <p className='text-muted-foreground text-lg mb-8 max-w-md'>
              Connect with peers, showcase projects, and discover opportunities
              that matter.
            </p>

            <div className='flex gap-3 mb-6'>
              <input
                className='flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-11 max-w-xs'
                placeholder='Enter your email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Link href='/auth/signup'>
                <button className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground border border-primary h-11 px-4 py-2 transform hover:-translate-y-0.5'>
                  Join Free
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='ml-2 h-4 w-4'
                  >
                    <path d='M5 12h14'></path>
                    <path d='m12 5 7 7-7 7'></path>
                  </svg>
                </button>
              </Link>
            </div>

            <p className='text-sm text-muted-foreground'>
              <span className='font-medium text-foreground'>2,500+</span> joined
              this week
            </p>
          </div>

          {/* Right side - Demo interface */}
          <div ref={cardRef} style={{ opacity: 0 }}>
            <div className='bg-card rounded-xl border shadow-lg overflow-hidden'>
              <div className='flex'>
                {/* Sidebar */}
                <div className='w-48 bg-sidebar p-4 hidden md:block'>
                  <div className='flex items-center gap-2 mb-6'>
                    <div className='w-7 h-7 rounded-md bg-primary flex items-center justify-center'>
                      <span className='text-primary-foreground font-bold text-xs'>
                        F
                      </span>
                    </div>
                    <span className='font-semibold text-sidebar-foreground text-sm'>
                      FOOMO
                    </span>
                  </div>

                  <nav className='space-y-1'>
                    <div className='flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm bg-primary text-primary-foreground'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4'
                      >
                        <path d='M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8'></path>
                        <path d='M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'></path>
                      </svg>
                      <span>Home</span>
                    </div>

                    <div className='flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4'
                      >
                        <path d='M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z'></path>
                        <path d='M8 10v4'></path>
                        <path d='M12 10v2'></path>
                        <path d='M16 10v6'></path>
                      </svg>
                      <span>Projects</span>
                    </div>

                    <div className='flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4'
                      >
                        <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
                        <path d='M16 3.128a4 4 0 0 1 0 7.744'></path>
                        <path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
                        <circle cx='9' cy='7' r='4'></circle>
                      </svg>
                      <span>Clubs</span>
                    </div>

                    <div className='flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4'
                      >
                        <path d='M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'></path>
                        <rect width='20' height='14' x='2' y='6' rx='2'></rect>
                      </svg>
                      <span>Jobs</span>
                    </div>

                    <div className='flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4'
                      >
                        <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'></path>
                        <circle cx='12' cy='7' r='4'></circle>
                      </svg>
                      <span>Profile</span>
                    </div>

                    <div className='flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4'
                      >
                        <path d='m21 21-4.34-4.34'></path>
                        <circle cx='11' cy='11' r='8'></circle>
                      </svg>
                      <span>Search</span>
                    </div>
                  </nav>

                  <div className='mt-6 pt-4 border-t border-sidebar-border'>
                    <div className='flex items-center gap-2.5 px-3 py-2 text-sm text-sidebar-foreground/60'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4'
                      >
                        <path d='M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z'></path>
                        <path d='M20 2v4'></path>
                        <path d='M22 4h-4'></path>
                        <circle cx='4' cy='20' r='2'></circle>
                      </svg>
                      <span>Ask FOOMO</span>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className='flex-1 p-5 min-h-[320px]'>
                  <div className='mb-5'>
                    <h2 className='text-xl font-semibold mb-1'>
                      Welcome back, thomas! 👋
                    </h2>
                    <p className='text-muted-foreground text-sm'>
                      Share your achievements and connect with your network
                    </p>
                  </div>

                  <div className='bg-muted/50 rounded-lg p-3 mb-5 flex items-center gap-3'>
                    <span className='relative flex shrink-0 overflow-hidden rounded-full h-8 w-8'>
                      <span className='flex h-full w-full items-center justify-center rounded-full bg-primary/15 text-primary text-xs'>
                        T
                      </span>
                    </span>
                    <span className='text-muted-foreground text-sm'>
                      Post what's on your mind, thomas?
                    </span>
                  </div>

                  <p className='font-medium text-sm mb-3'>
                    Feed - Posts & Opportunities
                  </p>

                  <div className='border rounded-lg p-3'>
                    <div className='flex items-start gap-3'>
                      <span className='relative flex shrink-0 overflow-hidden rounded-full h-8 w-8'>
                        <span className='flex h-full w-full items-center justify-center rounded-full bg-primary/15 text-primary text-xs'>
                          T
                        </span>
                      </span>
                      <div>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium text-sm'>thomas</span>
                          <span className='text-xs text-muted-foreground'>
                            Software Engineering
                          </span>
                        </div>
                        <p className='text-xs text-muted-foreground'>
                          37 days ago
                        </p>
                        <p className='text-sm mt-1'>test 2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className='py-16 px-6 border-t mt-16'>
        <div className='max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
          <div>
            <p className='text-3xl font-bold text-primary'>50K+</p>
            <p className='text-sm text-muted-foreground mt-1'>Students</p>
          </div>
          <div>
            <p className='text-3xl font-bold text-primary'>2,500+</p>
            <p className='text-sm text-muted-foreground mt-1'>Companies</p>
          </div>
          <div>
            <p className='text-3xl font-bold text-primary'>10K+</p>
            <p className='text-sm text-muted-foreground mt-1'>Projects</p>
          </div>
          <div>
            <p className='text-3xl font-bold text-primary'>95%</p>
            <p className='text-sm text-muted-foreground mt-1'>Placement</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-6'>
        <div className='max-w-2xl mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-4'>Ready to get started?</h2>
          <p className='text-muted-foreground mb-8'>
            Join thousands of students building their future on FOOMO.
          </p>
          <Link href='/auth/signup'>
            <button className='inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground border border-primary min-h-10 rounded-md px-8 transform hover:-translate-y-0.5'>
              Create Free Account
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='ml-2 h-4 w-4'
              >
                <path d='M5 12h14'></path>
                <path d='m12 5 7 7-7 7'></path>
              </svg>
            </button>
          </Link>
        </div>
      </section>
    </section>
  )
}
