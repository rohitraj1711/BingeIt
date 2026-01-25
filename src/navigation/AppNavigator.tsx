import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../lib/AuthContext';

// Import screens
import TabNavigator from './TabNavigator';
import Category from '../screens/Category';
import Index from '../screens/Index';
import Login from '../screens/Login';
import MovieDetails from '../screens/MovieDetails';
import Favorites from '../screens/Favorites';
import Onboarding from '../screens/Onboarding';
import Signup from '../screens/Signup';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f23' }}>
                <ActivityIndicator size="large" color="#7b2cbf" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#0f0f23' }
                }}
            >
                {user ? (
                    // Authenticated Stack
                    <>
                        <Stack.Screen name="Home" component={TabNavigator} />
                        <Stack.Screen name="MovieDetails" component={MovieDetails as any} />
                        <Stack.Screen name="Category" component={Category as any} />
                        <Stack.Screen name="Favorites" component={Favorites as any} />
                    </>
                ) : (
                    // Unauthenticated Stack
                    <>
                        <Stack.Screen name="Index" component={Index} />
                        <Stack.Screen name="Onboarding" component={Onboarding} />
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Signup" component={Signup} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
