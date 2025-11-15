/**
 * Cookie utility functions for managing authentication tokens and user data
 * DEPRECATED: Use the unified storage system in ./storage.ts instead
 * This file is kept for backward compatibility only
 */

// Re-export everything from the new unified storage system
export {
  setAuthToken as setAuthTokenCookie,
  getAuthToken as getAuthTokenCookie,
  removeAuthToken as removeAuthTokenCookie,
  setUserData as setUserCookie,
  getUserData as getUserCookie,
  removeUserData as removeUserCookie,
  clearAuthData as clearAuthCookies,
  isAuthenticated,
  getCurrentStorageMethod,
} from './storage'

// Re-export the UserData type for backward compatibility
export type { UserData } from './storage'
