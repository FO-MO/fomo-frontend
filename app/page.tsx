'use client'

import TopBar from '@/components/bars/topBar'
import Hero1 from '@/components/hero/Hero1'
import Hero2 from '@/components/hero/Hero2'
import Hero3 from '@/components/hero/Hero3'
import Hero4 from '@/components/hero/Hero4'
import Hero5 from '@/components/hero/Hero5'
import Footer from '@/components/bars/footer'
import { useEffect, useState } from 'react'

// Safely access localStorage only in the browser
interface User {
  username: string
  abbreviation: string
  userType: 'student' | 'college' | 'employer'
  loggedIn: boolean
}

function useParsedUser() {
  const [parsedUser, setParsedUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const rawUser =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('fomo_user')
          : null
      if (rawUser) {
        const userObj = JSON.parse(rawUser)
        setParsedUser({
          ...userObj,
          loggedIn: true,
          userType: 'student',
        })
        console.log('User from localStorage:', userObj)
      }
    } catch (e) {
      console.warn('Failed to read user from localStorage', e)
    }
  }, [])

  return parsedUser
}

export default function Home() {
  const parsedUser = useParsedUser()
  return (
    <>
      <TopBar theme='home' user={parsedUser} />
      <Hero1 />
      <Hero2 />
      <Hero3 />
      <Hero4 />
      <Hero5 />
      <Footer />
    </>
  )
}
