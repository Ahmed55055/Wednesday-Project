const TMDB_API_KEY = "61a3276b3fdfcc7f083e35e2e16e7a05";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";
const POSTER_SIZE = "w500";
const BACKDROP_SIZE = "original";

let genreMap = {};

const heroContent = document.getElementById("heroContent");
const heroSection = document.getElementById("hero");
const trendingRow = document.getElementById("trendingRow");
const topRatedRow = document.getElementById("topRatedRow");

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function isFavorite(movieId) {
    const user = getCurrentUser();
    if (!user || !user.favorites) return false;
    return user.favorites.some(function (id) {
        return id === movieId;
    });
}

function toggleFavorite(movieId) {
    const user = getCurrentUser();
    if (!user) {
        alert("Please log in first to add the movie to your favorites");
        return false;
    }

    let users = JSON.parse(localStorage.getItem("cineMaxUsers")) || [];
    const index = users.findIndex(function (u) {
        return u.email.toLowerCase() === user.email.toLowerCase();
    });

    if (!user.favorites) user.favorites = [];

    const existingIndex = user.favorites.indexOf(movieId);
    let nowActive;

    if (existingIndex === -1) {
        user.favorites.push(movieId);
        nowActive = true;
    } else {
        user.favorites.splice(existingIndex, 1);
        nowActive = false;
    }

    if (index !== -1) users[index] = user;
    localStorage.setItem("cineMaxUsers", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    return nowActive;
}

function getGenreNames(genreIds) {
    if (!genreIds || genreIds.length === 0) return "";
    return genreIds
        .slice(0, 2)
        .map(function (id) {
            return genreMap[id] || "";
        })
        .filter(Boolean)
        .join(" / ");
}

function getYear(dateStr) {
    return dateStr ? dateStr.split("-")[0] : "—";
}

function formatRuntime(minutes) {
    if (!minutes) return "";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h + "h " + m + "m";
}

function posterUrl(path) {
    return path  ? IMAGE_BASE + "/" + POSTER_SIZE + path   :  "https://placehold.co/500x750/17171a/a0a0a5?text=No+Poster";
}

function backdropUrl(path) {
    return path ? IMAGE_BASE + "/" + BACKDROP_SIZE + path : "";
}

async function fetchGenres() {
    const res = await fetch(BASE_URL + "/genre/movie/list?api_key=" + TMDB_API_KEY + "&language=en-US");
    if (!res.ok) throw new Error("Failed to load genres");
    const data = await res.json();
    data.genres.forEach(function (g) {
        genreMap[g.id] = g.name;
    });
}

async function fetchTrending() {
    const res = await fetch(BASE_URL + "/trending/movie/week?api_key=" + TMDB_API_KEY);
    if (!res.ok) throw new Error("Failed to load trending movies");
    const data = await res.json();
    return data.results;
}

async function fetchTopRated() {
    const res = await fetch(BASE_URL + "/movie/top_rated?api_key=" + TMDB_API_KEY + "&language=en-US&page=1");
    if (!res.ok) throw new Error("Failed to load top rated movies");
    const data = await res.json();
    return data.results;
}

async function fetchMovieRuntime(movieId) {
    try {
        const res = await fetch(BASE_URL + "/movie/" + movieId + "?api_key=" + TMDB_API_KEY + "&language=en-US");
        if (!res.ok) return null;
        const data = await res.json();
        return data.runtime;
    } catch (err) {
        return null;
    }
}

async function renderHero(movie) {
    heroSection.style.backgroundImage = "url('" + backdropUrl(movie.backdrop_path) + "')";

    const runtime = await fetchMovieRuntime(movie.id);
    const genreText = getGenreNames(movie.genre_ids);
    const favActive = isFavorite(movie.id);

    heroContent.innerHTML =
        '<div class="hero-badge"><i class="bi bi-fire"></i> Featured Trending Movie</div>' +
        '<h1 class="hero-title">' + escapeHtml(movie.title) + '</h1>' +
        '<div class="hero-meta">' +
            '<span class="rating"><i class="bi bi-star-fill"></i> ' + movie.vote_average.toFixed(1) + '</span>' +
            '<span>' + getYear(movie.release_date) + '</span>' +
            (runtime ? '<span class="dot">•</span><span>' + formatRuntime(runtime) + '</span>' : '') +
            (genreText ? '<span class="dot">•</span><span>' + escapeHtml(genreText) + '</span>' : '') +
        '</div>' +
        '<p class="hero-overview">' + escapeHtml(truncate(movie.overview, 220)) + '</p>' +
        '<div class="hero-actions">' +
            '<button type="button" class="btn-hero-primary"><i class="bi bi-play-fill"></i> Watch Trailer</button>' +
            '<button type="button" id="heroFavoriteBtn" class="btn-hero-secondary' + (favActive ? ' active' : '') + '">' +
                '<i class="bi ' + (favActive ? 'bi-heart-fill' : 'bi-heart') + '"></i> ' +
                (favActive ? 'In Favorites' : 'Add to Favorites') +
            '</button>' +
        '</div>';

    document.getElementById("heroFavoriteBtn").addEventListener("click", function () {
        const nowActive = toggleFavorite(movie.id);
        this.classList.toggle("active", nowActive);
        this.innerHTML =
            '<i class="bi ' + (nowActive ? 'bi-heart-fill' : 'bi-heart') + '"></i> ' +
            (nowActive ? 'In Favorites' : 'Add to Favorites');
    });
}

function createMovieCard(movie) {
    const col = document.createElement("div");
    col.className = "col-6 col-sm-4 col-md-3 col-lg-3";

    const card = document.createElement("div");
    card.className = "movie-card";

    const favActive = isFavorite(movie.id);
    const genreText = getGenreNames(movie.genre_ids);

    card.innerHTML =
        '<div class="movie-poster-wrapper">' +
            '<img src="' + posterUrl(movie.poster_path) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
            '<span class="movie-rating-badge"><i class="bi bi-star-fill"></i> ' + movie.vote_average.toFixed(1) + '</span>' +
            '<button type="button" class="movie-favorite-btn' + (favActive ? ' active' : '') + '" aria-label="Add to favorites">' +
                '<i class="bi ' + (favActive ? 'bi-heart-fill' : 'bi-heart') + '"></i>' +
            '</button>' +
        '</div>' +
        '<div class="movie-info">' +
            '<p class="movie-title">' + escapeHtml(movie.title) + '</p>' +
            '<div class="movie-sub">' +
                '<span>' + getYear(movie.release_date) + '</span>' +
                '<span class="dot">•</span>' +
                '<span class="type-tag">Movie</span>' +
                (genreText ? '<span class="dot">•</span><span>' + escapeHtml(genreText) + '</span>' : '') +
            '</div>' +
        '</div>';

    const favBtn = card.querySelector(".movie-favorite-btn");
    favBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const nowActive = toggleFavorite(movie.id);
        favBtn.classList.toggle("active", nowActive);
        favBtn.querySelector("i").className = "bi " + (nowActive ? "bi-heart-fill" : "bi-heart");
    });

    col.appendChild(card);
    return col;
}

