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
import Notifications from '../screens/Notifications';

const Stack = createNativeStackNavigator();

import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import InterestSurvey from '../screens/InterestSurvey';

// ... imports ...

export default function AppNavigator() {
    const { user, loading: authLoading } = useAuth();
    const [surveyChecked, setSurveyChecked] = useState(false);
    const [needsSurvey, setNeedsSurvey] = useState(false);

    useEffect(() => {
        const checkSurveyStatus = async () => {
            if (user) {
                try {
                    const doc = await firestore().collection('users').doc(user.uid).get();
                    const userData = doc.data();
                    // If no user doc or hasCompletedSurvey is false/undefined, they need survey
                    setNeedsSurvey(!userData?.hasCompletedSurvey);
                } catch (e) {
                    console.error("Error checking survey status:", e);
                    setNeedsSurvey(false); // Default to home on error
                }
            }
            setSurveyChecked(true);
        };

        if (!authLoading) {
            if (user) {
                checkSurveyStatus();
            } else {
                setSurveyChecked(true);
            }
        }
    }, [user, authLoading]);

    if (authLoading || (user && !surveyChecked)) {
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
                    needsSurvey ? (
                        <Stack.Screen name="InterestSurvey" component={InterestSurvey} />
                    ) : (
                        <>
                            <Stack.Screen name="Home" component={TabNavigator} />
                            <Stack.Screen name="MovieDetails" component={MovieDetails as any} />
                            <Stack.Screen name="Category" component={Category as any} />
                            <Stack.Screen name="Favorites" component={Favorites as any} />
                            <Stack.Screen name="Notifications" component={Notifications as any} />
                            {/* Fallback route if manual nav needed */}
                            <Stack.Screen name="InterestSurvey" component={InterestSurvey} />
                        </>
                    )
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
