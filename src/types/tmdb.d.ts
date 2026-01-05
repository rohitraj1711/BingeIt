declare module '../../src/api/tmdb' {
  export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path?: string;
    overview?: string;
    release_date?: string;
    vote_average: number;
  }

  export function getTrendingMovies(): Promise<Movie[]>;
  export function getPopularMovies(): Promise<Movie[]>;
  export function getTopRatedMovies(): Promise<Movie[]>;
  export function getMovieDetails(id: number): Promise<Movie>;
  export function discoverMoviesByGenre(genreId: number, page?: number): Promise<Movie[]>;
  export function formatRating(rating: number): string;
  export function getMoviePoster(path: string | null, size?: string): string;
}
