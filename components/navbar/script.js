import Component from "../component.js";

class NavMovie extends Component {

    constructor() {
        super();
        this.scriptUrl = import.meta.url;
    }

    /**
     * Called after template is loaded into the DOM.
     * Sets up auth, theme, search, and active page highlighting.
     */
    connected() {
        this.adjustPathsForRoot();
        this.highlightActivePage();
        this.setupAuth();
        this.setupThemeToggle();
        this.setupSearch();
    }

    /**
     * If the page is at the root (index.html), rewrite relative
     * paths so they point into the pages/ directory correctly.
     */
    adjustPathsForRoot() {
        const isRoot =
            window.location.pathname === "/" ||
            window.location.pathname.endsWith("/index.html");

        if (!isRoot) {
            // Paths are already correct for pages/ directory.
            return;
        }

        const links = this.querySelectorAll("a[href]");
        links.forEach(link => {
            const href = link.getAttribute("href");

            if (href === "../index.html") {
                link.setAttribute("href", "index.html");
            } else if (href && href.endsWith(".html") && !href.startsWith("http")) {
                // e.g. movies.html -> pages/movies.html
                link.setAttribute("href", "pages/" + href);
            }
        });

        // Fix the logo image source too
        const logo = this.querySelector("#nav-logo");
        if (logo) {
            const src = logo.getAttribute("src");
            if (src && src.startsWith("../")) {
                logo.setAttribute("src", src.replace("../", ""));
            }
        }
    }

    /**
     * Read the page attribute and mark the matching nav link
     * as active (red underline via CSS class).
     */
    highlightActivePage() {
        const currentPage = this.getAttribute("page") || "home";
        const links = this.querySelectorAll("[data-page]");

        links.forEach(link => {
            if (link.getAttribute("data-page") === currentPage) {
                link.classList.add("active-page");
            }
        });
    }

    /**
     * Check localStorage for a logged-in user.
     * Show a profile avatar if logged in, or a "Join Us" link if not.
     */
    setupAuth() {
        const authArea = this.querySelector("#auth-area");
        if (!authArea) return;

        const userJson = localStorage.getItem("currentUser");

        if (userJson) {
            try {

                authArea.innerHTML = `
                    <a href="../../pages/profile.html" class="profile-link" title="Go to profile">
                        <img
                            class="profile-avatar"
                            src="../../asset/profile.png"
                            alt="Profile"
                        />
                    </a>
                `;
            } catch {
                // Invalid JSON — treat as not logged in
                this.showJoinUs(authArea);
            }
        } else {
            this.showJoinUs(authArea);
        }
    }

    /**
     * Render the "Join Us" button inside the auth area.
     *
     * @param {HTMLElement} container - The #auth-area element
     */
    showJoinUs(container) {
        const isRoot =
            window.location.pathname === "/" ||
            window.location.pathname.endsWith("/index.html");

        const loginHref = isRoot ? "pages/login.html" : "login.html";

        container.innerHTML = `
            <a href="${loginHref}" class="btn btn-danger join-us-btn">
                Join Us
            </a>
        `;
    }

    /**
     * Read the saved theme from localStorage and apply it.
     * Wire up the toggle button to switch between light and dark.
     */
    setupThemeToggle() {
        const toggleBtn = this.querySelector("#theme-toggle");
        const icon = this.querySelector("#theme-icon");
        if (!toggleBtn || !icon) return;

        // Apply saved theme on load
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            document.documentElement.setAttribute("data-theme", savedTheme);
            this.updateThemeIcon(icon, savedTheme);
        }

        toggleBtn.addEventListener("click", () => {
            const current =
                document.documentElement.getAttribute("data-theme") || "dark";
            const next = current === "dark" ? "light" : "dark";

            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            this.updateThemeIcon(icon, next);
        });
    }

    /**
     * Swap the icon between sun and moon based on the active theme.
     *
     * @param {HTMLElement} iconEl - The <i> element inside the toggle button
     * @param {string} theme - "light" or "dark"
     */
    updateThemeIcon(iconEl, theme) {
        if (theme === "light") {
            iconEl.classList.remove("bi-sun-fill");
            iconEl.classList.add("bi-moon-fill");
        } else {
            iconEl.classList.remove("bi-moon-fill");
            iconEl.classList.add("bi-sun-fill");
        }
    }

    /**
     * Listen for Enter on the search input and navigate
     * to the movies page with a ?search= query parameter.
     */
    setupSearch() {
        const input = this.querySelector("#nav-search");
        if (!input) return;

        input.addEventListener("keydown", (e) => {
            if (e.key !== "Enter") return;

            const query = input.value.trim();
            if (!query) return;

            const isRoot =
                window.location.pathname === "/" ||
                window.location.pathname.endsWith("/index.html");

            const searchUrl = isRoot
                ? `pages/movies.html?search=${encodeURIComponent(query)}`
                : `movies.html?search=${encodeURIComponent(query)}`;

            window.location.href = searchUrl;
        });
    }
}

customElements.define("nav-movie", NavMovie);
