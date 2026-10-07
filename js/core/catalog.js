/* =========================================================
   CATALOG — carga products.json una sola vez y lo enriquece
   con precio, categoría, imágenes y marca de "nuevo".
========================================================= */

(function () {

    const U = window.Omega.utils;

    const STORE = window.OMEGA_STORE;

    let cache = null;


    async function fetchJSON(path, optional) {

        try {

            const response = await fetch(U.url(path), { cache: 'no-cache' });

            if (!response.ok) throw new Error(`${path}: ${response.status}`);

            return await response.json();

        } catch (error) {

            if (optional) return null;

            throw error;

        }

    }


    function imagesOf(product) {

        return [product.imagen, product.imagen2, product.imagen3]
            .filter(src => src && !/\/default\.(png|jpe?g|webp)$/i.test(src));

    }


    // "Nuevo" = no existía en old.json o antes estaba en 0
    function buildNewChecker(oldProducts) {

        if (!Array.isArray(oldProducts)) return () => false;

        const oldStock = new Map(
            oldProducts.map(p => [p.id, Number(p.cantidad_disponible) || 0])
        );

        return product => !oldStock.has(product.id) || oldStock.get(product.id) <= 0;

    }


    function enrich(product, isNew) {

        const { price, oldPrice } = window.OmegaPricing.getPrice(product);

        return Object.assign({}, product, {
            _price: price,
            _oldPrice: oldPrice,
            _discount: oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0,
            _category: window.Omega.categories.of(product),
            _images: imagesOf(product),
            _isNew: isNew(product),
            _name: U.titleCase(product.producto)
        });

    }


    async function load() {

        if (cache) return cache;

        cache = (async () => {

            const [raw, old] = await Promise.all([
                fetchJSON(STORE.PRODUCTS_URL),
                fetchJSON(STORE.OLD_PRODUCTS_URL, true)
            ]);

            const isNew = buildNewChecker(old);

            const all = (Array.isArray(raw) ? raw : []).map(p => enrich(p, isNew));

            const products = all.filter(p => window.OmegaInventory.isPublishable(p));

            return {
                products,
                byId: new Map(products.map(p => [String(p.id), p])),
                allById: new Map(all.map(p => [String(p.id), p])),
                categories: window.Omega.categories.summarize(products, 3),
                offers: products.filter(p => p._oldPrice),
                fresh: products.filter(p => p._isNew)
            };

        })();

        return cache;

    }


    window.Omega.catalog = { load };

})();
