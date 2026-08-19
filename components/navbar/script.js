import Component from "../component.js";
import { MovieService } from "../../script/MovieService.js";

class NavMovie extends Component {

    constructor() {
        super();
        this.scriptUrl = import.meta.url;
        this.movieService = new MovieService();
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
                const isRoot =
                    window.location.pathname === "/" ||
                    window.location.pathname.endsWith("/index.html");

                const avatarSrc = isRoot ? "asset/profile.png" : "../asset/profile.png";
                const profileHref = isRoot ? "pages/profile.html" : "profile.html";

                authArea.innerHTML = `
                    <a href="${profileHref}" class="profile-link" title="Go to profile">
                        <img
                            class="profile-avatar"
                            src="${avatarSrc}"
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
     * Listen for input on the search field to display a live search dropdown,
     * and listen for Enter to navigate to the movies page with a ?search= query parameter.
     */
    setupSearch() {
        const input = this.querySelector("#nav-search");
        if (!input) return;

        const searchBox = this.querySelector(".search-box");
        if (!searchBox) return;

        let dropdown = this.querySelector(".search-dropdown-results");
        if (!dropdown) {
            dropdown = document.createElement("div");
            dropdown.className = "search-dropdown-results";
            dropdown.style.display = "none";
            searchBox.appendChild(dropdown);
        }

        const isRoot =
            window.location.pathname === "/" ||
            window.location.pathname.endsWith("/index.html");

        let debounceTimer = null;

        input.addEventListener("input", () => {
            clearTimeout(debounceTimer);
            const query = input.value.trim();

            if (query.length < 2) {
                dropdown.style.display = "none";
                dropdown.innerHTML = "";
                return;
            }

            debounceTimer = setTimeout(async () => {
                try {
                    const results = await this.movieService.searchMulti(query);
                    this.renderSearchDropdown(results, dropdown, isRoot);
                } catch (err) {
                    console.error("Search error:", err);
                }
            }, 350);
        });

        input.addEventListener("focus", () => {
            if (dropdown.children.length > 0 && input.value.trim().length >= 2) {
                dropdown.style.display = "block";
            }
        });

        input.addEventListener("blur", () => {
            setTimeout(() => {
                dropdown.style.display = "none";
            }, 200);
        });

        document.addEventListener("click", (e) => {
            if (!this.contains(e.target)) {
                dropdown.style.display = "none";
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key !== "Enter") return;

            const query = input.value.trim();
            if (!query) return;

            dropdown.style.display = "none";

            const searchUrl = isRoot
                ? `pages/movies.html?search=${encodeURIComponent(query)}`
                : `movies.html?search=${encodeURIComponent(query)}`;

            window.location.href = searchUrl;
        });
    }

    /**
     * Renders search results inside the dropdown container.
     */
    renderSearchDropdown(results, dropdown, isRoot) {
        if (!results || results.length === 0) {
            dropdown.innerHTML = `<div class="search-dropdown-empty">No results found</div>`;
            dropdown.style.display = "block";
            return;
        }

        const fallbackPoster = isRoot ? "asset/not-fount.png" : "../asset/not-fount.png";
        const topResults = results.slice(0, 5);

        dropdown.innerHTML = topResults.map(item => {
            const badgeLabel = item.media_type === "tv" ? "TV Show" : "Movie";
            const detailPath = isRoot
                ? `pages/movie-details.html?id=${item.id}`
                : `movie-details.html?id=${item.id}`;

            const posterHtml = item.poster_url
                ? `<img src="${item.poster_url}" alt="${item.title}" class="search-item-poster" onerror="this.src='${fallbackPoster}'" />`
                : `<div class="search-item-placeholder"><i class="bi bi-film"></i></div>`;

            return `
                <div class="search-dropdown-item" data-href="${detailPath}">
                    ${posterHtml}
                    <div class="search-item-info">
                        <div class="search-item-title">${item.title}</div>
                        <span class="search-item-badge">${badgeLabel}</span>
                    </div>
                </div>
            `;
        }).join("");

        dropdown.style.display = "block";

        const items = dropdown.querySelectorAll(".search-dropdown-item");
        items.forEach(item => {
            item.addEventListener("mousedown", (e) => {
                e.preventDefault();
                const href = item.getAttribute("data-href");
                if (href) {
                    window.location.href = href;
                }
            });
        });
    }
}

customElements.define("nav-movie", NavMovie);
