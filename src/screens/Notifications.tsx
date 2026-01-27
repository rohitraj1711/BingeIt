import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'trailer' | 'system' | 'recommendation';
    image?: string;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'New Trailer: Avatar 3',
        message: 'Check out the official trailer only on Binge It!',
        time: '2 hours ago',
        read: false,
        type: 'trailer',
        image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmPA.jpg'
    },
    {
        id: '2',
        title: 'Weekend Recommendation',
        message: 'Based on your watch history, you might like "Dune: Part Two".',
        time: '5 hours ago',
        read: true,
        type: 'recommendation',
        image: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'
    },
    {
        id: '3',
        title: 'System Update',
        message: 'We have updated our privacy policy.',
        time: '1 day ago',
        read: true,
        type: 'system'
    }
];

export default function Notifications() {
    const navigation = useNavigation();

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity style={[styles.itemContainer, !item.read && styles.unreadItem]}>
            <View style={styles.iconContainer}>
                {item.type === 'trailer' ? (
                    <Ionicons name="videocam" size={24} color="#7b2cbf" />
                ) : item.type === 'recommendation' ? (
                    <Ionicons name="star" size={24} color="#FFD700" />
                ) : (
                    <Ionicons name="information-circle" size={24} color="#aaa" />
                )}
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
            </View>
            {!item.read && <View style={styles.dot} />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity>
                    <Text style={styles.markAllText}>Mark all read</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={SAMPLE_NOTIFICATIONS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={64} color="#333" />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f0f23",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 50, // Safe area
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a2e',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    markAllText: {
        color: '#7b2cbf',
        fontSize: 14,
        fontWeight: '600',
    },
    listContent: {
        padding: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#1a1a2e',
    },
    unreadItem: {
        borderColor: 'rgba(123, 44, 191, 0.4)',
        backgroundColor: 'rgba(123, 44, 191, 0.05)',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
        marginRight: 10,
    },
    time: {
        fontSize: 12,
        color: '#666',
    },
    message: {
        fontSize: 14,
        color: '#aaa',
        lineHeight: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#7b2cbf',
        marginLeft: 10,
    },
    emptyContainer: {
        padding: 50,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        marginTop: 20,
    }
});
