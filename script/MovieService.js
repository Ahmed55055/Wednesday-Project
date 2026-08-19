// --- Interfaces based on TMDB Response ---
import { CONFIG } from '../config.js';

export const TV_GENRE_MAP = {
    10759: 'Action & Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    10762: 'Kids',
    9648: 'Mystery',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics',
};

export const MOVIE_GENRE_MAP = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    27: 'Horror',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
};

// --- Movie Service ---
export class MovieService {
    baseUrl = 'https://api.themoviedb.org/3';
    getOptions() {
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
    async getTopRated(page = 1, language = 'en-US') {
        try {
            const response = await fetch(`${this.baseUrl}/movie/top_rated?language=${language}&page=${page}`, this.getOptions());
            if (!response.ok) {
                throw new Error(`TMDB Request failed with status ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error('MovieService.getTopRated Error:', error);
            throw error;
        }
    }
    /**
     * Fetches trending movies (what is "hot" right now).
     * @param timeWindow Time frame for trending data ('day' or 'week'). Default: 'day'
     * @param language Language code (default: 'en-US')
     */
    async getTrending(timeWindow = 'day', language = 'en-US') {
        try {
            const response = await fetch(`${this.baseUrl}/trending/movie/${timeWindow}?language=${language}`, this.getOptions());
            if (!response.ok) {
                throw new Error(`TMDB Request failed with status ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error('MovieService.getTrending Error:', error);
            throw error;
        }
    }

    /**
     * Fetches trending TV shows.
     */
    async getTvTrending() {
        try {
            const response = await fetch(`${this.baseUrl}/trending/tv/week`, this.getOptions());
            if (!response.ok) {
                throw new Error(`TMDB Request failed with status ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('MovieService.getTvTrending Error:', error);
            throw error;
        }
    }

    /**
     * Fetches TV shows by genre.
     * @param genreId Genre ID
     */
    async getTvByGenre(genreId) {
        try {
            const response = await fetch(`${this.baseUrl}/discover/tv?with_genres=${genreId}&sort_by=popularity.desc`, this.getOptions());
            if (!response.ok) {
                throw new Error(`TMDB Request failed with status ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('MovieService.getTvByGenre Error:', error);
            throw error;
        }
    }

    /**
     * Fetches top-rated TV shows.
     */
    async getTvTopRated() {
        try {
            const response = await fetch(`${this.baseUrl}/tv/top_rated`, this.getOptions());
            if (!response.ok) {
                throw new Error(`TMDB Request failed with status ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('MovieService.getTvTopRated Error:', error);
            throw error;
        }
    }

    /**
     * Fetches movies by genre.
     * @param genreId Genre ID from TMDB
     * @param page Page number (default: 1)
     * @param language Language code (default: 'en-US')
     */
    async getByGenre(genreId, page = 1, language = 'en-US') {
        try {
            const response = await fetch(`${this.baseUrl}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&language=${language}&page=${page}`, this.getOptions());
            if (!response.ok) {
                throw new Error(`TMDB Request failed with status ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error('MovieService.getByGenre Error:', error);
            throw error;
        }
    }

    /**
     * Searches for movies.
     * @param query Search query
     */
    async searchMovies(query) {
        try {
            const response = await fetch(`${this.baseUrl}/search/movie?query=${encodeURIComponent(query)}`, this.getOptions());
            if (!response.ok) {
                throw new Error(`TMDB Request failed with status ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('MovieService.searchMovies Error:', error);
            throw error;
        }
    }

    /**
     * Searches for TV shows.
     * @param query Search query
     */
    async searchTv(query) {
        try {
            const response = await fetch(`${this.baseUrl}/search/tv?query=${encodeURIComponent(query)}`, this.getOptions());
            if (!response.ok) {
                throw new Error(`TMDB Request failed with status ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('MovieService.searchTv Error:', error);
            throw error;
        }
    }

    /**
     * Fetches movie details by ID.
     * @param id Movie ID
     */
    async getMovieById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/movie/${id}`, this.getOptions());
            if (!response.ok) {
                throw new Error(`TMDB Request failed with status ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('MovieService.getMovieById Error:', error);
            throw error;
        }
    }
}
