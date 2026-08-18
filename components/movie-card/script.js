import Component from "../component.js";

class MovieCard extends Component {

    constructor() {
        super();

        this.scriptUrl = import.meta.url;
    }

    connected() {
        this.renderData();
    }

    renderData() {

        const titleEl = this.querySelector('[data-ref="title"');
        const ratingEl = this.querySelector('[data-ref="rating"');
        const overviewEl = this.querySelector('[data-ref="overview"');
        const posterEl = this.querySelector('[data-ref="poster"');

        const title = this.getAttribute("title") || "Untitled";
        const poster = this.getAttribute("poster") || "../../asset/not-fount.png";
        const rating = this.getAttribute("rating") || "N/A";
        const overview = this.getAttribute("overview") || "No description available.";

        if (posterEl) {
            console.log("Entered Poster")
            posterEl.src = poster;
            posterEl.alt = title;
        }
        if (titleEl) titleEl.textContent = title;
        if (ratingEl) ratingEl.textContent = rating;
        if (overviewEl) overviewEl.textContent = overview;
    }

}


customElements.define("movie-card", MovieCard);