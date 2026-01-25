import { Alert, StyleSheet, Text, TouchableOpacity, View, Image, Modal, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from "../../lib/AuthContext";
import { useState } from "react";

export default function ProfileTab() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

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
      title: "Privacy & Security",
      icon: "lock-closed-outline",
      onPress: () => setShowPrivacyModal(true)
    },
    {
      title: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => setShowHelpModal(true)
    }
  ];

  const PrivacyModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showPrivacyModal}
      onRequestClose={() => setShowPrivacyModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy & Security</Text>
            <TouchableOpacity onPress={() => setShowPrivacyModal(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.sectionHeader}>Data Collection</Text>
            <Text style={styles.modalText}>
              We collect minimal data to provide you with the best experience. This includes your watchlist, watch history, and account preferences.
            </Text>

            <Text style={styles.sectionHeader}>Security</Text>
            <Text style={styles.modalText}>
              Your data is encrypted and stored securely using industry-standard protocols. We never share your personal information with third parties without your consent.
            </Text>

            <Text style={styles.sectionHeader}>User Rights</Text>
            <Text style={styles.modalText}>
              You have the right to request access to your data, correction of inaccuracies, or deletion of your account at any time.
            </Text>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const HelpModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showHelpModal}
      onRequestClose={() => setShowHelpModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Help & Support</Text>
            <TouchableOpacity onPress={() => setShowHelpModal(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>

            <View style={styles.faqItem}>
              <Text style={styles.question}>How do I download movies?</Text>
              <Text style={styles.answer}>Currently, downloading is available on select titles. Look for the download icon on the movie details page.</Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.question}>Can I change my password?</Text>
              <Text style={styles.answer}>Yes, you can reset your password from the login screen using the "Forgot Password" option.</Text>
            </View>

            <Text style={styles.sectionHeader}>Contact Us</Text>
            <Text style={styles.modalText}>
              Need more help? Reach out to our support team at:
            </Text>
            <Text style={styles.contactEmail}>support@bingeit.com</Text>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <PrivacyModal />
      <HelpModal />
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <View />
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {/* Using a static generic avatar image or an icon if no user photo */}
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
              </Text>
            )}
          </View>
        </View>

        <Text style={styles.userName}>
          {user?.displayName || user?.email?.split('@')[0] || "User"}
        </Text>
        <Text style={styles.userEmail}>
          {user?.email || "user@example.com"}
        </Text>

        <View style={styles.mainNavButtons}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => (navigation as any).navigate("HistoryTab")}
          >
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(52, 152, 219, 0.2)' }]}>
              <Ionicons name="time" size={24} color="#3498db" />
            </View>
            <Text style={styles.navButtonText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => (navigation as any).navigate("Favorites")}
          >
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(231, 76, 60, 0.2)' }]}>
              <Ionicons name="heart" size={24} color="#e74c3c" />
            </View>
            <Text style={styles.navButtonText}>Favorites</Text>
          </TouchableOpacity>
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

      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
  avatarContainer: {
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#7b2cbf",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  mainNavButtons: {
    flexDirection: 'row',
    marginTop: 30,
    width: '100%',
    justifyContent: 'space-around',
  },
  navButton: {
    alignItems: 'center',
    width: 100,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutContainer: {
    marginTop: 'auto',
    marginBottom: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#ff4757',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    shadowColor: "#ff4757",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#ff4757',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    color: '#666',
    fontSize: 12,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
    backgroundColor: '#333',
    borderRadius: 20,
  },
  modalBody: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7b2cbf',
    marginBottom: 10,
    marginTop: 10,
  },
  modalText: {
    fontSize: 15,
    color: '#ccc',
    lineHeight: 22,
    marginBottom: 15,
  },
  faqItem: {
    marginBottom: 20,
    backgroundColor: '#0f0f23',
    padding: 15,
    borderRadius: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
  },
  contactEmail: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});