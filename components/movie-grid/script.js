// import Component from "../component.js";

// class MovieGrid extends Component {
//     constructor() {
//         super();
//         this.scriptUrl = import.meta.url;
//         this._movies = null;
//     }

//     /**
//      * Accepts either the full TmdbPaginatedResponse object OR a plain array of movies
//      */
//     set movies(data) {
//         this._movies = data;
//         if (this.isConnected) {
//             this.renderGrid();
//         }
//     }

//     get movies() {
//         return this._movies;
//     }

//     connected() {
//         const count = Number(this.getAttribute("movie-count") || "12");
//         const movieList = this.getAttribute("movie-list");

//         const grid = document.getElementById("movie-grid");

//         for (let i = 0; i < count; i++) {
//             try {
//                 const card = document.createElement("movie-card");
//                 grid.appendChild(card);
//             } catch (e) {
//                 console.log(e);
//             }
//         }
//     }
    
// }

// customElements.define("movie-grid", MovieGrid);


import Component from "../component.js";

class MovieGrid extends Component {
    constructor() {
        super();
        this.scriptUrl = import.meta.url;
        this._movies = [];
    }

    /**
     * Property setter accepting an array of Movie objects directly
     */
    set movies(data) {
        this._movies = Array.isArray(data) ? data : [];
        if (this.isConnected) {
            this.renderGrid();
        }
    }

    get movies() {
        return this._movies;
    }

    connected() {
        // Fallback: parse JSON array from 'movie-list' attribute if set via HTML
        if (this._movies.length === 0 && this.hasAttribute("movie-list")) {
            const attr = this.getAttribute("movie-list");
            if (attr) {
                try {
                    const parsed = JSON.parse(attr);
                    if (Array.isArray(parsed)) {
                        this._movies = parsed;
                    }
                } catch (e) {
                    console.error("Invalid JSON array in movie-list attribute:", e);
                }
            }
        }

        this.renderGrid();
    }

    renderGrid() {
        // Guard clause: exit safely if there are no movies
        if (!Array.isArray(this._movies) || this._movies.length === 0) {
            return;
        }

        // Target the grid container inside this component or default to 'this'
        const grid = this.querySelector("#movie-grid") || this;
        grid.innerHTML = "";

        // Respect 'movie-count' attribute limit if set
        const countAttr = this.getAttribute("movie-count");
        const limit = countAttr ? Number(countAttr) : this._movies.length;

        // Slice up to the specified limit and append cards
        this._movies.slice(0, limit).forEach((movie) => {
            try {
                const card = document.createElement("movie-card");
                
                // Pass single movie object directly to each card
                card.movie = movie;
                
                grid.appendChild(card);
            } catch (e) {
                console.error("Error creating movie-card:", e);
            }
        });
    }
}

customElements.define("movie-grid", MovieGrid);