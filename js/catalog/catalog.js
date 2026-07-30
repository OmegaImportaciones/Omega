/* =========================
   1. DOM & CONFIG
========================= */

const productsContainer =
    document.getElementById('productsContainer');

const CATALOG_CONFIG = {
    INITIAL_BATCH_SIZE: 60,   // productos que se pintan al abrir el catálogo
    LOAD_BATCH_SIZE: 60,      // productos que se agregan en cada carga posterior
    OBSERVER_ROOT_MARGIN: '600px 0px' // margen de anticipación antes de llegar al final
};


/* =========================
   2. STATE
========================= */

const catalogState = {
    dataset: [],        // productos actualmente activos (todos o resultado de búsqueda)
    renderedCount: 0,    // cuántos productos del dataset ya están pintados en el DOM
    sentinel: null,      // elemento invisible que dispara la siguiente carga
    observer: null       // instancia única de IntersectionObserver (se reutiliza)
};

// Mantenida por compatibilidad: otros módulos (búsqueda, analytics, futuras
// features) pueden seguir leyendo/usando "allProducts" tal como antes.
let allProducts = [];


/* =========================
   3. DATA LAYER
========================= */

async function fetchAvailableProducts() {

    const response =
        await fetch('../data/products.json');

    const products =
        await response.json();

    return products.filter(product =>
        product.estado === 1 &&
        product.cantidad_disponible > 0
    );

}

async function loadProducts() {

    try {

        allProducts =
            await fetchAvailableProducts();

        renderProducts(allProducts);

        if (typeof initializeSearch === 'function') {
            initializeSearch(allProducts);
        }

    } catch (error) {
        console.error('Error loading products:', error);
    }

}


/* =========================
   4. CARD BUILDER
========================= */

function createWhatsAppLink(product) {

    const price =
        Number(product.precio1).toFixed(2);

    const message =
        `Hola.

Quisiera comprar el siguiente producto:

${product.producto}

Vi que en su catálogo web figura con un precio de Bs ${price}.

¿Podrían confirmarme si aún está disponible para coordinar la compra?

¡Quedo atento, muchas gracias!`;

    return `https://wa.me/59164216262?text=${encodeURIComponent(message)}`;

}

// Crea un nodo <article> REAL (no un string de HTML). Cada tarjeta se crea
// una única vez y se añade al DOM; nunca se vuelve a tocar ni a reconstruir,
// así que su <img> nunca se re-decodifica ni parpadea.
function createProductCardElement(product) {

    const article = document.createElement('article');
    article.className = 'main-button product-card';
    article.dataset.name = product.producto;

    article.innerHTML = `
        <img
            src="${product.imagen}"
            alt="${product.producto}"
            class="product-image"
            loading="lazy">

        <div class="product-content">

            <h3>
                ${product.producto}
            </h3>

            <p class="product-price">
                Bs ${Number(product.precio1).toFixed(2)}
            </p>

            <span class="product-contact">
                Consultar disponibilidad
            </span>

        </div>

        <a
            href="${createWhatsAppLink(product)}"
            target="_blank"
            rel="noopener noreferrer"
            class="product-action">
            Consultar
        </a>
    `;

    const actionLink = article.querySelector('.product-action');

    if (actionLink) {
        actionLink.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'click_product_whatsapp', {
                    product_name: product.producto,
                    page: 'catalogo'
                });
            }
        });
    }

    return article;

}

// Elemento invisible colocado al final del catálogo. Actúa como disparador
// para el IntersectionObserver. Se estiliza para no romper ni el grid
// (desktop) ni el layout en columna (mobile).
function createSentinelElement() {

    const sentinel = document.createElement('div');
    sentinel.className = 'catalog-sentinel';
    sentinel.setAttribute('aria-hidden', 'true');

    sentinel.style.width = '100%';
    sentinel.style.gridColumn = '1 / -1';
    sentinel.style.flexBasis = '100%';
    sentinel.style.height = '1px';

    return sentinel;

}


/* =========================
   5. RENDERIZADO INCREMENTAL
========================= */

// Limpia el catálogo por completo. Se usa solo cuando cambia el dataset
// entero (carga inicial o nueva búsqueda), ya que en ese caso no tiene
// sentido reciclar tarjetas: son productos distintos.
function resetCatalogDOM() {

    if (!productsContainer) return;

    if (catalogState.observer && catalogState.sentinel) {
        catalogState.observer.unobserve(catalogState.sentinel);
    }

    productsContainer.innerHTML = '';
    catalogState.sentinel = null;
    catalogState.renderedCount = 0;

}

