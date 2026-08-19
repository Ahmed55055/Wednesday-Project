// --- Interfaces based on TMDB Response ---
import {CONFIG} from '../config'
export interface Movie {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    title: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface TvShow {
    adult: boolean;
    backdrop_path: string | null;
    id: number;
    name: string; // For TV shows
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    first_air_date: string; // Standard TMDB field for TV shows
    vote_average: number;
    vote_count: number;
    media_type: string; // e.g., 'tv'
}

export interface TmdbPaginatedResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface SearchResult {
    id: number;
    title: string;
    poster_url: string | null;
    media_type: string;
    overview: string;
}

// --- Movie Service ---

export class MovieService {
    private readonly baseUrl = 'https://api.themoviedb.org/3';

    private getOptions(): RequestInit {
        const token = CONFIG.TMDB_READ_ACCESS_TOKEN || '';

        return {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        };
    }

    /**
     * Fetches top-rated movies from TMDB.
     * @param page Page number (default: 1)
     * @param language Language code (default: 'en-US')
     */
    public async getTopRated(page: number = 1, language: string = 'en-US'): Promise<TmdbPaginatedResponse<Movie>> {
        try {
            const response = await fetch(
                `${this.baseUrl}/movie/top_rated?language=${language}&page=${page}`,
                this.getOptions()
            );

            if (!response.ok) {
                throw new Error(`TMDB Request failed with status ${response.status}: ${response.statusText}`);
            }

            const data: TmdbPaginatedResponse<Movie> = await response.json();
            return data;
        } catch (error) {
            console.error('MovieService.getTopRated Error:', error);
            throw error;
        }
    }

    /**
     * Fetches trending movies (what is "hot" right now).
     * @param timeWindow Time frame for trending data ('day' or 'week'). Default: 'day'
     * @param language Language code (default: 'en-US')
     */
    public async getTrending(timeWindow: 'day' | 'week' = 'day', language: string = 'en-US'
    ): Promise<TmdbPaginatedResponse<Movie>> {
        try {
            const response = await fetch(
                `${this.baseUrl}/trending/movie/${timeWindow}?language=${language}`,
                this.getOptions()
            );

            if (!response.ok) {
                throw new Error(`TMDB Request failed with status ${response.status}: ${response.statusText}`);
            }

            const data: TmdbPaginatedResponse<Movie> = await response.json();
            return data;
        } catch (error) {
            console.error('MovieService.getTrending Error:', error);
            throw error;
        }
    }

    /**
     * Searches multi (movies, TV shows) and returns top 5 normalized results.
     * @param query Search query
     */
    public async searchMulti(query: string): Promise<SearchResult[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/search/multi?query=${encodeURIComponent(query)}`,
                this.getOptions()
            );

            if (!response.ok) {
                throw new Error(`TMDB Request failed with status ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.results) return [];

            return data.results
                .filter((item: any) => item.media_type !== 'person')
                .map((item: any): SearchResult => ({
                    id: item.id,
                    title: item.title || item.name || 'Untitled',
                    poster_url: item.poster_path ? 'https://image.tmdb.org/t/p/w500' + item.poster_path : null,
                    media_type: item.media_type || 'movie',
                    overview: item.overview
                }))
                .slice(0, 5);
        } catch (error) {
            console.error('MovieService.searchMulti Error:', error);
            return [];
        }
    }
}