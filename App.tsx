import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/lib/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

import { useEffect, useState, useRef } from 'react';
import { PermissionsAndroid, Platform, Animated, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function App() {
  const [notification, setNotification] = useState<{ title: string, body: string } | null>(null);
  const slideAnim = useRef(new Animated.Value(-150)).current;

  const showNotification = (title: string, body: string) => {
    setNotification({ title, body });
    // Slide down
    Animated.spring(slideAnim, {
      toValue: 20, // Adjust based on status bar/notch
      useNativeDriver: true,
      friction: 8,
      tension: 40
    }).start();

    // Auto-hide after 4 seconds
    setTimeout(() => {
      hideNotification();
    }, 4000);
  };

  const hideNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -150,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setNotification(null));
  };

  useEffect(() => {
    const requestUserPermission = async () => {
      if (Platform.OS === 'android') {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      }

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        subscribeToTopics();
      }
    };

    const subscribeToTopics = async () => {
      // Get and log token for testing
      const token = await messaging().getToken();
      console.log('🔥 FCM Token:', token);

      // Auto-subscribe to all standard topics for now
      await messaging().subscribeToTopic('all_trailers');
      await messaging().subscribeToTopic('hollywood_trailers');
      await messaging().subscribeToTopic('bollywood_trailers');
    };

    requestUserPermission();

    // Foreground listener
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      showNotification(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body || 'Check it out!'
      );
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
          {notification && (
            <Animated.View style={[styles.notificationToast, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications" size={24} color="#fff" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.toastTitle}>{notification.title}</Text>
                <Text style={styles.toastBody} numberOfLines={2}>{notification.body}</Text>
              </View>
              <TouchableOpacity onPress={hideNotification} style={styles.closeButton}>
                <Ionicons name="close" size={20} color="#ccc" />
              </TouchableOpacity>
            </Animated.View>
          )}
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  notificationToast: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#7b2cbf',
    zIndex: 9999,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7b2cbf',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  toastTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  toastBody: {
    color: '#ccc',
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
