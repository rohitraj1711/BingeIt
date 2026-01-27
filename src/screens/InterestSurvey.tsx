import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { useAuth } from '../lib/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const INTERESTS = [
    { id: 'hollywood', label: 'Hollywood 🇺🇸', topic: 'hollywood_trailers' },
    { id: 'bollywood', label: 'Bollywood 🇮🇳', topic: 'bollywood_trailers' },
    { id: 'web_series', label: 'Web Series 📺', topic: 'web_series_trailers' },
    { id: 'anime', label: 'Anime 🇯🇵', topic: 'anime_trailers' },
    { id: 'k_drama', label: 'K-Drama 🇰🇷', topic: 'kdrama_trailers' },
    { id: 'south_indian', label: 'South Indian 🎞️', topic: 'south_indian_trailers' },
    { id: 'horror', label: 'Horror 👻', topic: 'horror_trailers' },
    { id: 'action', label: 'Action 💥', topic: 'action_trailers' },
    { id: 'sci_fi', label: 'Sci-Fi 👽', topic: 'scifi_trailers' },
    { id: 'comedy', label: 'Comedy 😂', topic: 'comedy_trailers' },
];

export default function InterestSurvey({ navigation }: { navigation: any }) {
    const { user } = useAuth();
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const toggleInterest = (id: string) => {
        if (selectedInterests.includes(id)) {
            setSelectedInterests(prev => prev.filter(i => i !== id));
        } else {
            setSelectedInterests(prev => [...prev, id]);
        }
    };

    const handleContinue = async () => {
        if (!user) return;
        setSubmitting(true);

        try {
            // 1. Subscribe to FCM Topics
            const selectedTopics = INTERESTS.filter(i => selectedInterests.includes(i.id)).map(i => i.topic);

            // Always subscribe to general updates
            await messaging().subscribeToTopic('all_trailers');

            // Subscribe to selected topics
            await Promise.all(selectedTopics.map(topic => messaging().subscribeToTopic(topic)));

            // 2. Save to Firestore
            await firestore().collection('users').doc(user.uid).set({
                interests: selectedInterests,
                hasCompletedSurvey: true,
                email: user.email,
                updatedAt: firestore.FieldValue.serverTimestamp(),
            }, { merge: true });

            // 3. Navigate to Home
            // We replace the stack so user can't go back to survey
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });

        } catch (error) {
            console.error('Error saving preferences:', error);
            // Fallback: navigate anyway so user isn't stuck
            navigation.replace('Home');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pick your favorites</Text>
                <Text style={styles.subtitle}>
                    Select at least 3 categories to get personalized trailer notifications.
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.grid}>
                {INTERESTS.map((item) => {
                    const isSelected = selectedInterests.includes(item.id);
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.chip, isSelected && styles.chipSelected]}
                            onPress={() => toggleInterest(item.id)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                {item.label}
                            </Text>
                            {isSelected && (
                                <Ionicons name="checkmark-circle" size={18} color="#fff" style={styles.checkIcon} />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        selectedInterests.length < 1 && styles.buttonDisabled
                    ]}
                    onPress={handleContinue}
                    disabled={selectedInterests.length < 1 || submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Continue</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f23',
        padding: 20,
        paddingTop: 60,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#aaa',
        lineHeight: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: 100,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: '#333',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    chipSelected: {
        borderColor: '#7b2cbf',
        backgroundColor: '#7b2cbf',
    },
    chipText: {
        color: '#ccc',
        fontSize: 16,
        fontWeight: '600',
    },
    chipTextSelected: {
        color: '#fff',
    },
    checkIcon: {
        marginLeft: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#0f0f23',
        borderTopWidth: 1,
        borderTopColor: '#1a1a2e',
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#333',
        opacity: 0.7,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
