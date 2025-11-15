# Unified Storage System

## Overview

The FOMO Frontend now has a unified storage system that allows you to switch between **cookies** and **localStorage** for the entire application with a single configuration change.

## Configuration

The storage method is controlled by the `STORAGE_METHOD` constant in `/lib/tools.ts`:

```typescript
// Set this to 'cookies' or 'localStorage' to control storage method for the entire app
export const STORAGE_METHOD: 'cookies' | 'localStorage' = 'localStorage'
```

**Current Setting: localStorage** ✅

## How to Switch Storage Methods

1. Open `/lib/tools.ts`
2. Change the `STORAGE_METHOD` value:
   - For cookies: `export const STORAGE_METHOD: 'cookies' | 'localStorage' = 'cookies'`
   - For localStorage: `export const STORAGE_METHOD: 'cookies' | 'localStorage' = 'localStorage'`
3. Save the file - the change applies immediately to the entire application

## Storage Functions

The unified storage system is located in `/lib/storage.ts` and provides these functions:

### Authentication Token

- `setAuthToken(token: string)` - Store authentication token
- `getAuthToken()` - Retrieve authentication token
- `removeAuthToken()` - Remove authentication token

### User Data

- `setUserData(user: UserData)` - Store user data object
- `getUserData()` - Retrieve user data object
- `removeUserData()` - Remove user data

### Utility Functions

- `clearAuthData()` - Clear both token and user data
- `isAuthenticated()` - Check if user has valid token
- `getCurrentStorageMethod()` - Get current storage method ('cookies' or 'localStorage')

## Backward Compatibility

All existing code continues to work! The old cookie function names are still available:

```typescript
// These still work and automatically use the configured storage method
setAuthTokenCookie(token)
getAuthTokenCookie()
removeAuthTokenCookie()
setUserCookie(user)
getUserCookie()
removeUserCookie()
clearAuthCookies()
```

## Files Updated

1. **`/lib/tools.ts`** - Added `STORAGE_METHOD` configuration
2. **`/lib/storage.ts`** - New unified storage system (NEW FILE)
3. **`/lib/cookies.ts`** - Updated to re-export from storage.ts for compatibility
4. **`/lib/strapi/auth.ts`** - Updated to use new storage system

## Migration

**No migration needed!** All existing code continues to work exactly as before. The only difference is that now it uses localStorage instead of cookies (based on current configuration).

## Benefits

1. **Single Point of Control** - Change storage method for entire app in one place
2. **Backward Compatibility** - All existing code continues to work
3. **Type Safety** - Full TypeScript support for both storage methods
4. **SSR Safe** - Proper handling of server-side rendering scenarios
5. **Consistent API** - Same function signatures regardless of storage method

## Storage Method Comparison

### localStorage

- ✅ Larger storage capacity (5-10MB)
- ✅ No automatic expiration
- ✅ Not sent with HTTP requests (better performance)
- ❌ Not accessible during SSR
- ❌ Not shared across subdomains

### Cookies

- ✅ Works with SSR
- ✅ Can be shared across subdomains
- ✅ Automatic expiration support
- ❌ Sent with every HTTP request
- ❌ Limited storage capacity (4KB)
- ❌ More complex to manage

## Current Status

- ✅ **localStorage is currently enabled**
- ✅ All authentication tokens stored in localStorage
- ✅ All user data stored in localStorage
- ✅ Backward compatibility maintained
- ✅ No code changes required for existing functionality
