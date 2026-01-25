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

interface FavoriteItem {
    id: string; // Movie ID
    title: string;
    poster_path: string;
    addedAt: any; // Timestamp
}

export default function Favorites() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isFocused) {
            loadFavorites();
        }
    }, [isFocused]);

    const loadFavorites = async () => {
        const user = auth().currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const snapshot = await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('favorites')
                .orderBy('addedAt', 'desc')
                .get();

            const items: FavoriteItem[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as FavoriteItem));

            setFavorites(items);
        } catch (error) {
            console.error("Error loading favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMoviePress = (movieId: string) => {
        (navigation as any).navigate("MovieDetails", { id: movieId });
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f0f23" />

            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>My Favorites</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#7b2cbf" />
                </View>
            ) : favorites.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="heart-dislike-outline" size={64} color="#666" />
                    <Text style={styles.emptyTitle}>No favorites yet</Text>
                    <Text style={styles.emptyMessage}>
                        Movies you mark as favorite will appear here.
                    </Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView}>
                    <View style={styles.listContainer}>
                        {favorites.map((item) => (
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
                                        Added: {item.addedAt?.toDate().toLocaleDateString()}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#666" />
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
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
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
