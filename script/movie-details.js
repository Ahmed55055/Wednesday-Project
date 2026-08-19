import { MovieService } from './MovieService.js';

const movieService = new MovieService();
const loadingEl = document.getElementById('loading');
const detailsEl = document.getElementById('details');

const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

if (!movieId) {
    loadingEl.textContent = 'No movie specified.';
} else {
    loadMovie(movieId);
}

async function loadMovie(id) {
    try {
        const movie = await movieService.getMovieById(id);
        document.title = `CineMax - ${movie.title}`;
        render(movie);
        loadingEl.style.display = 'none';
        detailsEl.style.display = 'block';
    } catch (err) {
        loadingEl.textContent = 'Failed to load movie details.';
        console.error(err);
    }
}

function render(movie) {
    const backdrop = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : '';
    const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '../asset/not-fount.png';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const year = movie.release_date ? movie.release_date.split('-')[0] : '';
    const genres = (movie.genres || []).map(g => `<span class="genre-badge">${g.name}</span>`).join('');
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';

    detailsEl.innerHTML = `
        <div class="details-hero" style="background-image: url('${backdrop}')">
            <div class="details-overlay"></div>
            <div class="container details-content">
                <a href="javascript:history.back()" class="back-btn mb-3 d-inline-flex align-items-center gap-1">
                    <i class="bi bi-arrow-left"></i> Back
                </a>
                <div class="d-flex gap-4 flex-wrap align-items-end">
                    <img src="${poster}" alt="${movie.title}" class="details-poster">
                    <div class="flex-grow-1">
                        <h1 class="fw-bold mb-2" style="color: var(--text-primary);">${movie.title}</h1>
                        <div class="d-flex align-items-center gap-3 mb-3 details-meta">
                            <span><i class="bi bi-star-fill text-warning"></i> ${rating}</span>
                            ${year ? `<span>${year}</span>` : ''}
                            ${runtime ? `<span>${runtime}</span>` : ''}
                        </div>
                        <div class="mb-3">${genres}</div>
                        <p style="color: var(--text-secondary); max-width: 700px; line-height: 1.6;">
                            ${movie.overview || 'No description available.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
