import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SearchTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const popularSearches = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance"];
  const recentSearches = ["Stranger Things", "The Witcher", "Breaking Bad"];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search functionality
    if (query.length > 2) {
      // Mock search results for now
      setSearchResults([
        { id: 1, title: "Movie 1", type: "movie", year: 2023 },
        { id: 2, title: "TV Show 1", type: "series", year: 2024 },
      ]);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies, TV shows..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          {searchResults.map((result) => (
            <TouchableOpacity key={result.id} style={styles.resultCard}>
              <View style={styles.resultInfo}>
                <Text style={styles.resultTitle}>{result.title}</Text>
                <Text style={styles.resultMeta}>
                  {result.type} • {result.year}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View>
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.recentSearchItem}
                  onPress={() => handleSearch(search)}
                >
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.recentSearchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
            <View style={styles.categoriesContainer}>
              {popularSearches.map((category, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.categoryChip}
                  onPress={() => handleSearch(category)}
                >
                  <Text style={styles.categoryChipText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
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
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  recentSearchText: {
    color: "#ccc",
    fontSize: 16,
    marginLeft: 10,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryChip: {
    backgroundColor: "#7b2cbf",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  categoryChipText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
  resultCard: {
    backgroundColor: "#1a1a2e",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  resultMeta: {
    color: "#666",
    fontSize: 14,
  },
});