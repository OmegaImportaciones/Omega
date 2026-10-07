/* =========================================================
   HOME — vitrina, ofertas, categorías, recién llegados
========================================================= */

(function () {

    const U = window.Omega.utils;

    const Card = window.Omega.productCard;


    function pickShowcase(catalog) {

        const withImage = list => list.filter(p => p._images.length);

        const pool = [
            ...withImage(catalog.offers),
            ...withImage(catalog.fresh),
            ...U.seededShuffle(withImage(catalog.products), U.daySeed())
        ];

        const seen = new Set();

        return pool.filter(p => !seen.has(p.id) && seen.add(p.id)).slice(0, 3);

    }


    function renderShowcase(catalog) {

        const stage = document.getElementById('vitrina');

        if (!stage) return;

        const items = pickShowcase(catalog);

        stage.innerHTML = items.map((p, i) => `
            <a class="vitrina-item vitrina-item--${i + 1}" href="${Card.productHref(p)}">
                <img src="${U.escapeHTML(p._images[0])}" alt="${U.escapeHTML(p._name)}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
                ${Card.priceTag(p)}
            </a>`).join('');

        stage.classList.add('is-ready');

    }


    function renderRail(sectionId, products, list) {

        const section = document.getElementById(sectionId);

        if (!section) return;

        if (!products.length) { section.hidden = true; return; }

        section.hidden = false;

        Card.renderInto(section.querySelector('.rail'), products, { list });

    }


    function renderCategories(catalog) {

        const grid = document.getElementById('categoryGrid');

        if (!grid) return;

        grid.innerHTML = catalog.categories.slice(0, 8).map(cat => {

            const sample = catalog.products.find(p => p._category.slug === cat.slug && p._images.length) || cat.sample;

            return `
                <a class="category-tile" href="${U.url('pages/catalogo.html?cat=' + cat.slug)}">
                    <span class="category-img">${sample._images[0] ? `<img src="${U.escapeHTML(sample._images[0])}" alt="" loading="lazy">` : ''}</span>
                    <span class="category-label">${U.escapeHTML(cat.label)}</span>
                    <span class="category-count">${cat.count} productos</span>
                </a>`;

        }).join('');

    }


    async function init() {

        try {

            const catalog = await window.Omega.catalog.load();

            renderShowcase(catalog);

            renderRail('ofertas', catalog.offers.slice(0, 12), 'ofertas');

            renderCategories(catalog);

            renderRail('nuevos', catalog.fresh.slice(0, 12), 'recien_llegados');

            const daily = U.seededShuffle(catalog.products, U.daySeed() + 7).slice(0, 8);

            Card.renderInto(document.getElementById('dailyGrid'), daily, { list: 'elegidos_hoy' });

            document.querySelectorAll('[data-total-products]').forEach(n => { n.textContent = catalog.products.length; });

        } catch (error) {

            console.error('No se pudo cargar el catálogo', error);

            document.getElementById('loadError').hidden = false;

        }

    }


    init();

})();
