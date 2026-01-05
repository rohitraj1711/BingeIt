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
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Binge It</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.welcomeText}>
        Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}!
      </Text>

      {renderMovieSection('🔥 Trending Now', trendingMovies, 'trending-up')}
      {renderMovieSection('🎬 Popular Movies', popularMovies, 'heart')}
      {renderMovieSection('⭐ Top Rated', topRatedMovies, 'trophy')}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Browse Categories</Text>
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
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
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: "#1a1a2e",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
    textAlign: 'center',
  },
  categoryIcon: {
    fontSize: 32,
  },
});