import { MovieService } from '../../script/MovieService.js';

export class SearchComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.movieService = new MovieService(); // Initialize MovieService
    }

    /**
     * Simple debounce utility function.
     * @param {Function} func The function to debounce.
     * @param {number} delay The debounce delay in milliseconds.
     * @returns {Function} The debounced function.
     */
    _debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        // Basic HTML for input and results dropdown
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                .search-container {
                    position: relative;
                    width: 100%;
                }
                .search-input {
                    width: 100%;
                    padding: 10px;
                    box-sizing: border-box;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                .results-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background-color: white;
                    border: 1px solid #ccc;
                    border-top: none;
                    border-radius: 0 0 4px 4px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    max-height: 300px;
                    overflow-y: auto;
                    z-index: 1000;
                    display: none; /* Hidden by default */
                }
                .results-dropdown.visible {
                    display: block;
                }
                .result-item {
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .result-item:hover {
                    background-color: #f0f0f0;
                }
                .result-item img {
                    width: 50px; /* Small poster size */
                    height: auto;
                    object-fit: cover;
                    border-radius: 2px;
                }
                .result-title {
                    font-weight: bold;
                }
                .result-overview {
                    font-size: 0.9em;
                    color: #555;
                    display: -webkit-box;
                    -webkit-line-clamp: 2; /* Limit to 2 lines */
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .no-results {
                    padding: 10px;
                    color: #777;
                    text-align: center;
                }
            </style>
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Search for movies or TV shows...">
                <div class="results-dropdown">
                    <!-- Results will be rendered here -->
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const inputElement = this.shadowRoot.querySelector('.search-input');

        // --- Debounced Search Logic ---
        const performSearch = async (query) => {
            if (query.length > 0) {
                this.showLoadingState(); // Show loading indicator
                try {
                    // Call the enhanced MovieService.searchMulti
                    const results = await this.movieService.searchMulti(query);
                    this.renderResults(results); // Render the fetched results
                } catch (error) {
                    console.error("Search API call failed:", error);
                    // Display an error message or clear results on API failure
                    // For now, show "No results found" for simplicity on error.
                    this.renderResults([]); 
                }
            } else {
                this.hideDropdown(); // Hide dropdown if query is empty
            }
        };

        // Create a debounced version of the search function with a 400ms delay
        const debouncedSearch = this._debounce(performSearch, 400);

        // Add event listener to the input element, triggering the debounced search
        if (inputElement) {
            inputElement.addEventListener('input', (event) => {
                const query = event.target.value.trim();
                debouncedSearch(query); // Call the debounced function
            });
        }

        document.addEventListener('click', (event) => {
            if (!this.contains(event.target)) {
                this.hideDropdown();
            }
        });
    }

    showLoadingState() {
        const dropdownElement = this.shadowRoot.querySelector('.results-dropdown');
        if (!dropdownElement) return;
        dropdownElement.innerHTML = '<div class="no-results">Loading...</div>';
        dropdownElement.classList.add('visible');
    }

    renderResults(results) {
        const dropdownElement = this.shadowRoot.querySelector('.results-dropdown');
        if (!dropdownElement) return;

        if (!results || results.length === 0) {
            dropdownElement.innerHTML = '<div class="no-results">No results found</div>';
            dropdownElement.classList.add('visible');
            return;
        }

        const isRoot = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
        const detailsPath = isRoot ? 'pages/movie-details.html' : 'movie-details.html';

        dropdownElement.innerHTML = results.map(item => `
            <div class="result-item" data-id="${item.id}" data-type="${item.media_type}">
                <img src="${item.poster_url || 'https://via.placeholder.com/185?text=No+Image'}" alt="${item.title || 'Untitled'}">
                <div>
                    <div class="result-title">${item.title || 'Untitled'}</div>
                    <div class="result-overview">${item.overview || ''}</div>
                </div>
            </div>
        `).join('');

        dropdownElement.classList.add('visible');

        dropdownElement.querySelectorAll('.result-item').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.getAttribute('data-id');
                if (id) {
                    window.location.href = `${detailsPath}?id=${id}`;
                }
            });
        });
    }

    hideDropdown() {
        const dropdownElement = this.shadowRoot.querySelector('.results-dropdown');
        if (!dropdownElement) return;
        dropdownElement.classList.remove('visible');
        dropdownElement.innerHTML = '';
    }
}

customElements.define('search-component', SearchComponent);
