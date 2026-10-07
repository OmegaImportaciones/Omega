/* =========================================================
   SHOP — tienda completa: búsqueda, categorías y orden
   Estado en la URL: ?q=audifonos&cat=parlantes&orden=precio-asc
========================================================= */

(function () {

    const U = window.Omega.utils;

    const Card = window.Omega.productCard;

    const BATCH = 24;

    const SORTS = {
        relevancia: (a, b) => (b._isNew - a._isNew) || (b._discount - a._discount),
        'precio-asc': (a, b) => a._price - b._price,
        'precio-desc': (a, b) => b._price - a._price,
        nombre: (a, b) => a._name.localeCompare(b._name, 'es')
    };

    const state = { catalog: null, q: '', cat: '', orden: 'relevancia', results: [], shown: 0 };

    const grid = document.getElementById('shopGrid');

    const chips = document.getElementById('categoryChips');

    const sortSelect = document.getElementById('sortSelect');

    const summary = document.getElementById('resultSummary');

    const sentinel = document.getElementById('shopSentinel');

    let searchTimer = null;


    function readURL() {

        const params = new URLSearchParams(location.search);

        state.q = params.get('q') || '';

        state.cat = params.get('cat') || '';

        state.orden = SORTS[params.get('orden')] ? params.get('orden') : 'relevancia';

        if (params.get('ofertas') === '1') state.cat = '__ofertas';

    }


    function writeURL() {

        const params = new URLSearchParams();

        if (state.q) params.set('q', state.q);

        if (state.cat === '__ofertas') params.set('ofertas', '1');
        else if (state.cat) params.set('cat', state.cat);

        if (state.orden !== 'relevancia') params.set('orden', state.orden);

        const query = params.toString();

        history.replaceState(null, '', query ? `?${query}` : location.pathname);

    }


    function renderChips() {

        const { catalog } = state;

        const items = [{ slug: '', label: 'Todo', count: catalog.products.length }];

        if (catalog.offers.length) items.push({ slug: '__ofertas', label: 'Ofertas', count: catalog.offers.length });

        items.push(...catalog.categories);

        chips.innerHTML = items.map(c => `
            <button type="button" class="chip${c.slug === '__ofertas' ? ' chip--offer' : ''}" data-cat="${c.slug}" aria-pressed="${state.cat === c.slug}">
                ${U.escapeHTML(c.label)} <span>${c.count}</span>
            </button>`).join('');

        const active = chips.querySelector('[aria-pressed="true"]');

        if (active) active.scrollIntoView({ block: 'nearest', inline: 'center' });

    }


    function compute() {

        const { catalog } = state;

        let list = catalog.products;

        if (state.cat === '__ofertas') list = catalog.offers;
        else if (state.cat) list = list.filter(p => p._category.slug === state.cat);

        list = window.Omega.search.filter(list, state.q);

        state.results = [...list].sort(SORTS[state.orden]);

        state.shown = 0;

    }


    function describe() {

        const n = state.results.length;

        const catLabel = state.cat === '__ofertas'
            ? 'en oferta'
            : (state.catalog.categories.find(c => c.slug === state.cat) || {}).label;

        let text = `${n} ${n === 1 ? 'producto' : 'productos'}`;

        if (catLabel) text += state.cat === '__ofertas' ? ` ${catLabel}` : ` en ${catLabel}`;

        if (state.q) text += ` para “${state.q}”`;

        summary.textContent = text;

    }


    function renderMore() {

        const next = state.results.slice(state.shown, state.shown + BATCH);

        Card.renderInto(grid, next, { list: state.cat || 'tienda' });

        state.shown += next.length;

        sentinel.hidden = state.shown >= state.results.length;

    }


    function render() {

        compute();

        describe();

        grid.innerHTML = '';

        if (state.results.length === 0) {

            grid.innerHTML = `
                <div class="empty-state empty-state--wide">
                    <p><strong>No encontramos “${U.escapeHTML(state.q)}”${state.cat ? ' en esta categoría' : ''}.</strong></p>
                    <p>Prueba con otra palabra o pregúntanos: muchas veces lo tenemos en tienda.</p>
                    <a class="button button--whatsapp" target="_blank" rel="noopener"
                       href="${window.Omega.whatsapp.general(`Hola ${window.OMEGA_STORE.NOMBRE}, ¿tienen ${state.q || 'este producto'}?`)}">Preguntar por WhatsApp</a>
                </div>`;

            sentinel.hidden = true;

            return;

        }

        renderMore();

    }


    function setQuery(value, debounced) {

        state.q = value.trim();

        clearTimeout(searchTimer);

        const apply = () => {
            writeURL();
            render();
            if (state.q) window.Omega.analytics.track('search', { search_term: state.q, page: 'tienda' });
        };

        if (debounced) searchTimer = setTimeout(apply, 250);
        else apply();

    }


    function bind() {

        chips.addEventListener('click', event => {

            const chip = event.target.closest('[data-cat]');

            if (!chip) return;

            state.cat = chip.dataset.cat;

            // Elegir categoría empieza una exploración nueva: limpia la búsqueda
            state.q = '';

            const input = document.getElementById('headerSearch');

            if (input) input.value = '';

            chips.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));

            writeURL();

            render();

            window.Omega.analytics.track('filter_category', { category: state.cat || 'todo' });

        });

        sortSelect.addEventListener('change', () => {

            state.orden = sortSelect.value;

            writeURL();

            render();

        });

        new IntersectionObserver(entries => {

            if (entries.some(e => e.isIntersecting)) renderMore();

        }, { rootMargin: '800px 0px' }).observe(sentinel);

    }


    async function init() {

        readURL();

        sortSelect.value = state.orden;

        try {

            state.catalog = await window.Omega.catalog.load();

            renderChips();

            bind();

            render();

        } catch (error) {

            console.error(error);

            summary.textContent = 'No pudimos cargar los productos. Revisa tu conexión y recarga la página.';

        }

    }


    window.Omega.shopPage = { setQuery };

    init();

})();
