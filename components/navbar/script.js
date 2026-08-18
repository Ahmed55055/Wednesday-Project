import Component from "../component.js";

class NavMovie extends Component {

    constructor() {
        super();

        this.scriptUrl = import.meta.url;
    }

    connected() {

        const currentPage = this.getAttribute("page") || "home";

        const links = this.querySelectorAll("[data-page]");


        links.forEach(link => {

            const page = link.getAttribute("data-page");
            
            if (page === currentPage) {
                
                link.classList.add("active-page");
            }

        });
    }
}

customElements.define("nav-movie", NavMovie);