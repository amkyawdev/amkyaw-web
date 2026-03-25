// Search functionality for AmkyawDev
(function() {
    // Initialize search when DOM is ready
    document.addEventListener('DOMContentLoaded', initSearch);

    function initSearch() {
        // Setup search input
        const searchInput = document.querySelector('.search-box input, #search-input, input[type="search"]');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    executeSearch(searchInput.value);
                }
            });
        }

        // Setup search button
        const searchBtn = document.querySelector('.search-box button, .search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const input = document.querySelector('.search-box input, #search-input');
                if (input) {
                    executeSearch(input.value);
                }
            });
        }
    }

    function handleSearch(e) {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            clearSearchResults();
            return;
        }

        performSearch(query);
    }

    function executeSearch(query) {
        if (!query) return;
        
        // Redirect to search page with query
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }

    async function performSearch(query) {
        // Search across multiple data sources
        const results = {
            templates: [],
            projects: [],
            docs: []
        };

        // Search templates
        const templates = await fetchData('templates.json');
        if (templates) {
            results.templates = searchArray(templates, query, ['name', 'description', 'category', 'features']);
        }

        // Search projects
        const projects = await fetchData('projects.json');
        if (projects) {
            results.projects = searchArray(projects, query, ['name', 'client', 'category', 'technologies']);
        }

        // Search docs
        const docs = await fetchData('docs.json');
        if (docs) {
            results.docs = searchArray(docs, query, ['title', 'content', 'tags', 'category']);
        }

        displaySearchResults(results, query);
    }

    function searchArray(array, query, fields) {
        const lowerQuery = query.toLowerCase();
        
        return array.filter(item => {
            return fields.some(field => {
                const value = item[field];
                if (Array.isArray(value)) {
                    return value.some(v => v.toLowerCase().includes(lowerQuery));
                }
                return value && value.toString().toLowerCase().includes(lowerQuery);
            });
        });
    }

    async function fetchData(filename) {
        try {
            const response = await fetch(filename);
            if (!response.ok) throw new Error('Failed to fetch');
            return await response.json();
        } catch (error) {
            console.warn(`Could not fetch ${filename}:`, error);
            return [];
        }
    }

    function displaySearchResults(results, query) {
        let container = document.getElementById('search-results');
        if (!container) {
            container = createSearchContainer();
        }

        const totalResults = results.templates.length + results.projects.length + results.docs.length;

        container.innerHTML = `
            <div class="search-summary">
                <h3>Search Results for "${query}"</h3>
                <p>Found ${totalResults} results</p>
            </div>
            
            ${results.templates.length > 0 ? `
                <div class="search-section">
                    <h4>Templates (${results.templates.length})</h4>
                    <div class="results-list">
                        ${results.templates.map(template => `
                            <a href="web-template.html?id=${template.id}" class="result-item">
                                <img src="${template.image}" alt="${template.name}">
                                <div class="result-info">
                                    <h5>${template.name}</h5>
                                    <p>${template.description}</p>
                                    <span class="price">$${template.price}</span>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${results.projects.length > 0 ? `
                <div class="search-section">
                    <h4>Projects (${results.projects.length})</h4>
                    <div class="results-list">
                        ${results.projects.map(project => `
                            <a href="project.html?id=${project.id}" class="result-item">
                                <img src="${project.image}" alt="${project.name}">
                                <div class="result-info">
                                    <h5>${project.name}</h5>
                                    <p>Client: ${project.client}</p>
                                    <span class="status ${project.status}">${project.status}</span>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${results.docs.length > 0 ? `
                <div class="search-section">
                    <h4>Documentation (${results.docs.length})</h4>
                    <div class="results-list">
                        ${results.docs.map(doc => `
                            <a href="docs.html?id=${doc.id}" class="result-item">
                                <div class="result-info">
                                    <h5>${doc.title}</h5>
                                    <p>${doc.content.substring(0, 100)}...</p>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${totalResults === 0 ? `
                <div class="no-results">
                    <p>No results found for "${query}"</p>
                    <p>Try different keywords or browse our categories</p>
                </div>
            ` : ''}
        `;
    }

    function createSearchContainer() {
        const container = document.createElement('div');
        container.id = 'search-results';
        container.className = 'search-results';
        
        const searchPage = document.querySelector('.search-page, .search-container, main');
        if (searchPage) {
            searchPage.appendChild(container);
        } else {
            document.body.appendChild(container);
        }
        
        return container;
    }

    function clearSearchResults() {
        const container = document.getElementById('search-results');
        if (container) {
            container.innerHTML = '';
        }
    }

    // Utility: Debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Export
    window.search = {
        init: initSearch,
        execute: executeSearch
    };
})();