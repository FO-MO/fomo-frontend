/**
 * Unified storage utility that can switch between cookies and localStorage
 * Based on the STORAGE_METHOD configuration in tools.ts
 */

'use client'
import Cookies from 'js-cookie'
import { STORAGE_METHOD } from './tools'

// Storage keys
const TOKEN_KEY = 'fomo_token'
const USER_KEY = 'fomo_user'

// Cookie options
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production', // Only use secure in production (HTTPS)
}

interface UserData {
  documentId?: string
  id?: number
  username?: string
  email?: string
  [key: string]: unknown // Allow for additional properties
}

// Export the UserData interface
export type { UserData }

// Generic storage interface
interface StorageAdapter {
  setItem(key: string, value: string): void
  getItem(key: string): string | null
  removeItem(key: string): void
}

// Cookie storage adapter
const cookieStorage: StorageAdapter = {
  setItem: (key: string, value: string) => {
    Cookies.set(key, value, COOKIE_OPTIONS)
  },
  getItem: (key: string) => {
    return Cookies.get(key) || null
  },
  removeItem: (key: string) => {
    Cookies.remove(key, { path: '/' })
  },
}

// localStorage adapter
const localStorageAdapter: StorageAdapter = {
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value)
    }
  },
  getItem: (key: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key)
    }
    return null
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  },
}

// Get the current storage adapter based on configuration
const getStorageAdapter = (): StorageAdapter => {
  return STORAGE_METHOD === 'cookies' ? cookieStorage : localStorageAdapter
}

/**
 * Set authentication token
 */
export function setAuthToken(token: string): void {
  const storage = getStorageAdapter()
  storage.setItem(TOKEN_KEY, token)
}

/**
 * Get authentication token
 */
export function getAuthToken(): string | null {
  const storage = getStorageAdapter()
  return storage.getItem(TOKEN_KEY)
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  const storage = getStorageAdapter()
  storage.removeItem(TOKEN_KEY)
}

/**
 * Set user data
 */
export function setUserData(user: UserData): void {
  const storage = getStorageAdapter()
  storage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * Get user data
 */
export function getUserData(): UserData | null {
  const storage = getStorageAdapter()
  const userStr = storage.getItem(USER_KEY)
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

/**
 * Remove user data
 */
export function removeUserData(): void {
  const storage = getStorageAdapter()
  storage.removeItem(USER_KEY)
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  removeAuthToken()
  removeUserData()
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

/**
 * Get current storage method being used
 */
export function getCurrentStorageMethod(): 'cookies' | 'localStorage' {
  return STORAGE_METHOD
}

// Legacy cookie function names for backward compatibility
export const setAuthTokenCookie = setAuthToken
export const getAuthTokenCookie = getAuthToken
export const removeAuthTokenCookie = removeAuthToken
export const setUserCookie = setUserData
export const getUserCookie = getUserData
export const removeUserCookie = removeUserData
export const clearAuthCookies = clearAuthData
