import Component from '../component.js';

class MovieFooter extends Component {
    constructor() {
        super();
        this.scriptUrl = import.meta.url;
    }

    connected() {
        this.adjustPaths();
    }

    adjustPaths() {
        const isRoot =
            window.location.pathname === "/" ||
            window.location.pathname.endsWith("/index.html") ||
            !window.location.pathname.includes("/pages/");

        const homeUrl = isRoot ? "index.html" : "../index.html";
        const tvUrl = isRoot ? "pages/tv-shows.html" : "tv-shows.html";

        const topRatedLink = this.querySelector("#footer-link-top-rated");
        const upcomingLink = this.querySelector("#footer-link-upcoming");
        const tvPremiereLink = this.querySelector("#footer-link-tv");

        if (topRatedLink) topRatedLink.href = homeUrl;
        if (upcomingLink) upcomingLink.href = homeUrl;
        if (tvPremiereLink) tvPremiereLink.href = tvUrl;
    }
}

customElements.define('movie-footer', MovieFooter);
