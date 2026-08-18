// --- Interfaces based on TMDB Response ---

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
    softcore: boolean;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface TmdbPaginatedResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

// --- Movie Service ---

export class MovieService {
    private readonly baseUrl = 'https://api.themoviedb.org/3';

    private getOptions(): RequestInit {
        const token = process.env.TMDB_READ_ACCESS_TOKEN || '';

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
}