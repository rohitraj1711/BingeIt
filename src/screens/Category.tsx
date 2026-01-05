import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { discoverMoviesByGenre, formatRating, getMoviePoster } from '../api/tmdb';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
}

type Props = {
  route: {
    params: {
      slug: string;
    };
  };
  navigation: any;
};

export default function Category({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { slug } = route.params || { slug: 'action-movies' };
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Genre mapping
  const genreMap: { [key: string]: number } = {
    'action-movies': 28,
    'drama-series': 18,
    'comedy': 35,
    'documentaries': 99,
    'sci-fi': 878,
    'horror': 27,
    'romance': 10749,
    'thriller': 53,
    'adventure': 12,
    'animation': 16
  };

  const getGenreName = (slug: string) => {
    const names: { [key: string]: string } = {
      'action-movies': 'Action Movies',
      'drama-series': 'Drama Movies',
      'comedy': 'Comedy',
      'documentaries': 'Documentaries',
      'sci-fi': 'Sci-Fi',
      'horror': 'Horror',
      'romance': 'Romance',
      'thriller': 'Thriller',
      'adventure': 'Adventure',
      'animation': 'Animation'
    };
    return names[slug as string] || 'Movies';
  };

  useEffect(() => {
    loadMoviesByGenre();
  }, [slug]);

  const loadMoviesByGenre = async () => {
    try {
      setLoading(true);
      const genreId = genreMap[slug as string];
      if (genreId) {
        const movieData = await discoverMoviesByGenre(genreId, page);
        setMovies(movieData);
      }
    } catch (error) {
      console.error('Error loading movies by genre:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    try {
      const genreId = genreMap[slug as string];
      if (genreId) {
        const nextPage = page + 1;
        const movieData = await discoverMoviesByGenre(genreId, nextPage);
        setMovies(prev => [...prev, ...movieData]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7b2cbf" />
        <Text style={styles.loadingText}>Loading {getGenreName(slug as string)}...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{getGenreName(slug as string)}</Text>
      </View>

      <Text style={styles.subtitle}>Popular in {getGenreName(slug as string)}</Text>

      <View style={styles.moviesGrid}>
        {movies.map((movie) => (
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
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.rating}>{formatRating(movie.vote_average)}</Text>
              </View>
              <Text style={styles.releaseDate}>
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {movies.length > 0 && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreMovies}>
          <Text style={styles.loadMoreText}>Load More Movies</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  backText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  moviesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  movieCard: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    overflow: 'hidden',
  },
  moviePoster: {
    width: '100%',
    height: 240,
    backgroundColor: '#333',
  },
  movieInfo: {
    padding: 12,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    color: '#FFD700',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  releaseDate: {
    color: '#ccc',
    fontSize: 12,
  },
  loadMoreButton: {
    backgroundColor: '#7b2cbf',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
