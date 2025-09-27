// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Selección de Elementos del DOM ---
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const loadInitialBtn = document.getElementById('load-initial-btn');
    const displayContainer = document.getElementById('pokemon-display-container');
    const favoritesContainer = document.getElementById('favorites-container');

    const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
    const FAVORITES_KEY = 'pokeFavorites'; // Clave para localStorage

    // --- 2. Gestión de Favoritos (localStorage) ---

    /**
     * Obtiene los favoritos desde localStorage.
     * @returns {string[]} Un array de nombres de Pokémon favoritos.
     */
    const getFavorites = () => {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    };

    /**
     * Guarda el array de favoritos en localStorage.
     * @param {string[]} favorites - El array de nombres de Pokémon.
     */
    const saveFavorites = (favorites) => {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    };

    /**
     * Añade o quita un Pokémon de favoritos.
     * @param {string} pokemonName - El nombre del Pokémon.
     */
    const toggleFavorite = (pokemonName) => {
        let favorites = getFavorites();
        
        if (favorites.includes(pokemonName)) {
            // Quitar de favoritos
            favorites = favorites.filter(name => name !== pokemonName);
        } else {
            // Añadir a favoritos
            favorites.push(pokemonName);
        }
        
        saveFavorites(favorites);
        
        // Refresca la vista de favoritos y la vista principal
        renderFavorites();
        updateAllVisibleCards(pokemonName);
    };

    /**
     * Actualiza el estado (estrella) de todas las tarjetas visibles
     * que coincidan con el nombre del Pokémon.
     */
    const updateAllVisibleCards = (pokemonName) => {
        const favorites = getFavorites();
        const isFavorite = favorites.includes(pokemonName);

        // Busca tarjetas en ambas secciones
        const allCards = document.querySelectorAll(`.pokemon-card[data-name="${pokemonName}"]`);
        
        allCards.forEach(card => {
            const button = card.querySelector('.pokemon-card__favorite-button');
            if (isFavorite) {
                card.classList.add('pokemon-card--favorite');
                button.classList.add('pokemon-card__favorite-button--active');
                button.textContent = '★'; // Estrella llena
            } else {
                card.classList.remove('pokemon-card--favorite');
                button.classList.remove('pokemon-card__favorite-button--active');
                button.textContent = '☆'; // Estrella vacía
            }
        });
    };


    // --- 3. Consumo de API (Fetch) ---

    /**
     * Busca un solo Pokémon por nombre o ID en la API.
     * @param {string} query - Nombre o ID del Pokémon.
     * @returns {Promise<object>} Los datos del Pokémon.
     */
    const fetchPokemon = async (query) => {
        try {
            const response = await fetch(`${API_URL}${query.toString().toLowerCase()}`);
            
            if (!response.ok) {
                throw new Error('Pokémon no encontrado');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error.message);
            throw error; // Propaga el error para que sea manejado por quien llama
        }
    };


    // --- 4. Renderizado en el DOM ---

    /**
     * Crea el elemento HTML para una tarjeta de Pokémon.
     * @param {object} data - Los datos del Pokémon de la API.
     * @returns {HTMLElement} El elemento de la tarjeta.
     */
    const createPokemonCard = (data) => {
        const card = document.createElement('article');
        const favorites = getFavorites();
        const isFavorite = favorites.includes(data.name);

        // BEM: Bloque 'pokemon-card'
        card.className = 'pokemon-card';
        card.dataset.name = data.name; // Para fácil selección
        
        if (isFavorite) {
            card.classList.add('pokemon-card--favorite'); // Modificador BEM
        }

        // Extraer datos requeridos
        const name = data.name;
        const imageUrl = data.sprites.other['official-artwork'].front_default;
        const types = data.types.map(t => t.type.name);
        const height = data.height;
        const weight = data.weight;
        const stats = data.stats.map(s => ({ name: s.stat.name, value: s.base_stat }));

        const typesHtml = types.map(type => 
            `<span class="pokemon-card__type pokemon-card__type--${type}">${type}</span>`
        ).join(' ');

        const statsHtml = stats.map(stat => 
            `<li class="pokemon-card__stat">
                <span>${stat.name}</span>
                <strong>${stat.value}</strong>
            </li>`
        ).join('');

        card.innerHTML = `
            <button class="pokemon-card__favorite-button ${isFavorite ? 'pokemon-card__favorite-button--active' : ''}">
                ${isFavorite ? '★' : '☆'}
            </button>
            <h2 class="pokemon-card__name">${name} (#${data.id})</h2>
            <img class="pokemon-card__image" src="${imageUrl}" alt="Imagen de ${name}">
            <div class="pokemon-card__types">
                ${typesHtml}
            </div>
            <div class="pokemon-card__details">
                <span>Altura: ${height / 10} m</span> | 
                <span>Peso: ${weight / 10} kg</span>
            </div>
            <ul class="pokemon-card__stats">
                ${statsHtml}
            </ul>
        `;

        // Añadir evento al botón de favorito
        card.querySelector('.pokemon-card__favorite-button').addEventListener('click', () => {
            toggleFavorite(name);
        });

        return card;
    };

    /**
     * Renderiza la lista de Pokémon favoritos en su sección.
     */
    const renderFavorites = async () => {
        favoritesContainer.innerHTML = '<p>Cargando favoritos...</p>';
        const favorites = getFavorites();
        
        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<p>No tienes Pokémon favoritos.</p>';
            return;
        }

        try {
            // Busca todos los pokémon favoritos en paralelo
            const favoriteData = await Promise.all(
                favorites.map(name => fetchPokemon(name))
            );
            
            favoritesContainer.innerHTML = ''; // Limpiar
            favoriteData.forEach(data => {
                const card = createPokemonCard(data);
                favoritesContainer.appendChild(card);
            });

        } catch (error) {
            favoritesContainer.innerHTML = '<p>Error al cargar favoritos.</p>';
        }
    };

    // --- 5. Manejadores de Eventos ---

    /**
     * Maneja el envío del formulario de búsqueda.
     */
    const handleSearch = async (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        
        if (!query) return;

        displayContainer.innerHTML = '<p>Buscando...</p>';
        
        try {
            const data = await fetchPokemon(query);
            const card = createPokemonCard(data);
            displayContainer.innerHTML = ''; // Limpiar
            displayContainer.appendChild(card);
        } catch (error) {
            displayContainer.innerHTML = `<p>${error.message}. Intenta con otro nombre o ID.</p>`;
        }
    };

    /**
     * Maneja el clic en "Cargar Pokémon Iniciales".
     */
    const handleLoadInitial = async () => {
        displayContainer.innerHTML = '<p>Cargando Pokémon...</p>';
        
        try {
            // 1. Obtener la lista de los primeros 20
            const response = await fetch(`${API_URL}?limit=20&offset=0`);
            if (!response.ok) throw new Error('No se pudo cargar la lista inicial.');
            
            const listData = await response.json();
            
            // 2. Buscar los datos de cada uno en paralelo
            const pokemonPromises = listData.results.map(pokemon => fetchPokemon(pokemon.name));
            const pokemonDataArray = await Promise.all(pokemonPromises);
            
            displayContainer.innerHTML = ''; // Limpiar
            
            // 3. Renderizar cada tarjeta
            pokemonDataArray.forEach(data => {
                const card = createPokemonCard(data);
                displayContainer.appendChild(card);
            });

        } catch (error) {
            displayContainer.innerHTML = `<p>${error.message}</p>`;
        }
    };

    // --- 6. Inicialización ---

    // Asignar eventos
    searchForm.addEventListener('submit', handleSearch);
    loadInitialBtn.addEventListener('click', handleLoadInitial);

    // Cargar favoritos al iniciar la página
    renderFavorites();
});