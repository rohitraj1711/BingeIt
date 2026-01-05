import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/lib/AuthContext';


// Import screens
import TabNavigator from './src/navigation/TabNavigator';
import Category from './src/screens/Category';
import Index from './src/screens/Index';
import Login from './src/screens/Login';
import MovieDetails from './src/screens/MovieDetails';
import Onboarding from './src/screens/Onboarding';
import Signup from './src/screens/Signup';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Index"
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#0f0f23' }
              }}
            >
              <Stack.Screen name="Index" component={Index} />
              <Stack.Screen name="Onboarding" component={Onboarding} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="Home" component={TabNavigator} />
              <Stack.Screen name="MovieDetails" component={MovieDetails as any} />
              <Stack.Screen name="Category" component={Category as any} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
