// Firebase Auth Persistence Configuration
// This file handles the Firebase Auth warning about AsyncStorage in React Native

import AsyncStorage from '@react-native-async-storage/async-storage';

// Suppress Firebase Auth warning by providing AsyncStorage globally
// The warning occurs because Firebase Web SDK doesn't automatically detect AsyncStorage
// But our AuthContext already handles persistence manually
if (typeof global !== 'undefined') {
  // @ts-ignore - Suppress Firebase warning about missing AsyncStorage
  global.AsyncStorage = AsyncStorage;
}

// Alternative: Set up custom persistence helper
export const authPersistence = {
  async setAuthData(key: string, data: any) {
    try {
      await AsyncStorage.setItem(`firebase_auth_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  },

  async getAuthData(key: string) {
    try {
      const data = await AsyncStorage.getItem(`firebase_auth_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading auth data:', error);
      return null;
    }
  },

  async removeAuthData(key: string) {
    try {
      await AsyncStorage.removeItem(`firebase_auth_${key}`);
    } catch (error) {
      console.error('Error removing auth data:', error);
    }
  }
};

export default authPersistence;