function renderRow(container, movies) {
    container.innerHTML = "";
    const row = document.createElement("div");
    row.className = "row g-3";
    movies.forEach(function (movie) {
        row.appendChild(createMovieCard(movie));
    });
    container.appendChild(row);
}

function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function truncate(str, maxLength) {
    if (!str) return "";
    return str.length > maxLength ? str.slice(0, maxLength).trim() + "…" : str;
}

function showError(container, message) {
    container.innerHTML = '<p class="error-msg">' + escapeHtml(message) + '</p>';
}

async function init() {
    try {
        await fetchGenres();

        const [trending, topRated] = await Promise.all([fetchTrending(), fetchTopRated()]);

        if (trending.length > 0) {
            await renderHero(trending[0]);
            renderRow(trendingRow, trending.slice(1, 9));
        } else {
            showError(trendingRow, "There are no trending movies at the moment");
        }

        renderRow(topRatedRow, topRated.slice(0, 8));

    } catch (err) {
        showError(heroContent, "An error occurred while loading data from TMDB");
        showError(trendingRow, "Failed to load trending movies");
        showError(topRatedRow, "Failed to load top-rated movies");
    }
}

init();


const navProfileImage = document.getElementById("navProfileImage");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser && currentUser.profileImage) {
    navProfileImage.src = currentUser.profileImage;
}
