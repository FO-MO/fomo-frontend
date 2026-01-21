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

  const isHomeTheme = theme === 'home'
  const navbarClasses = isHomeTheme
    ? 'bg-background/80 backdrop-blur-md border-b border-border/40'
    : 'backdrop-blur-md'
  const backgroundStyle = isHomeTheme
    ? {}
    : {
        background:
          'linear-gradient(rgba(255,255,255,0.50), rgba(255,255,255,0.50))',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }

  const textColor = isHomeTheme
    ? 'text-foreground'
    : theme === 'black'
      ? 'text-gray-900'
      : 'text-white'
  const logoTextColor = isHomeTheme
    ? 'text-foreground'
    : theme === 'black'
      ? 'text-black'
      : 'text-white'

  return (
    <header
      role='banner'
      className={`fixed top-0 left-0 right-0 z-50 ${navbarClasses}`}
      style={backgroundStyle}
    >
      <div className='max-w-6xl mx-auto px-6 h-16 flex items-center justify-between'>
        {/* Logo and Title */}
        <div className='flex items-center gap-2'>
          <div
            className={`w-8 h-8 rounded-lg ${isHomeTheme ? 'bg-primary' : 'bg-[#d6ff3a]'} flex items-center justify-center`}
          >
            <span
              className={`${isHomeTheme ? 'text-primary-foreground' : 'text-[#082926]'} font-bold text-sm`}
            >
              F
            </span>
          </div>
          <Link href='/'>
            <span className={`font-semibold text-lg ${logoTextColor}`}>
              FOOMO
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className='flex items-center' aria-label='Primary'>
          {!authenticatedUser ? (
            <div className='flex items-center gap-3'>
              <Link href='/auth/login'>
                <button
                  className={`inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ${isHomeTheme ? 'hover:bg-accent hover:text-accent-foreground' : 'transform hover:-translate-y-1'} border border-transparent min-h-8 rounded-md px-3 text-xs ${isHomeTheme ? textColor : 'bg-[#d6ff3a] text-[#082926] shadow-[0_3px_0_rgba(0,0,0,0.12)] hover:shadow-[0_6px_0_rgba(0,0,0,0.12)]'}`}
                >
                  Log in
                </button>
              </Link>
              <Link href='/auth/signup'>
                <button
                  className={`inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ${isHomeTheme ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' : 'transform hover:-translate-y-1 bg-[#d6ff3a] text-[#082926] shadow-[0_3px_0_rgba(0,0,0,0.12)] hover:shadow-[0_6px_0_rgba(0,0,0,0.12)]'} border min-h-8 rounded-md px-3 text-xs`}
                >
                  Get Started
                </button>
              </Link>
            </div>
          ) : (
            <div className='flex items-center gap-2 sm:gap-4'>
              {/* User Greeting - Hidden on very small screens, visible on larger */}
              <span
                className={`hidden sm:block rounded-lg sm:rounded-2xl px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium ${textColor}`}
              >
                Hi {authenticatedUser.username}!
              </span>

              {/* User Avatar - Visible on small screens instead of greeting */}
              <span className='flex sm:hidden h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/10 text-xs font-semibold text-white'>
                {authenticatedUser.abbreviation}
              </span>

              <Link href={DASHBOARD_ROUTES[authenticatedUser.userType]}>
                <button
                  className={`transform rounded-lg sm:rounded-2xl ${isHomeTheme ? 'bg-primary text-primary-foreground' : 'bg-[#d6ff3a] text-[#082926] shadow-[0_3px_0_rgba(0,0,0,0.12)] sm:shadow-[0_6px_0_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:shadow-[0_6px_0_rgba(0,0,0,0.12)] sm:hover:shadow-[0_10px_0_rgba(0,0,0,0.12)]'} px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base font-bold sm:font-extrabold transition-all duration-200`}
                >
                  Dashboard
                </button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
