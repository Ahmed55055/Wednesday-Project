import { MovieService } from './MovieService.js';

const grid = document.getElementById('favorites-grid');
const countEl = document.getElementById('favorites-count');
const noFavoritesEl = document.getElementById('no-favorites');
const movieService = new MovieService();

async function loadFavorites() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        countEl.textContent = 'Please log in to see your favorites.';
        grid.style.display = 'none';
        noFavoritesEl.style.display = 'none';
        return;
    }
    
    const favorites = currentUser.favorites || [];
    
    if (favorites.length === 0) {
        grid.style.display = 'none';
        noFavoritesEl.style.display = 'block';
        countEl.textContent = '';
        return;
    }
    
    countEl.textContent = `${favorites.length} item${favorites.length > 1 ? 's' : ''} in your favorites`;
    
    // Fetch each favorite movie's details
    const promises = favorites.map(id => movieService.getMovieById(id).catch(() => null));
    const movies = (await Promise.all(promises)).filter(Boolean);
    
    if (movies.length === 0) {
        grid.style.display = 'none';
        noFavoritesEl.style.display = 'block';
        countEl.textContent = 'Could not load favorites.';
        return;
    }
    
    grid.movies = movies;
}

loadFavorites();
