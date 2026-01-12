'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import React from 'react'

type Props = {
  title?: string
  theme?: 'white' | 'black' | 'home'
  user?: User | null
}

type User = {
  username: string
  abbreviation: string
  userType: 'student' | 'college' | 'employer'
  loggedIn: boolean
}

const DASHBOARD_ROUTES: Record<User['userType'], string> = {
  student: '/students',
  college: '/colleges/dashboard',
  employer: '/employers/overview',
}

export default function TopBar({
  title = 'FOOMO',
  theme = 'white',
  user = null,
}: Props) {
  // TODO: replace with real auth context/state
  const mockUser = user
  const isAuthenticated = Boolean(mockUser?.loggedIn)
  const authenticatedUser: User | null =
    isAuthenticated && mockUser ? mockUser : null

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-gray-100 border-b border-border/50'>
      <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center'>
            <span className='text-primary-foreground font-bold text-sm'>F</span>
          </div>
          <Link href='/'>
            <span
              className='font-bold text-xl tracking-tight'
              data-testid='text-logo'
            >
              FOOMO
            </span>
          </Link>
        </div>

        <nav className='hidden md:flex items-center gap-8'>
          <a
            href='#features'
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
            data-testid='link-features'
          >
            Features
          </a>
          <a
            href='#testimonials'
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
            data-testid='link-testimonials'
          >
            Testimonials
          </a>
          <a
            href='#pricing'
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
            data-testid='link-pricing'
          >
            Pricing
          </a>
        </nav>

        <div className='flex items-center gap-3'>
          {!authenticatedUser ? (
            <>
              <Link
                href='/auth/login'
                className='items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-transparent min-h-9 px-4 py-2 hidden sm:flex'
                data-testid='button-login'
              >
                Log in
              </Link>
              <Link
                href='/auth/signup'
                className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 text-primary-foreground border border-primary-border min-h-9 px-4 py-2 bg-primary hover:bg-primary/90'
                data-testid='button-signup'
              >
                Get Started
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
                  className='lucide lucide-arrow-right ml-2 h-4 w-4'
                  aria-hidden='true'
                >
                  <path d='M5 12h14'></path>
                  <path d='m12 5 7 7-7 7'></path>
                </svg>
              </Link>
            </>
          ) : (
            <div className='flex items-center gap-2 sm:gap-4'>
              {/* User Greeting - Hidden on very small screens, visible on larger */}
              <span className='hidden sm:block rounded-lg sm:rounded-2xl px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-foreground'>
                Hi {authenticatedUser.username}!
              </span>

              {/* User Avatar - Visible on small screens instead of greeting */}
              <span className='flex sm:hidden h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold'>
                {authenticatedUser.abbreviation}
              </span>

              <Link
                href={DASHBOARD_ROUTES[authenticatedUser.userType]}
                className='transform rounded-lg sm:rounded-2xl bg-primary px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base font-bold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md'
              >
                Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
