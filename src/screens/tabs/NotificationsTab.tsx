import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function NotificationsTab() {
  const notifications = [
    {
      id: 1,
      type: "new_release",
      title: "New Episode Available",
      message: "Stranger Things S5E1 is now available to watch",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "recommendation",
      title: "Recommended for You",
      message: "Based on your viewing history, you might like 'The Witcher'",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      type: "update",
      title: "App Update",
      message: "New features and improvements are available",
      time: "3 days ago",
      read: true,
    },
    {
      id: 4,
      type: "watchlist",
      title: "Watchlist Update",
      message: "3 movies from your watchlist are now available",
      time: "1 week ago",
      read: false,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_release":
        return "play-circle-outline";
      case "recommendation":
        return "star-outline";
      case "update":
        return "download-outline";
      case "watchlist":
        return "bookmark-outline";
      default:
        return "notifications-outline";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "new_release":
        return "#e50914";
      case "recommendation":
        return "#7b2cbf";
      case "update":
        return "#00b4d8";
      case "watchlist":
        return "#f77f00";
      default:
        return "#666";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity style={styles.markAllRead}>
          <Text style={styles.markAllReadText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={64} color="#666" />
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptyMessage}>
            You're all caught up! New notifications will appear here.
          </Text>
        </View>
      ) : (
        <View style={styles.notificationsContainer}>
          {notifications.map((notification) => (
            <TouchableOpacity 
              key={notification.id} 
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadNotification
              ]}
            >
              <View style={styles.notificationIcon}>
                <Ionicons 
                  name={getNotificationIcon(notification.type) as any} 
                  size={24} 
                  color={getNotificationColor(notification.type)} 
                />
              </View>
              
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={[
                    styles.notificationTitle,
                    !notification.read && styles.unreadTitle
                  ]}>
                    {notification.title}
                  </Text>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
                
                <Text style={styles.notificationTime}>
                  {notification.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  markAllRead: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#7b2cbf",
    borderRadius: 6,
  },
  markAllReadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 100,
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
  notificationsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: "#e50914",
  },
  notificationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  unreadTitle: {
    fontWeight: "700",
  },
  unreadDot: {
    width: 8,
    height: 8,
    backgroundColor: "#e50914",
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#666",
  },
});