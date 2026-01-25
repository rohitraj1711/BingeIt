import { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = "da0907ccc71311c1b0909aed63292a33";
const RECENT_SEARCHES_KEY = "@recent_searches";
const MAX_RECENT_SEARCHES = 10;

const { width } = Dimensions.get("window");

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

interface RecentSearch {
  id: number;
  title: string;
  media_type: string;
  poster_path?: string;
}

export default function SearchTab() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const popularCategories = [
    { name: "Action", slug: "action-movies", icon: "flash" },
    { name: "Comedy", slug: "comedy", icon: "happy" },
    { name: "Drama", slug: "drama-series", icon: "heart" },
    { name: "Horror", slug: "horror", icon: "skull" },
    { name: "Sci-Fi", slug: "sci-fi", icon: "planet" },
    { name: "Romance", slug: "romance", icon: "heart-circle" },
  ];

  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        searchMoviesAndTV();
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const saveRecentSearch = async (item: RecentSearch) => {
    try {
      // Remove duplicate if exists
      const filtered = recentSearches.filter(
        (s) => !(s.id === item.id && s.media_type === item.media_type)
      );

      // Add to beginning
      const updated = [item, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  const clearAllRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  };

  const searchMoviesAndTV = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}&page=1`
      );
      const data = await response.json();

      const filtered = data.results.filter(
        (item: SearchResult) =>
          item.media_type === "movie" || item.media_type === "tv"
      );

      setSearchResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleResultPress = async (result: SearchResult) => {
    const title = result.title || result.name || "Untitled";

    // Save to recent searches
    await saveRecentSearch({
      id: result.id,
      title,
      media_type: result.media_type,
      poster_path: result.poster_path,
    });

    // Navigate to details
    if (result.media_type === "movie") {
      (navigation as any).navigate("MovieDetails", { id: result.id.toString() });
    }
  };

  const handleRecentSearchPress = async (item: RecentSearch) => {
    // Fill search bar
    setSearchQuery(item.title);

    // Move to top of recent searches
    await saveRecentSearch(item);

    // Navigate to details
    if (item.media_type === "movie") {
      (navigation as any).navigate("MovieDetails", { id: item.id.toString() });
    }
  };

  const handleCategoryPress = (category: { name: string; slug: string }) => {
    (navigation as any).navigate("Category", { slug: category.slug });
  };

  const getTitle = (result: SearchResult) => {
    return result.title || result.name || "Untitled";
  };

  const getYear = (result: SearchResult) => {
    const date = result.release_date || result.first_air_date;
    return date ? new Date(date).getFullYear().toString() : "N/A";
  };

  const getMediaTypeLabel = (type: string) => {
    return type === "movie" ? "Movie" : "TV Series";
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Gradient Background using layered views */}
      <View style={styles.gradientLayer1} />
      <View style={styles.gradientLayer2} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.title}>Search</Text>
          <Text style={styles.subtitle}>Find movies & TV shows</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={22}
              color="#9b59b6"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies, TV shows..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={handleSearch}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={handleClearSearch}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={22} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9b59b6" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {/* Search Results / Suggestions */}
        {!loading && searchResults.length > 0 ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>
              Suggestions ({searchResults.length.toString()})
            </Text>
            {searchResults.map((result) => (
              <TouchableOpacity
                key={`${result.media_type}-${result.id}`}
                style={styles.resultCard}
                onPress={() => handleResultPress(result)}
                activeOpacity={0.7}
              >
                {result.poster_path ? (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w200${result.poster_path}`,
                    }}
                    style={styles.resultPoster}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.resultPosterPlaceholder}>
                    <Ionicons name="film-outline" size={28} color="#666" />
                  </View>
                )}
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle} numberOfLines={2}>
                    {getTitle(result)}
                  </Text>
                  <View style={styles.resultMetaContainer}>
                    <View style={styles.mediaTypeBadge}>
                      <Text style={styles.mediaTypeText}>
                        {getMediaTypeLabel(result.media_type)}
                      </Text>
                    </View>
                    <Text style={styles.resultYear}>{getYear(result)}</Text>
                    {!!result.vote_average && result.vote_average > 0 && (
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingText}>
                          {result.vote_average.toFixed(1)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        ) : !loading && searchQuery.length > 1 && searchResults.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="search-outline" size={64} color="#9b59b6" />
            </View>
            <Text style={styles.emptyText}>No results found</Text>
            <Text style={styles.emptySubtext}>
              Try searching for something else
            </Text>
          </View>
        ) : (
          <View style={styles.defaultContent}>
            {/* Recent Searches Section */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                  <TouchableOpacity
                    onPress={clearAllRecentSearches}
                    style={styles.clearAllButton}
                  >
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.recentSearchesList}>
                  {recentSearches.map((item, index) => (
                    <TouchableOpacity
                      key={`${item.media_type}-${item.id}-${index}`}
                      style={styles.recentSearchItem}
                      onPress={() => handleRecentSearchPress(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.recentSearchIconContainer}>
                        <Ionicons name="time-outline" size={18} color="#9b59b6" />
                      </View>
                      <View style={styles.recentSearchInfo}>
                        <Text style={styles.recentSearchText} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.recentSearchType}>
                          {getMediaTypeLabel(item.media_type)}
                        </Text>
                      </View>
                      <Ionicons
                        name="arrow-forward-outline"
                        size={18}
                        color="#666"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Popular Categories Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Categories</Text>
              <View style={styles.categoriesContainer}>
                {popularCategories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.categoryChip}
                    onPress={() => handleCategoryPress(category)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={16}
                      color="#fff"
                      style={styles.categoryIcon}
                    />
                    <Text style={styles.categoryChipText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Discover Section Placeholder */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Discover</Text>
              <View style={styles.discoverCard}>
                <Ionicons name="sparkles" size={32} color="#9b59b6" />
                <Text style={styles.discoverTitle}>
                  Search for your favorite content
                </Text>
                <Text style={styles.discoverSubtitle}>
                  Type in the search bar above to find movies and TV shows
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
  },
  gradientLayer1: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 200,
    backgroundColor: "#1a0a2e",
    opacity: 0.8,
  },
  gradientLayer2: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 100,
    height: 200,
    backgroundColor: "#16213e",
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 50, 0.9)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(155, 89, 182, 0.3)",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    padding: 50,
    alignItems: "center",
  },
  loadingText: {
    color: "#888",
    marginTop: 12,
    fontSize: 16,
  },
  defaultContent: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  clearAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(155, 89, 182, 0.2)",
  },
  clearAllText: {
    color: "#9b59b6",
    fontSize: 14,
    fontWeight: "600",
  },
  recentSearchesList: {
    paddingHorizontal: 20,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 50, 0.6)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  recentSearchIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(155, 89, 182, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  recentSearchInfo: {
    flex: 1,
  },
  recentSearchText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  recentSearchType: {
    color: "#888",
    fontSize: 13,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7b2cbf",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    margin: 4,
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryChipText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  discoverCard: {
    marginHorizontal: 20,
    padding: 24,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "rgba(155, 89, 182, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(155, 89, 182, 0.3)",
  },
  discoverTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  discoverSubtitle: {
    color: "#888",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  resultsContainer: {
    paddingBottom: 20,
  },
  resultCard: {
    backgroundColor: "rgba(30, 30, 50, 0.8)",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(155, 89, 182, 0.15)",
  },
  resultPoster: {
    width: 55,
    height: 82,
    borderRadius: 10,
    marginRight: 14,
  },
  resultPosterPlaceholder: {
    width: 55,
    height: 82,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: "rgba(50, 50, 70, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  resultMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  mediaTypeBadge: {
    backgroundColor: "rgba(155, 89, 182, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  mediaTypeText: {
    color: "#9b59b6",
    fontSize: 11,
    fontWeight: "600",
  },
  resultYear: {
    color: "#888",
    fontSize: 13,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  emptyContainer: {
    padding: 60,
    alignItems: "center",
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(155, 89, 182, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  emptySubtext: {
    color: "#888",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
});