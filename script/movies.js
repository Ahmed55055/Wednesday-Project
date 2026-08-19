import { MovieService, MOVIE_GENRE_MAP } from './MovieService.js';

const grid = document.querySelector('movie-grid');
const pillsContainer = document.querySelector('.explore-movies-section .d-flex.flex-wrap.gap-2');
const sortSelect = document.querySelector('.sort-select');
const headerText = document.querySelector('.explore-movies-section h1') || document.querySelector('.page-header-text');
const movieService = new MovieService();

// Clear existing placeholder pills
pillsContainer.innerHTML = '';

// Build genre pills from MOVIE_GENRE_MAP
const allBtn = document.createElement('button');
allBtn.type = 'button';
allBtn.className = 'btn btn-genre btn-red-active rounded-pill px-3 py-2';
allBtn.dataset.genre = 'all';
allBtn.textContent = 'All Genres';
pillsContainer.appendChild(allBtn);

Object.entries(MOVIE_GENRE_MAP).forEach(([id, name]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-genre rounded-pill px-3 py-2';
    btn.dataset.genre = id;
    btn.textContent = name;
    pillsContainer.appendChild(btn);
});

// Active pill highlight
function setActivePill(activeBtn) {
    pillsContainer.querySelectorAll('.btn-genre').forEach(b => {
        b.classList.remove('btn-red-active', 'active');
    });
    activeBtn.classList.add('btn-red-active', 'active');
}

// Sort results client-side
function sortResults(results, sortBy) {
    const sorted = [...results];
    switch (sortBy) {
        case '1': // Rating
            sorted.sort((a, b) => b.vote_average - a.vote_average);
            break;
        case '2': // Release Date
            sorted.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
            break;
        case '3': // Title
            sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
            break;
        default: // Popularity (default API order)
            break;
    }
    return sorted;
}

let currentResults = [];

// Load movies by genre
async function loadByGenre(genreId, sortBy) {
    try {
        let data;
        if (genreId === 'all') {
            data = await movieService.getTrending();
        } else {
            data = await movieService.getByGenre(genreId);
        }
        currentResults = data.results || [];
        const sorted = sortResults(currentResults, sortBy);
        grid.movies = sorted;
    } catch (err) {
        console.error('Failed to load movies:', err);
    }
}

// Search movies
async function searchMovies(query, sortBy) {
    try {
        const data = await movieService.searchMovies(query);
        currentResults = data.results || [];
        if (headerText) headerText.textContent = `Search: "${query}"`;
        const sorted = sortResults(currentResults, sortBy);
        grid.movies = sorted;
    } catch (err) {
        console.error('Search failed:', err);
    }
}

// Determine initial load mode
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search');

if (searchQuery) {
    searchMovies(searchQuery, sortSelect?.value);
} else {
    loadByGenre('all', sortSelect?.value);
}

// Genre pill clicks
pillsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-genre');
    if (!btn) return;
    setActivePill(btn);
    
    const genre = btn.dataset.genre;
    if (searchQuery) {
        // When searching, clicking a pill clears search and loads by genre
        window.history.replaceState({}, '', window.location.pathname);
    }
    loadByGenre(genre, sortSelect?.value);
});

// Sort change
sortSelect?.addEventListener('change', () => {
    const activePill = pillsContainer.querySelector('.btn-red-active') || pillsContainer.querySelector('.btn-genre');
    const genre = activePill?.dataset.genre || 'all';
    
    const sorted = sortResults(currentResults, sortSelect.value);
    grid.movies = sorted;
});
