import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatRating, getMoviePoster, getPopularMovies, getTopRatedMovies, getTrendingMovies } from '../../api/tmdb';
import { useAuth } from "../../lib/AuthContext";

// Movie type interface
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  vote_average: number;
}

export default function HomeTab({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const [trending, popular, topRated] = await Promise.all([
        getTrendingMovies(),
        getPopularMovies(),
        getTopRatedMovies()
      ]);

      setTrendingMovies(trending.slice(0, 20));
      setPopularMovies(popular.slice(0, 20));
      setTopRatedMovies(topRated.slice(0, 20));
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovieCard = (movie: Movie) => (
    <TouchableOpacity
      key={movie.id}
      style={styles.movieCard}
      onPress={() => navigation.navigate('MovieDetails', { id: movie.id })}
    >
      <Image
        source={{ uri: getMoviePoster(movie.poster_path, 'w342') || '' }}
        style={styles.moviePoster}
        resizeMode="cover"
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {movie.title}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.rating}>{formatRating(movie.vote_average)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMovieSection = (title: string, movies: Movie[], iconName: string) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={iconName} size={24} color="#7b2cbf" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {movies.map(renderMovieCard)}
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7b2cbf" />
        <Text style={styles.loadingText}>Loading movies...</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeftPlaceholder} />
        <Text style={styles.headerTitle}>Binge it</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <Text style={styles.welcomeText}>
        Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}!
      </Text>

      {renderMovieSection(' Trending Now', trendingMovies, 'trending-up')}
      {renderMovieSection(' Popular Movies', popularMovies, 'heart')}
      {renderMovieSection(' Top Rated', topRatedMovies, 'trophy')}

      <View style={styles.section}>
        <Text style={styles.categoryHeading}>Browse Categories</Text>

        <View style={styles.categoriesContainer}>
          {[
            { title: 'Action Movies', icon: 'rocket-outline', slug: 'action-movies' },
            { title: 'Drama Movies', icon: 'heart-outline', slug: 'drama-series' },
            { title: 'Comedy', icon: 'happy-outline', slug: 'comedy' },
            { title: 'Documentaries', icon: 'library-outline', slug: 'documentaries' },
            { title: 'Sci-Fi', icon: 'planet-outline', slug: 'sci-fi' },
            { title: 'Horror', icon: 'skull-outline', slug: 'horror' },
          ].map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Category', { slug: category.slug })}
            >
              <Ionicons name={category.icon as any} size={24} color="#5c1f92ff" />
              <Text style={styles.categoryText}>{category.title}</Text>
            </TouchableOpacity>
          ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f23',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 5,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#7b2cbf",
    fontFamily: "cursive",
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
  headerLeftPlaceholder: {
    width: 40, // Matches notification button width approx
  },
  notificationButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4757',
    borderWidth: 1,
    borderColor: '#0f0f23',
  },
  profileIcon: {
    fontSize: 24,
    color: "#fff",
  },
  welcomeText: {
    fontSize: 16,
    color: "#ccc",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 10,
  },
  horizontalScroll: {
    marginLeft: -10,
  },
  scrollContent: {
    paddingLeft: 10,
  },
  movieCard: {
    width: 140,
    marginRight: 15,
  },
  moviePoster: {
    width: 140,
    height: 210,
    borderRadius: 10,
    backgroundColor: '#1a1a2e',
  },
  movieInfo: {
    marginTop: 8,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#FFD700',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  categoryHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 15, // Added spacing below heading
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: '48%', // Fixed width for 2-column consistency
    flexDirection: 'row', // Horizontal layout
    backgroundColor: "#1a1a2e",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12, // Slightly smaller radius for minimal look
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'rgba(123, 44, 191, 0.3)',
  },
  categoryText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 10, // Space between icon and text
    flex: 1, // Allow text to wrap if needed
  },
  categoryIcon: {
    fontSize: 18, // Smaller icon
    color: '#7b2cbf',
  },
});