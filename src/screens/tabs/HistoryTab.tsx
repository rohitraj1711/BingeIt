import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface HistoryItem {
    id: string; // Movie ID
    title: string;
    poster_path: string;
    watchedAt: any; // Timestamp
}

export default function HistoryTab() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isFocused) {
            loadHistory();
        }
    }, [isFocused]);

    const loadHistory = async () => {
        const user = auth().currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const snapshot = await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('history')
                .orderBy('watchedAt', 'desc')
                .get();

            const items: HistoryItem[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as HistoryItem));

            setHistory(items);
        } catch (error) {
            console.error("Error loading history:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMoviePress = (movieId: string) => {
        (navigation as any).navigate("MovieDetails", { id: movieId });
    };

    const handleClearHistory = async () => {
        const user = auth().currentUser;
        if (!user) return;

        try {
            // Batch delete is recommended for larger sets, but for simplicity:
            const snapshot = await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('history')
                .get();

            const batch = firestore().batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            setHistory([]);
        } catch (error) {
            console.error("Error clearing history:", error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f0f23" />

            <View style={styles.header}>
                <Text style={styles.title}>Watch History</Text>
                {history.length > 0 && (
                    <TouchableOpacity onPress={handleClearHistory} style={styles.clearButton}>
                        <Ionicons name="trash-outline" size={20} color="#e50914" />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#7b2cbf" />
                </View>
            ) : history.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="time-outline" size={64} color="#666" />
                    <Text style={styles.emptyTitle}>No history yet</Text>
                    <Text style={styles.emptyMessage}>
                        Movies you watch trailers for will appear here.
                    </Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView}>
                    <View style={styles.listContainer}>
                        {history.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.card}
                                onPress={() => handleMoviePress(item.id)}
                            >
                                <Image
                                    source={{
                                        uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
                                    }}
                                    style={styles.poster}
                                    resizeMode="cover"
                                />
                                <View style={styles.info}>
                                    <Text style={styles.movieTitle} numberOfLines={2}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.date}>
                                        Watched: {item.watchedAt?.toDate().toLocaleDateString()}
                                    </Text>
                                </View>
                                <Ionicons name="play-circle-outline" size={32} color="#7b2cbf" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f0f23",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: "#0f0f23",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    clearButton: {
        padding: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#fff",
        marginTop: 20,
        marginBottom: 10,
    },
    emptyMessage: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        lineHeight: 24,
    },
    scrollView: {
        flex: 1,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a2e",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    poster: {
        width: 60,
        height: 90,
        borderRadius: 8,
        marginRight: 15,
    },
    info: {
        flex: 1,
        marginRight: 10,
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 6,
    },
    date: {
        fontSize: 12,
        color: "#888",
    },
});
