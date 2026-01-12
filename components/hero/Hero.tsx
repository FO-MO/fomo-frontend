export const dynamic = 'force-dynamic'

import React from 'react'
import Link from 'next/link'

// CHANGE THIS VARIABLE TO UPDATE THE ENTIRE FILE
const THEME_COLOR = '#1ABC9C'

export default function NewHero() {
  return (
    <div style={{ '--primary': THEME_COLOR }}>
      {/* Hero Section */}
      <section className='pt-32 pb-20 px-6 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none'></div>
        <div className='absolute top-40 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none'></div>
        <div className='absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none'></div>

        <div className='max-w-7xl mx-auto'>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            <div style={{ opacity: 1, transform: 'none' }}>
              <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6'>
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
                  className='lucide lucide-sparkles h-4 w-4'
                  aria-hidden='true'
                >
                  <path d='M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z'></path>
                  <path d='M20 2v4'></path>
                  <path d='M22 4h-4'></path>
                  <circle cx='4' cy='20' r='2'></circle>
                </svg>
                <span>Empowering the next generation</span>
              </div>

              <h1
                className='text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6'
                data-testid='text-hero-title'
              >
                Share, Connect,
                <span className='text-primary block'>Grow Together</span>
              </h1>

              <p
                className='text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed'
                data-testid='text-hero-description'
              >
                Join thousands of students and professionals sharing
                achievements, building projects, and connecting with
                opportunities that matter.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 mb-8'>
                <input
                  className='flex w-full rounded-md border py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-12 px-5 bg-card border-border/50'
                  placeholder='Enter your email'
                  data-testid='input-email'
                  type='email'
                  defaultValue=''
                />
                <Link
                  href='/auth/signup'
                  className='inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 text-white border border-primary min-h-10 rounded-md h-12 px-8 bg-primary hover:opacity-90 glow'
                  data-testid='button-join-waitlist'
                >
                  Join Waitlist
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
                    className='lucide lucide-chevron-right ml-2 h-5 w-5'
                    aria-hidden='true'
                  >
                    <path d='m9 18 6-6-6-6'></path>
                  </svg>
                </Link>
              </div>

              <div className='flex items-center gap-4'>
                <div className='flex -space-x-3'>
                  <span className='relative flex shrink-0 overflow-hidden rounded-full h-10 w-10 border-2 border-background'>
                    <span className='flex h-full w-full items-center justify-center rounded-full bg-primary text-white text-sm font-medium'>
                      A
                    </span>
                  </span>
                  <span className='relative flex shrink-0 overflow-hidden rounded-full h-10 w-10 border-2 border-background'>
                    <span className='flex h-full w-full items-center justify-center rounded-full bg-primary text-white text-sm font-medium'>
                      B
                    </span>
                  </span>
                  <span className='relative flex shrink-0 overflow-hidden rounded-full h-10 w-10 border-2 border-background'>
                    <span className='flex h-full w-full items-center justify-center rounded-full bg-primary text-white text-sm font-medium'>
                      C
                    </span>
                  </span>
                  <span className='relative flex shrink-0 overflow-hidden rounded-full h-10 w-10 border-2 border-background'>
                    <span className='flex h-full w-full items-center justify-center rounded-full bg-primary text-white text-sm font-medium'>
                      D
                    </span>
                  </span>
                </div>
                <div className='text-sm'>
                  <span className='font-semibold text-foreground'>2,500+</span>
                  <span className='text-muted-foreground'>
                    {' '}
                    students joined this week
                  </span>
                </div>
              </div>
            </div>

            <div className='relative' style={{ opacity: 1, transform: 'none' }}>
              <div className='bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden'>
                <div className='flex'>
                  <div className='w-56 bg-sidebar p-4 hidden sm:block'>
                    <div className='flex items-center gap-2 mb-8'>
                      <div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center'>
                        <span className='text-white font-bold text-sm'>F</span>
                      </div>
                      <span className='font-bold text-sidebar-foreground'>
                        FOOMO
                      </span>
                    </div>

                    <nav className='space-y-1'>
                      <div className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors bg-primary text-white'>
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
                          className='lucide lucide-house h-5 w-5'
                          aria-hidden='true'
                        >
                          <path d='M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8'></path>
                          <path d='M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'></path>
                        </svg>
                        <span>Home</span>
                      </div>

                      <div className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent/10'>
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
                          className='lucide lucide-folder-kanban h-5 w-5'
                          aria-hidden='true'
                        >
                          <path d='M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z'></path>
                          <path d='M8 10v4'></path>
                          <path d='M12 10v2'></path>
                          <path d='M16 10v6'></path>
                        </svg>
                        <span>Projects</span>
                      </div>

                      <div className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent/10'>
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
                          className='lucide lucide-users h-5 w-5'
                          aria-hidden='true'
                        >
                          <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
                          <path d='M16 3.128a4 4 0 0 1 0 7.744'></path>
                          <path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
                          <circle cx='9' cy='7' r='4'></circle>
                        </svg>
                        <span>Clubs</span>
                      </div>

                      <div className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent/10'>
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
                          className='lucide lucide-briefcase h-5 w-5'
                          aria-hidden='true'
                        >
                          <path d='M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'></path>
                          <rect
                            width='20'
                            height='14'
                            x='2'
                            y='6'
                            rx='2'
                          ></rect>
                        </svg>
                        <span>Jobs</span>
                      </div>

                      <div className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent/10'>
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
                          className='lucide lucide-user h-5 w-5'
                          aria-hidden='true'
                        >
                          <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'></path>
                          <circle cx='12' cy='7' r='4'></circle>
                        </svg>
                        <span>Profile</span>
                      </div>

                      <div className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent/10'>
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
                          className='lucide lucide-search h-5 w-5'
                          aria-hidden='true'
                        >
                          <path d='m21 21-4.34-4.34'></path>
                          <circle cx='11' cy='11' r='8'></circle>
                        </svg>
                        <span>Search</span>
                      </div>
                    </nav>

                    <div className='mt-8 pt-4 border-t border-sidebar-border'>
                      <div className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/10 cursor-pointer'>
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
                          className='lucide lucide-sparkles h-5 w-5'
                          aria-hidden='true'
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

                  <div className='flex-1 p-6 min-h-[400px]'>
                    <div className='mb-6'>
                      <h2 className='text-2xl font-bold mb-1'>
                        Welcome back, thomas! 👋
                      </h2>
                      <p className='text-muted-foreground text-sm'>
                        Share your achievements and connect with your network
                      </p>
                    </div>

                    <div className='bg-muted/30 rounded-xl p-4 mb-6 flex items-center gap-4'>
                      <span className='relative flex shrink-0 overflow-hidden rounded-full h-10 w-10'>
                        <span className='flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary font-medium'>
                          T
                        </span>
                      </span>
                      <div className='flex-1 text-muted-foreground text-sm'>
                        Post what&apos;s on your mind, thomas?
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <h3 className='font-semibold text-sm'>
                        Feed - Posts & Opportunities
                      </h3>
                      <div className='bg-card border border-border/50 rounded-xl p-4'>
                        <div className='flex items-start gap-3'>
                          <span className='relative flex shrink-0 overflow-hidden rounded-full h-10 w-10'>
                            <span className='flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary font-medium'>
                              T
                            </span>
                          </span>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-1'>
                              <span className='font-semibold text-sm'>
                                thomas
                              </span>
                              <span className='text-xs text-muted-foreground'>
                                Software Engineering
                              </span>
                            </div>
                            <p className='text-xs text-muted-foreground mb-2'>
                              37 days ago
                            </p>
                            <p className='text-sm'>test 2</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 px-6 border-y border-border/50 bg-muted/30'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div
              className='text-center'
              style={{ opacity: 1, transform: 'none' }}
            >
              <p
                className='text-4xl md:text-5xl font-bold text-primary mb-2'
                data-testid='text-stat-value-0'
              >
                50K+
              </p>
              <p
                className='text-sm text-muted-foreground'
                data-testid='text-stat-label-0'
              >
                Active Students
              </p>
            </div>
            <div
              className='text-center'
              style={{ opacity: 1, transform: 'none' }}
            >
              <p
                className='text-4xl md:text-5xl font-bold text-primary mb-2'
                data-testid='text-stat-value-1'
              >
                2,500+
              </p>
              <p
                className='text-sm text-muted-foreground'
                data-testid='text-stat-label-1'
              >
                Companies Hiring
              </p>
            </div>
            <div
              className='text-center'
              style={{ opacity: 1, transform: 'none' }}
            >
              <p
                className='text-4xl md:text-5xl font-bold text-primary mb-2'
                data-testid='text-stat-value-2'
              >
                10K+
              </p>
              <p
                className='text-sm text-muted-foreground'
                data-testid='text-stat-label-2'
              >
                Projects Shared
              </p>
            </div>
            <div
              className='text-center'
              style={{ opacity: 1, transform: 'none' }}
            >
              <p
                className='text-4xl md:text-5xl font-bold text-primary mb-2'
                data-testid='text-stat-value-3'
              >
                95%
              </p>
              <p
                className='text-sm text-muted-foreground'
                data-testid='text-stat-label-3'
              >
                Placement Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-24 px-6'>
        <div className='max-w-7xl mx-auto'>
          <div
            className='text-center max-w-2xl mx-auto mb-16'
            style={{ opacity: 1, transform: 'none' }}
          >
            <h2
              className='text-4xl md:text-5xl font-bold mb-4'
              data-testid='text-features-title'
            >
              Everything you need to{' '}
              <span className='text-primary'>succeed</span>
            </h2>
            <p className='text-lg text-muted-foreground'>
              Built for students and professionals who want to stand out,
              connect, and grow their careers.
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div
              className='group bg-card rounded-2xl border border-border/50 p-6 hover-lift cursor-pointer'
              data-testid='card-feature-0'
              style={{ opacity: 1, transform: 'none' }}
            >
              <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors'>
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
                  className='lucide lucide-book-open h-6 w-6 text-primary'
                  aria-hidden='true'
                >
                  <path d='M12 7v14'></path>
                  <path d='M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'></path>
                </svg>
              </div>
              <h3 className='text-lg font-semibold mb-2'>Project Showcase</h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Display your best work and get discovered by recruiters and
                peers alike.
              </p>
            </div>

            <div
              className='group bg-card rounded-2xl border border-border/50 p-6 hover-lift cursor-pointer'
              data-testid='card-feature-1'
              style={{ opacity: 1, transform: 'none' }}
            >
              <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors'>
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
                  className='lucide lucide-users h-6 w-6 text-primary'
                  aria-hidden='true'
                >
                  <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
                  <path d='M16 3.128a4 4 0 0 1 0 7.744'></path>
                  <path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
                  <circle cx='9' cy='7' r='4'></circle>
                </svg>
              </div>
              <h3 className='text-lg font-semibold mb-2'>Club Communities</h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Join clubs based on your interests. Collaborate, learn, and grow
                together.
              </p>
            </div>

            <div
              className='group bg-card rounded-2xl border border-border/50 p-6 hover-lift cursor-pointer'
              data-testid='card-feature-2'
              style={{ opacity: 1, transform: 'none' }}
            >
              <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors'>
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
                  className='lucide lucide-briefcase h-6 w-6 text-primary'
                  aria-hidden='true'
                >
                  <path d='M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'></path>
                  <rect width='20' height='14' x='2' y='6' rx='2'></rect>
                </svg>
              </div>
              <h3 className='text-lg font-semibold mb-2'>Job Opportunities</h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Access exclusive job listings from top companies looking for
                fresh talent.
              </p>
            </div>

            <div
              className='group bg-card rounded-2xl border border-border/50 p-6 hover-lift cursor-pointer'
              data-testid='card-feature-3'
              style={{ opacity: 1, transform: 'none' }}
            >
              <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors'>
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
                  className='lucide lucide-trophy h-6 w-6 text-primary'
                  aria-hidden='true'
                >
                  <path d='M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978'></path>
                  <path d='M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978'></path>
                  <path d='M18 9h1.5a1 1 0 0 0 0-5H18'></path>
                  <path d='M4 22h16'></path>
                  <path d='M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z'></path>
                  <path d='M6 9H4.5a1 1 0 0 1 0-5H6'></path>
                </svg>
              </div>
              <h3 className='text-lg font-semibold mb-2'>Achievements</h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Earn badges and recognition for your contributions and
                milestones.
              </p>
            </div>

            <div
              className='group bg-card rounded-2xl border border-border/50 p-6 hover-lift cursor-pointer'
              data-testid='card-feature-4'
              style={{ opacity: 1, transform: 'none' }}
            >
              <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors'>
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
                  className='lucide lucide-message-circle h-6 w-6 text-primary'
                  aria-hidden='true'
                >
                  <path d='M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719'></path>
                </svg>
              </div>
              <h3 className='text-lg font-semibold mb-2'>Ask FOOMO</h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                AI-powered assistance to help you navigate your career journey.
              </p>
            </div>

            <div
              className='group bg-card rounded-2xl border border-border/50 p-6 hover-lift cursor-pointer'
              data-testid='card-feature-5'
              style={{ opacity: 1, transform: 'none' }}
            >
              <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors'>
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
                  className='lucide lucide-zap h-6 w-6 text-primary'
                  aria-hidden='true'
                >
                  <path d='M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'></path>
                </svg>
              </div>
              <h3 className='text-lg font-semibold mb-2'>Real-time Feed</h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Stay updated with posts, opportunities, and achievements from
                your network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id='testimonials' className='py-24 px-6 bg-muted/30'>
        <div className='max-w-7xl mx-auto'>
          <div
            className='text-center max-w-2xl mx-auto mb-16'
            style={{ opacity: 1, transform: 'none' }}
          >
            <h2
              className='text-4xl md:text-5xl font-bold mb-4'
              data-testid='text-testimonials-title'
            >
              Loved by <span className='text-primary'>thousands</span>
            </h2>
            <p className='text-lg text-muted-foreground'>
              See what our community members are saying about their FOOMO
              experience.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-6'>
            <div
              className='bg-card rounded-2xl border border-border/50 p-6'
              data-testid='card-testimonial-0'
              style={{ opacity: 1, transform: 'none' }}
            >
              <div className='flex items-center gap-1 mb-4'>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-star h-4 w-4 fill-yellow-400 text-yellow-400'
                    aria-hidden='true'
                  >
                    <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                  </svg>
                ))}
              </div>
              <p className='text-foreground mb-6 leading-relaxed'>
                &quot;FOOMO helped me showcase my projects and connect with
                amazing mentors. Landed my dream job within 3 months!&quot;
              </p>
              <div className='flex items-center gap-3'>
                <span className='relative flex shrink-0 overflow-hidden rounded-full h-10 w-10'>
                  <span className='flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary font-medium'>
                    SC
                  </span>
                </span>
                <div>
                  <p className='font-semibold text-sm'>Sarah Chen</p>
                  <p className='text-xs text-muted-foreground'>
                    Software Engineer @ Google
                  </p>
                </div>
              </div>
            </div>

            <div
              className='bg-card rounded-2xl border border-border/50 p-6'
              data-testid='card-testimonial-1'
              style={{ opacity: 1, transform: 'none' }}
            >
              <div className='flex items-center gap-1 mb-4'>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-star h-4 w-4 fill-yellow-400 text-yellow-400'
                    aria-hidden='true'
                  >
                    <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                  </svg>
                ))}
              </div>
              <p className='text-foreground mb-6 leading-relaxed'>
                &quot;The community here is incredible. I&apos;ve learned more
                from peer feedback than any course I&apos;ve taken.&quot;
              </p>
              <div className='flex items-center gap-3'>
                <span className='relative flex shrink-0 overflow-hidden rounded-full h-10 w-10'>
                  <span className='flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary font-medium'>
                    MJ
                  </span>
                </span>
                <div>
                  <p className='font-semibold text-sm'>Marcus Johnson</p>
                  <p className='text-xs text-muted-foreground'>
                    Product Designer @ Figma
                  </p>
                </div>
              </div>
            </div>

            <div
              className='bg-card rounded-2xl border border-border/50 p-6'
              data-testid='card-testimonial-2'
              style={{ opacity: 1, transform: 'none' }}
            >
              <div className='flex items-center gap-1 mb-4'>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-star h-4 w-4 fill-yellow-400 text-yellow-400'
                    aria-hidden='true'
                  >
                    <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                  </svg>
                ))}
              </div>
              <p className='text-foreground mb-6 leading-relaxed'>
                &quot;From sharing my first ML project to getting recruited -
                FOOMO made the entire journey seamless.&quot;
              </p>
              <div className='flex items-center gap-3'>
                <span className='relative flex shrink-0 overflow-hidden rounded-full h-10 w-10'>
                  <span className='flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary font-medium'>
                    PP
                  </span>
                </span>
                <div>
                  <p className='font-semibold text-sm'>Priya Patel</p>
                  <p className='text-xs text-muted-foreground'>
                    Data Scientist @ Netflix
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-24 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div
            className='relative bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 rounded-3xl p-12 text-center overflow-hidden'
            style={{ opacity: 1, transform: 'none' }}
          >
            <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent'></div>
            <div className='absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl'></div>
            <div className='absolute -bottom-24 -left-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl'></div>

            <div className='relative z-10'>
              <h2
                className='text-4xl md:text-5xl font-bold mb-4'
                data-testid='text-cta-title'
              >
                Ready to start your journey?
              </h2>
              <p className='text-lg text-muted-foreground mb-8 max-w-xl mx-auto'>
                Join thousands of students already building their future on
                FOOMO. It&apos;s free to get started.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link
                  href='/auth/signup'
                  className='inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 text-white border border-primary min-h-10 rounded-md h-14 px-10 text-base bg-primary hover:opacity-90 glow'
                  data-testid='button-get-started-free'
                >
                  Get Started Free
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
                    className='lucide lucide-arrow-right ml-2 h-5 w-5'
                    aria-hidden='true'
                  >
                    <path d='M5 12h14'></path>
                    <path d='m12 5 7 7-7 7'></path>
                  </svg>
                </Link>
                <button
                  className='inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border [border-color:var(--button-outline)] shadow-xs active:shadow-none min-h-10 rounded-md h-14 px-10 text-base'
                  data-testid='button-watch-demo'
                >
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
                    className='lucide lucide-play mr-2 h-5 w-5'
                    aria-hidden='true'
                  >
                    <path d='M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z'></path>
                  </svg>
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
