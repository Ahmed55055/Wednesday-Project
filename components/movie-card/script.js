import Component from "../component.js";

class MovieCard extends Component {

    constructor() {
        super();
        this.scriptUrl = import.meta.url;
        this._movie = null;
    }

    set movie(data) {
        this._movie = data;
        if (this.isConnected) {
            this.renderData();
        }
    }

    get movie() {
        return this._movie;
    }

    connected() {
        this.renderData();
    }

    renderData() {
        const titleEl = this.querySelector('[data-ref="title"]');
        const ratingEl = this.querySelector('[data-ref="rating"]');
        const overviewEl = this.querySelector('[data-ref="overview"]');
        const posterEl = this.querySelector('[data-ref="poster"]');
        const favBtn = this.querySelector('[data-ref="fav-btn"]');
        const favIcon = this.querySelector('[data-ref="fav-icon"]');

        const movieData = this._movie;

        if (movieData) {
            const title = movieData.title ?? "Untitled";
            const voteAverage = movieData.vote_average;
            const rating = typeof voteAverage === "number" ? voteAverage.toFixed(1) : "N/A";
            const overview = movieData.overview ?? "";

            let posterSrc = "../../asset/not-fount.png";
            if (movieData.poster_path) {
                posterSrc = "https://image.tmdb.org/t/p/w500" + movieData.poster_path;
            }

            if (titleEl) titleEl.textContent = title;
            if (ratingEl) ratingEl.textContent = rating;
            if (overviewEl) overviewEl.textContent = overview;
            if (posterEl) {
                posterEl.src = posterSrc;
                posterEl.alt = title;
            }

            // Set up favorite button
            if (favBtn) {
                const movieId = movieData.id;
                if (movieId != null) {
                    // Check if already favorited
                    if (this.isFavorite(movieId)) {
                        favBtn.classList.add("active");
                        favIcon.className = "bi bi-heart-fill";
                    } else {
                        favBtn.classList.remove("active");
                        favIcon.className = "bi bi-heart";
                    }

                    favBtn.onclick = (e) => {
                        e.stopPropagation();
                        const nowActive = this.toggleFavorite(movieId);
                        favBtn.classList.toggle("active", nowActive);
                        favIcon.className = "bi " + (nowActive ? "bi-heart-fill" : "bi-heart");
                    };
                } else {
                    favBtn.style.display = "none";
                }
            }
        } else {
            if (titleEl) titleEl.textContent = "Untitled";
            if (ratingEl) ratingEl.textContent = "N/A";
            if (overviewEl) overviewEl.textContent = "";
            if (posterEl) {
                posterEl.src = "../../asset/not-fount.png";
                posterEl.alt = "Movie not found";
            }
            if (favBtn) favBtn.style.display = "none";
        }
    }

    // --- Favorites helpers (same pattern as home.js) ---
    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem("currentUser"));
        } catch {
            return null;
        }
    }

    isFavorite(movieId) {
        const user = this.getCurrentUser();
        if (!user || !user.favorites) return false;
        return user.favorites.some(function (id) { return id === movieId; });
    }

    toggleFavorite(movieId) {
        const user = this.getCurrentUser();
        if (!user) {
            alert("Please log in first to add to favorites");
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
}

customElements.define("movie-card", MovieCard);
