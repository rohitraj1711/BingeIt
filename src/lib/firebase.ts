import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDVkVDSc8yphcfLr7HyLIxW6XUjcitHmEM",
  authDomain: "streamio-744e5.firebaseapp.com",
  projectId: "streamio-744e5",
  storageBucket: "streamio-744e5.firebasestorage.app",
  messagingSenderId: "648518937637",
  appId: "1:648518937637:android:390cf098fd4508bfbca3cc",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  auth = getAuth(app);
}

export { auth };

// Initialize Firestore
export const db = getFirestore(app);

export default app;
