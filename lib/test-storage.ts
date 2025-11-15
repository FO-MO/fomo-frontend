/**
 * Test file to verify unified storage system works correctly
 * You can run this in the browser console to test the storage functions
 */

// Import the storage functions
import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setUserData,
  getUserData,
  removeUserData,
  clearAuthData,
  isAuthenticated,
  getCurrentStorageMethod,
} from '@/lib/storage'

// Test function
export function testStorageSystem() {
  console.log('🧪 Testing Unified Storage System...')
  console.log(`📦 Current storage method: ${getCurrentStorageMethod()}`)

  // Test token storage
  console.log('\n🔑 Testing Auth Token...')
  setAuthToken('test-token-123')
  console.log('✅ Token set:', getAuthToken())
  console.log('✅ Is authenticated:', isAuthenticated())

  // Test user data storage
  console.log('\n👤 Testing User Data...')
  const testUser = {
    id: 123,
    username: 'testuser',
    email: 'test@example.com',
    documentId: 'doc-123',
  }
  setUserData(testUser)
  console.log('✅ User data set:', getUserData())

  // Test storage method detection
  console.log('\n📊 Storage Method Info...')
  if (getCurrentStorageMethod() === 'localStorage') {
    console.log(
      '✅ Using localStorage - data will persist until manually cleared'
    )
    console.log('🔍 Check localStorage in DevTools:', {
      token: localStorage.getItem('fomo_token'),
      user: localStorage.getItem('fomo_user'),
    })
  } else {
    console.log('✅ Using cookies - data will expire based on cookie settings')
    console.log('🔍 Check cookies in DevTools Application tab')
  }

  // Test cleanup
  console.log('\n🧹 Testing Cleanup...')
  clearAuthData()
  console.log('✅ Data cleared - Token:', getAuthToken())
  console.log('✅ Data cleared - User:', getUserData())
  console.log('✅ Is authenticated after clear:', isAuthenticated())

  console.log('\n🎉 Storage system test completed!')
}

// Export for use in components
export default testStorageSystem
