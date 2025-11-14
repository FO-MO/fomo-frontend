// Minimal Strapi auth helper for client-side usage
import {
  setAuthTokenCookie,
  getAuthTokenCookie,
  removeAuthTokenCookie,
} from '@/lib/cookies'

const STRAPI_URL = process.env.NEXT_PUBLIC_BACKEND_URL

interface AuthResponse {
  jwt?: string
  user?: {
    id: number
    username: string
    email: string
    documentId?: string
  }
  error?: {
    message: string
    status: number
  }
}

interface EmployerProfileInfo {
  documentId?: string
  id?: number
  employerId: string
  name: string
  email?: string
  phone?: string
  phoneNumber?: string
  description?: string
  website?: string
  industry?: string
  location?: string
  noOfEmployers?: number
  specialties?: string
  profilePic?: {
    id: number
    url: string
    name: string
  }
  backgroundImg?: {
    id: number
    url: string
    name: string
  }
}

interface UserProfileInfo {
  documentId?: string
  id?: number
  studentId?: string
  name?: string
  email?: string
  about?: string
  college?: string
  course?: string
  graduationYear?: string
  location?: string
  skills?: string[]
  interests?: string[]
}

interface UserMeResponse {
  id: number
  username: string
  email: string
  documentId?: string
  blocked?: boolean
  confirmed?: boolean
  employer_profile?: EmployerProfileInfo
  profile?: UserProfileInfo
}

export async function strapiLogin(
  identifier: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  })
  return res.json()
}

export async function strapiRegister(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })
  // console.log("Register response:", res.json());
  return res.json()
}

export function setAuthToken(token: string): void {
  setAuthTokenCookie(token)
}

export function removeAuthToken(): void {
  removeAuthTokenCookie()
}

export function getAuthToken(): string | null {
  return getAuthTokenCookie()
}

export async function fetchMe(
  token: string = getAuthTokenCookie() || ''
): Promise<UserMeResponse> {
  const res = await fetch(`${STRAPI_URL}/api/users/me?populate=*`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}
