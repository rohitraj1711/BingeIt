import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from "../../lib/AuthContext";

export default function ProfileTab() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              // Navigation will be handled by auth state
            } catch (error) {
              Alert.alert("Error", "Failed to logout");
            }
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      title: "My Watchlist",
      icon: "bookmark-outline",
      onPress: () => {
        // TODO: Navigate to watchlist
      }
    },
    {
      title: "Download Manager",
      icon: "download-outline",
      onPress: () => {
        // TODO: Navigate to downloads
      }
    },
    {
      title: "Playback Settings",
      icon: "settings-outline",
      onPress: () => {
        // TODO: Navigate to playback settings
      }
    },
    {
      title: "Account Settings",
      icon: "person-outline",
      onPress: () => {
        // TODO: Navigate to account settings
      }
    },
    {
      title: "Privacy & Security",
      icon: "lock-closed-outline",
      onPress: () => {
        // TODO: Navigate to privacy settings
      }
    },
    {
      title: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => {
        // TODO: Navigate to help
      }
    },
    {
      title: "About",
      icon: "information-circle-outline",
      onPress: () => {
        // TODO: Navigate to about
      }
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.userName}>
          {user?.displayName || user?.email?.split('@')[0] || "User"}
        </Text>
        <Text style={styles.userEmail}>
          {user?.email || "user@example.com"}
        </Text>
        
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Watched</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Watchlist</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Downloaded</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon as any} size={20} color="#7b2cbf" />
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#666" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="log-out-outline" size={20} color="#ff4757" />
            <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
    padding: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  editProfileButton: {
    backgroundColor: "#7b2cbf",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  statsSection: {
    flexDirection: "row",
    backgroundColor: "#1a1a2e",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#333",
    marginHorizontal: 20,
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
  logoutItem: {
    marginTop: 12,
  },
  logoutText: {
    color: "#ff4757",
  },
});