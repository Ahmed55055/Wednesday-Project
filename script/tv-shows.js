import { MovieService } from './MovieService.js';

const grid = document.querySelector('movie-grid');
const sortSelect = document.querySelector('.sort-select');
const movieService = new MovieService();

let currentResults = [];

async function loadTvShows() {
    try {
        const data = await movieService.getTvTrending();
        currentResults = data.results || [];
        grid.movies = currentResults;
    } catch (err) {
        console.error('Failed to load TV shows:', err);
    }
}

// Genre pill clicks (placeholder — just toggle active class, no filtering)
document.querySelector('.explore-movies-section .d-flex.flex-wrap.gap-2')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-genre');
    if (!btn) return;
    btn.closest('.d-flex.flex-wrap.gap-2').querySelectorAll('.btn-genre').forEach(b => {
        b.classList.remove('btn-red-active', 'active');
    });
    btn.classList.add('btn-red-active', 'active');
    // Placeholder: genre pills don't actually filter
});

// Sort change
sortSelect?.addEventListener('change', () => {
    const sorted = [...currentResults];
    const val = sortSelect.value;
    if (val === 'rating') {
        sorted.sort((a, b) => b.vote_average - a.vote_average);
    } else if (val === 'name') {
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    grid.movies = sorted;
});

loadTvShows();
