import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import YoutubePlayer from 'react-native-youtube-iframe';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const API_KEY = "da0907ccc71311c1b0909aed63292a33";
const { width } = Dimensions.get('window');

interface Genre {
  id: number;
  name: string;
}

interface Video {
  key: string;
  type: string;
  site: string;
}

interface Movie {
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genres: Genre[];
  videos: {
    results: Video[];
  };
  runtime: number;
  budget: number;
  revenue: number;
}

type Props = {
  route: {
    params: {
      id: string;
    };
  };
  navigation: any;
};

export default function MovieDetails({ route, navigation }: Props) {
  const { id } = route.params || { id: '1' };
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movie:', error);
        setLoading(false);
      });
  }, [id]);

  // Check if movie is already in favorites
  useEffect(() => {
    const user = auth().currentUser;
    if (user && id) {
      const checkFavoriteStatus = async () => {
        try {
          const doc = await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('favorites')
            .doc(String(id))
            .get();
          setIsFavorite(doc.exists);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      };
      checkFavoriteStatus();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7b2cbf" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Movie not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get YouTube Trailer
  const trailer = movie.videos?.results?.find((v: Video) =>
    v.type === "Trailer" && v.site === "YouTube"
  )?.key;

  const handleWatchTrailer = async () => {
    if (trailer) {
      setShowTrailerModal(true);

      // Add to History
      const user = auth().currentUser;
      if (user && movie) {
        try {
          await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('history')
            .doc(String(id))
            .set({
              id: id,
              title: movie.title,
              poster_path: movie.poster_path,
              watchedAt: firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
        } catch (error) {
          console.error("Error adding to history:", error);
        }
      }
    }
  };

  const closeTrailerModal = () => {
    setShowTrailerModal(false);
  };

  const handleToggleFavorite = async () => {
    const user = auth().currentUser;
    if (!user) {
      navigation.navigate('Login'); // Redirect to Login if not authenticated
      return;
    }

    setFavoriteLoading(true);
    const movieRef = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('favorites')
      .doc(String(id));

    try {
      if (isFavorite) {
        await movieRef.delete();
        setIsFavorite(false);
      } else {
        await movieRef.set({
          id: id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          addedAt: firestore.FieldValue.serverTimestamp(),
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatBudget = (budget: number) => {
    if (!budget) return 'N/A';
    return `$${(budget / 1000000).toFixed(0)}M`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Movie Backdrop/Poster */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`,
          }}
          style={styles.backdropImage}
          resizeMode="cover"
        />

        {/* Play Button Overlay */}
        {trailer && (
          <TouchableOpacity style={styles.playButtonOverlay} onPress={handleWatchTrailer}>
            <View style={styles.playButton}>
              <Ionicons name="play" size={40} color="#fff" />
            </View>
            <Text style={styles.playButtonText}>Watch Trailer</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.contentContainer}>
        {/* Title and Favorite Button */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            disabled={favoriteLoading}
            style={styles.headerFavoriteButton}
          >
            {favoriteLoading ? (
              <ActivityIndicator size="small" color="#e74c3c" />
            ) : (
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={28}
                color={isFavorite ? "#e74c3c" : "#fff"}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
          </View>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.releaseDate}>
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </Text>
          {movie.runtime && (
            <>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.runtime}>{formatRuntime(movie.runtime)}</Text>
            </>
          )}
        </View>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.genresContainer}>
            {movie.genres.map((genre: Genre) => (
              <View key={genre.id} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Overview */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>

        {/* Movie Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Movie Details</Text>

          {movie.budget > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Budget:</Text>
              <Text style={styles.detailValue}>{formatBudget(movie.budget)}</Text>
            </View>
          )}

          {movie.revenue > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Revenue:</Text>
              <Text style={styles.detailValue}>{formatBudget(movie.revenue)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* YouTube Trailer Modal */}
      <Modal
        visible={showTrailerModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeTrailerModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeTrailerModal}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>

            {trailer && (
              <YoutubePlayer
                height={250}
                play={showTrailerModal}
                videoId={trailer}
              />
            )}
          </View>
        </View>
      </Modal>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f23',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#7b2cbf',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerBackButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    width: '100%',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(123, 44, 191, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  headerFavoriteButton: {
    padding: 5,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  separator: {
    color: '#ccc',
    marginHorizontal: 10,
    fontSize: 16,
  },
  releaseDate: {
    color: '#ccc',
    fontSize: 16,
  },
  runtime: {
    color: '#ccc',
    fontSize: 16,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  genreTag: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#7b2cbf',
  },
  genreText: {
    color: '#7b2cbf',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  overview: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#ccc',
    fontSize: 16,
  },
  detailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.95,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(123, 44, 191, 0.8)',
    padding: 8,
    borderRadius: 20,
  },
});
