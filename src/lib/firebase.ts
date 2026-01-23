import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

console.log('🔥 React Native Firebase initialized');

// Export auth and firestore instances
export { auth };
export const db = firestore();

export default auth;
