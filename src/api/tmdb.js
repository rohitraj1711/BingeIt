// TMDB API Configuration
const TMDB_API_KEY = 'da0907ccc71311c1b0909aed63292a33';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// API Endpoints
const ENDPOINTS = {
  trending: '/trending/movie/day',
  popular: '/movie/popular',
  topRated: '/movie/top_rated',
  nowPlaying: '/movie/now_playing',
  upcoming: '/movie/upcoming',
  search: '/search/movie',
  movieDetails: (id) => `/movie/${id}`,
  movieCredits: (id) => `/movie/${id}/credits`,
  movieVideos: (id) => `/movie/${id}/videos`,
  tvPopular: '/tv/popular',
  tvTopRated: '/tv/top_rated',
  tvOnAir: '/tv/on_the_air',
  searchTV: '/search/tv',
};

// Generic API request function
const makeRequest = async (endpoint, params = {}) => {
  try {
    let url = `${TMDB_BASE_URL}${endpoint}`;

    // Construct query parameters manually
    const queryParams = [`api_key=${TMDB_API_KEY}`];
    Object.keys(params).forEach(key => {
      queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
    });

    url += `?${queryParams.join('&')}`;

    console.log(`[TMDB] Fetching: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[TMDB] Error Response: ${errorBody}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('TMDB API Error:', error);
    throw error;
  }
};

// Movie API Functions
export const getTrendingMovies = async (page = 1) => {
  try {
    const data = await makeRequest(ENDPOINTS.trending, { page });
    return data.results || [];
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

export const getPopularMovies = async (page = 1) => {
  try {
    const data = await makeRequest(ENDPOINTS.popular, { page });
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

export const getTopRatedMovies = async (page = 1) => {
  try {
    const data = await makeRequest(ENDPOINTS.topRated, { page });
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
};

export const getNowPlayingMovies = async (page = 1) => {
  try {
    const data = await makeRequest(ENDPOINTS.nowPlaying, { page });
    return data.results || [];
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    return [];
  }
};

export const getUpcomingMovies = async (page = 1) => {
  try {
    const data = await makeRequest(ENDPOINTS.upcoming, { page });
    return data.results || [];
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return [];
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const data = await makeRequest(ENDPOINTS.search, { query, page });
    return data.results || [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const data = await makeRequest(ENDPOINTS.movieDetails(movieId));
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

// Discover movies by genre
export const discoverMoviesByGenre = async (genreId, page = 1) => {
  try {
    const data = await makeRequest('/discover/movie', {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc'
    });
    return data.results || [];
  } catch (error) {
    console.error('Error discovering movies by genre:', error);
    return [];
  }
};

export const getMovieCredits = async (movieId) => {
  try {
    const data = await makeRequest(ENDPOINTS.movieCredits(movieId));
    return data;
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    return null;
  }
};

export const getMovieVideos = async (movieId) => {
  try {
    const data = await makeRequest(ENDPOINTS.movieVideos(movieId));
    return data.results || [];
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    return [];
  }
};

// TV Shows API Functions
export const getPopularTVShows = async (page = 1) => {
  try {
    const data = await makeRequest(ENDPOINTS.tvPopular, { page });
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    return [];
  }
};

export const getTopRatedTVShows = async (page = 1) => {
  try {
    const data = await makeRequest(ENDPOINTS.tvTopRated, { page });
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated TV shows:', error);
    return [];
  }
};

export const getOnAirTVShows = async (page = 1) => {
  try {
    const data = await makeRequest(ENDPOINTS.tvOnAir, { page });
    return data.results || [];
  } catch (error) {
    console.error('Error fetching on air TV shows:', error);
    return [];
  }
};

export const searchTVShows = async (query, page = 1) => {
  try {
    const data = await makeRequest(ENDPOINTS.searchTV, { query, page });
    return data.results || [];
  } catch (error) {
    console.error('Error searching TV shows:', error);
    return [];
  }
};

// Image URL Helpers
export const getMoviePoster = (posterPath, size = 'w500') => {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
};

export const getMovieBackdrop = (backdropPath, size = 'w1280') => {
  if (!backdropPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
};

export const getProfileImage = (profilePath, size = 'w185') => {
  if (!profilePath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${profilePath}`;
};

// Utility Functions
export const formatReleaseDate = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.getFullYear();
};

export const formatRuntime = (minutes) => {
  if (!minutes) return 'Unknown';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatRating = (rating) => {
  if (!rating) return 'N/A';
  return rating.toFixed(1);
};

// Genre mapping (you can extend this)
export const getGenreNames = (genreIds) => {
  const genreMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };

  return genreIds?.map(id => genreMap[id]).filter(Boolean).join(', ') || 'Unknown';
};

export default {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getPopularTVShows,
  getTopRatedTVShows,
  getOnAirTVShows,
  searchTVShows,
  getMoviePoster,
  getMovieBackdrop,
  getProfileImage,
  formatReleaseDate,
  formatRuntime,
  formatRating,
  getGenreNames
};