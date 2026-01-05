import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ActivityTab() {
  const watchHistory = [
    {
      id: 1,
      title: "Stranger Things",
      episode: "S4E9",
      watchedAt: "2 hours ago",
      progress: 85,
      type: "series",
    },
    {
      id: 2,
      title: "The Dark Knight",
      watchedAt: "Yesterday",
      progress: 100,
      type: "movie",
    },
    {
      id: 3,
      title: "Breaking Bad",
      episode: "S3E7",
      watchedAt: "3 days ago",
      progress: 45,
      type: "series",
    },
    {
      id: 4,
      title: "Inception",
      watchedAt: "1 week ago",
      progress: 100,
      type: "movie",
    },
  ];

  const continueWatching = watchHistory.filter(item => item.progress < 100);
  const completed = watchHistory.filter(item => item.progress === 100);

  const formatProgress = (progress: number) => {
    if (progress === 100) return "Completed";
    return `${progress}% watched`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <TouchableOpacity style={styles.clearButton}>
          <Ionicons name="trash-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {continueWatching.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Watching</Text>
          {continueWatching.map((item) => (
            <TouchableOpacity key={item.id} style={styles.activityCard}>
              <View style={styles.cardContent}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.episode && (
                    <Text style={styles.itemEpisode}>{item.episode}</Text>
                  )}
                  <Text style={styles.itemMeta}>
                    {formatProgress(item.progress)} • {item.watchedAt}
                  </Text>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[styles.progressFill, { width: `${item.progress}%` }]} 
                    />
                  </View>
                  <Ionicons name="play-circle" size={24} color="#e50914" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Watch History</Text>
        {watchHistory.map((item) => (
          <TouchableOpacity key={item.id} style={styles.historyCard}>
            <View style={styles.historyIcon}>
              <Ionicons 
                name={item.type === "movie" ? "film-outline" : "tv-outline"} 
                size={20} 
                color="#7b2cbf" 
              />
            </View>
            
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>{item.title}</Text>
              {item.episode && (
                <Text style={styles.historyEpisode}>{item.episode}</Text>
              )}
              <Text style={styles.historyMeta}>
                {formatProgress(item.progress)} • {item.watchedAt}
              </Text>
            </View>
            
            <View style={styles.historyActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="information-circle-outline" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="bookmark-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Movies Watched</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Episodes Watched</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>48h</Text>
            <Text style={styles.statLabel}>Watch Time</Text>
          </View>
        </View>
      </View>
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
  clearButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 15,
  },
  activityCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  itemEpisode: {
    fontSize: 14,
    color: "#7b2cbf",
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: "#666",
  },
  progressContainer: {
    alignItems: "center",
    marginLeft: 16,
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#e50914",
    borderRadius: 2,
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  historyIcon: {
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  historyEpisode: {
    fontSize: 14,
    color: "#7b2cbf",
    marginBottom: 2,
  },
  historyMeta: {
    fontSize: 12,
    color: "#666",
  },
  historyActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e50914",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});