// Agrega el siguiente bloque de productos usando un DocumentFragment
// (una sola operación de inserción), sin tocar las tarjetas ya
// renderizadas. Las tarjetas nuevas se insertan SIEMPRE antes del
// sentinel, por lo que el sentinel queda automáticamente al final.
function renderNextBatch() {

    if (!productsContainer) return;

    const { dataset, renderedCount } = catalogState;

    if (renderedCount >= dataset.length) return;

    const batchSize =
        renderedCount === 0
            ? CATALOG_CONFIG.INITIAL_BATCH_SIZE
            : CATALOG_CONFIG.LOAD_BATCH_SIZE;

    const nextCount =
        Math.min(dataset.length, renderedCount + batchSize);

    const fragment = document.createDocumentFragment();

    for (let index = renderedCount; index < nextCount; index++) {
        fragment.appendChild(createProductCardElement(dataset[index]));
    }

    if (catalogState.sentinel && catalogState.sentinel.parentNode === productsContainer) {
        productsContainer.insertBefore(fragment, catalogState.sentinel);
    } else {
        productsContainer.appendChild(fragment);
    }

    catalogState.renderedCount = nextCount;

}


/* =========================
   6. INTERSECTION OBSERVER
========================= */

function ensureObserver() {

    if (catalogState.observer) return;

    catalogState.observer = new IntersectionObserver(
        handleSentinelIntersect,
        {
            root: null,
            rootMargin: CATALOG_CONFIG.OBSERVER_ROOT_MARGIN,
            threshold: 0
        }
    );

}

function handleSentinelIntersect(entries) {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        try {
            renderNextBatch();
        } catch (error) {
            console.error('Error cargando el siguiente bloque de productos:', error);
        }

        if (catalogState.renderedCount >= catalogState.dataset.length) {
            catalogState.observer.unobserve(catalogState.sentinel);
            return;
        }

        // Forzamos una nueva verificación de intersección: si el sentinel
        // sigue visible (porque el bloque recién cargado no alcanzó a
        // empujarlo fuera del viewport), volver a observarlo dispara un
        // chequeo inmediato y sigue cargando bloques hasta que quede
        // realmente fuera de pantalla.
        catalogState.observer.unobserve(catalogState.sentinel);
        catalogState.observer.observe(catalogState.sentinel);

    });

}

function attachObserverIfNeeded() {

    if (catalogState.renderedCount >= catalogState.dataset.length) return;

    if (!('IntersectionObserver' in window)) {
        // Fallback sin soporte de IntersectionObserver: cargar todo de una vez.
        while (catalogState.renderedCount < catalogState.dataset.length) {
            renderNextBatch();
        }
        return;
    }

    ensureObserver();
    catalogState.observer.observe(catalogState.sentinel);

}


/* =========================
   7. PUBLIC API
   (mismas firmas que antes: renderProducts() y loadProducts()
   siguen existiendo para que search.js y cualquier otro script
   que ya las use no requieran cambios)
========================= */

function renderProducts(products) {

    if (!productsContainer) return;

    catalogState.dataset =
        Array.isArray(products) ? products : [];

    // Dataset nuevo (carga inicial o nueva búsqueda) -> se reinicia la
    // paginación desde cero.
    resetCatalogDOM();

    if (catalogState.dataset.length === 0) return;

    catalogState.sentinel = createSentinelElement();
    productsContainer.appendChild(catalogState.sentinel);

    // Primer bloque: si el dataset (ej. resultado de búsqueda) es más
    // chico que INITIAL_BATCH_SIZE, esta misma llamada ya lo pinta
    // completo y attachObserverIfNeeded() no activará el observer.
    renderNextBatch();

    attachObserverIfNeeded();

}

// Punto de extensión para futuras features (carrito, filtros avanzados,
// orden, categorías) sin tocar el motor de paginación.
window.CatalogPagination = {
    getDataset: () => catalogState.dataset,
    getRenderedCount: () => catalogState.renderedCount,
    refresh: () => renderProducts(catalogState.dataset)
};


/* =========================
   INIT
========================= */

loadProducts();
