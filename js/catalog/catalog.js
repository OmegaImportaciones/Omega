/* =========================================================
   CATALOG.JS — Catálogo con Virtual Scrolling
   =========================================================
   Arquitectura:
   1. DOM & CONFIG        -> referencias y constantes
   2. STATE                -> estado central de la virtualización
   3. DATA LAYER           -> fetch + filtrado de productos
   4. RENDER LAYER (CARDS) -> construcción de nodos DOM de tarjetas
   5. VIRTUALIZATION CORE  -> medición de grid, cálculo de rango
                              visible y RECONCILIACIÓN del DOM
                              (agrega/quita solo lo necesario, nunca
                              destruye tarjetas que siguen visibles
                              -> evita el parpadeo)
   6. SCROLL / RESIZE      -> listeners y throttling
   7. PUBLIC API           -> renderProducts(), loadProducts()
                              (mismas firmas que la versión anterior,
                              para no romper search.js / analytics)
   ========================================================= */


/* =========================
   1. DOM & CONFIG
========================= */

const productsContainer =
    document.getElementById('productsContainer');

const VIRTUAL_CONFIG = {
    BUFFER_ROWS: 3,           // filas extra renderizadas arriba/abajo del viewport
    DEFAULT_ROW_HEIGHT: 380,  // estimación inicial (px) antes de medir el DOM real
    DEFAULT_COLUMNS: 1,       // estimación inicial de columnas
    RESIZE_DEBOUNCE_MS: 150
};


/* =========================
   2. STATE
========================= */

const virtualState = {
    dataset: [],          // productos actualmente activos (todos o resultado de búsqueda)
    columns: VIRTUAL_CONFIG.DEFAULT_COLUMNS,
    rowHeight: VIRTUAL_CONFIG.DEFAULT_ROW_HEIGHT,
    totalRows: 0,
    renderedStart: -1,    // índice inicial actualmente pintado en el DOM
    renderedEnd: -1,      // índice final actualmente pintado en el DOM
    nodeMap: new Map(),   // índice del producto -> nodo <article> ya montado en el DOM
    topSpacer: null,      // referencia persistente al espaciador superior
    bottomSpacer: null,   // referencia persistente al espaciador inferior
    ticking: false,       // throttle de scroll vía rAF
    resizeTimer: null,    // debounce de resize
    listenersAttached: false
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
   4. RENDER LAYER (CARDS)
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

// Crea un nodo <article> REAL (no un string de HTML). Esto es clave:
// una vez creado, este nodo se reutiliza mientras el producto siga
// dentro del rango visible, así su <img> nunca se vuelve a decodificar
// ni a parpadear.
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

function createSpacerElement(position) {

    const spacer = document.createElement('div');
    spacer.className = `virtual-spacer virtual-spacer-${position}`;
    spacer.setAttribute('aria-hidden', 'true');

    // Inline styles para no depender de cambios en CSS:
    // - grid-column: 1 / -1 -> funciona si productsContainer es CSS Grid
    // - flex-basis: 100%    -> funciona si productsContainer es Flexbox wrap
    spacer.style.width = '100%';
    spacer.style.gridColumn = '1 / -1';
    spacer.style.flexBasis = '100%';
    spacer.style.height = '0px';

    return spacer;

}


/* =========================
   5. VIRTUALIZATION CORE
========================= */

function ensureSpacers() {

    if (virtualState.topSpacer && virtualState.bottomSpacer) return;

    productsContainer.innerHTML = '';

    virtualState.topSpacer = createSpacerElement('top');
    virtualState.bottomSpacer = createSpacerElement('bottom');

    productsContainer.appendChild(virtualState.topSpacer);
    productsContainer.appendChild(virtualState.bottomSpacer);

}

// Limpia por completo el DOM virtualizado. Se usa SOLO cuando cambia el
// dataset completo (ej. una nueva búsqueda), porque en ese caso el mismo
// índice ya no corresponde al mismo producto y no tiene sentido reciclar
// nodos viejos.
function resetVirtualDOM() {

    if (!productsContainer) return;

    productsContainer.innerHTML = '';
    virtualState.nodeMap.clear();
    virtualState.topSpacer = null;
    virtualState.bottomSpacer = null;
    virtualState.renderedStart = -1;
    virtualState.renderedEnd = -1;

    ensureSpacers();

}

function measureGridMetrics() {

    if (!productsContainer) return false;

    // --- columnas ---
    // getComputedStyle resuelve grid-template-columns a una lista de pistas
    // en píxeles ya calculadas (aunque se use repeat(auto-fill,...)), por lo
    // que contar los tokens nos da el número real de columnas actuales.
    let measuredColumns = virtualState.columns;

    const computedTemplate =
        getComputedStyle(productsContainer).gridTemplateColumns;

    if (computedTemplate && computedTemplate !== 'none') {
        const tracks = computedTemplate.trim().split(/\s+/).filter(Boolean);
        if (tracks.length > 0) measuredColumns = tracks.length;
    }

    // --- alto de fila ---
    const firstCard =
        productsContainer.querySelector('.product-card');

    let measuredRowHeight = virtualState.rowHeight;

    if (firstCard) {
        const rowGap =
            parseFloat(getComputedStyle(productsContainer).rowGap) || 0;

        measuredRowHeight =
            firstCard.getBoundingClientRect().height + rowGap;
    }

    const changed =
        measuredColumns !== virtualState.columns ||
        Math.abs(measuredRowHeight - virtualState.rowHeight) > 1;

    virtualState.columns =
        Math.max(1, measuredColumns);

    virtualState.rowHeight =
        measuredRowHeight || VIRTUAL_CONFIG.DEFAULT_ROW_HEIGHT;

    virtualState.totalRows =
        Math.ceil(virtualState.dataset.length / virtualState.columns);

    return changed;

}

function computeVisibleRange() {

    const { columns, rowHeight, totalRows, dataset } = virtualState;

    if (!productsContainer || dataset.length === 0 || columns < 1) {
        return { startRow: 0, endRow: -1, startIndex: 0, endIndex: 0 };
    }

    const containerTop =
        productsContainer.getBoundingClientRect().top + window.scrollY;

    const scrollWithinContainer =
        Math.max(0, window.scrollY - containerTop);

    const viewportHeight = window.innerHeight;

    let startRow =
        Math.floor(scrollWithinContainer / rowHeight) - VIRTUAL_CONFIG.BUFFER_ROWS;

    let endRow =
        Math.ceil((scrollWithinContainer + viewportHeight) / rowHeight) + VIRTUAL_CONFIG.BUFFER_ROWS;

    startRow = Math.max(0, startRow);
    endRow = Math.min(totalRows - 1, endRow);
    if (endRow < startRow) endRow = startRow;

    const startIndex = startRow * columns;
    const endIndex = Math.min(dataset.length, (endRow + 1) * columns);

    return { startRow, endRow, startIndex, endIndex };

}

// Busca, dentro del rango [fromIndex+1, endIndex), el próximo nodo que ya
// esté montado en el DOM. Sirve como referencia para insertar un nodo nuevo
// en la posición correcta con insertBefore, sin tener que reordenar nada.
function findNextMountedNode(fromIndex, endIndex) {

    for (let index = fromIndex + 1; index < endIndex; index++) {
        const node = virtualState.nodeMap.get(index);
        if (node) return node;
    }

    return null; // no hay nodos después -> insertar justo antes del bottomSpacer

}

// Reconciliación: en lugar de reemplazar innerHTML, solo:
//   - elimina las tarjetas que quedaron fuera del nuevo rango
//   - agrega las tarjetas nuevas que entraron al rango
//   - deja intactas (sin tocar) las que ya estaban y siguen visibles
// Esto es lo que elimina el parpadeo al hacer scroll.
function renderVisibleWindow(range) {

    if (!productsContainer) return;

    const { dataset, rowHeight, totalRows } = virtualState;

    if (dataset.length === 0) {
        resetVirtualDOM();
        return;
    }

    ensureSpacers();

    const { startIndex, endIndex, startRow, endRow } = range;

    // 1. eliminar tarjetas que quedaron fuera del rango
    for (const [index, node] of virtualState.nodeMap) {
        if (index < startIndex || index >= endIndex) {
            node.remove();
            virtualState.nodeMap.delete(index);
        }
    }

    // 2. agregar tarjetas nuevas que entraron al rango, en su posición correcta
    for (let index = startIndex; index < endIndex; index++) {

        if (virtualState.nodeMap.has(index)) continue;

        const product = dataset[index];
        const node = createProductCardElement(product);

        const referenceNode =
            findNextMountedNode(index, endIndex) || virtualState.bottomSpacer;

        productsContainer.insertBefore(node, referenceNode);
        virtualState.nodeMap.set(index, node);

    }

    // 3. actualizar el tamaño de los espaciadores
    const renderedRows = Math.max(0, endRow - startRow + 1);

    const topHeight = startRow * rowHeight;
    const bottomHeight =
        Math.max(0, (totalRows - startRow - renderedRows) * rowHeight);

    virtualState.topSpacer.style.height = `${topHeight}px`;
    virtualState.bottomSpacer.style.height = `${bottomHeight}px`;

    virtualState.renderedStart = startIndex;
    virtualState.renderedEnd = endIndex;

}

function updateVisibleWindow() {

    const range = computeVisibleRange();

    const sameRange =
        range.startIndex === virtualState.renderedStart &&
        range.endIndex === virtualState.renderedEnd;

    if (sameRange) return; // nada cambió, evitamos trabajo innecesario

    renderVisibleWindow(range);

}


/* =========================
   6. SCROLL / RESIZE
========================= */

function handleScroll() {

    if (virtualState.ticking) return;

    virtualState.ticking = true;

    requestAnimationFrame(() => {
        updateVisibleWindow();
        virtualState.ticking = false;
    });

}

function handleResize() {

    clearTimeout(virtualState.resizeTimer);

    virtualState.resizeTimer = setTimeout(() => {

        const changed = measureGridMetrics();

        if (changed) {
            // Si cambiaron las columnas/alto de fila, los índices por fila
            // ya no corresponden al layout real: reconstruimos el rango
            // desde cero (pero seguimos reconciliando nodos, no destruimos
            // el DOM completo).
            virtualState.renderedStart = -1;
            virtualState.renderedEnd = -1;
        }

        updateVisibleWindow();

    }, VIRTUAL_CONFIG.RESIZE_DEBOUNCE_MS);

}

function attachVirtualScrollListeners() {

    if (virtualState.listenersAttached) return;
    virtualState.listenersAttached = true;

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    if (window.ResizeObserver && productsContainer) {
        const observer = new ResizeObserver(() => handleResize());
        observer.observe(productsContainer);
    }

}


/* =========================
   7. PUBLIC API
   (mismas firmas que antes: renderProducts() y loadProducts()
   siguen existiendo para que search.js y cualquier otro script
   que ya las use no requieran cambios)
========================= */

function renderProducts(products) {

    virtualState.dataset =
        Array.isArray(products) ? products : [];

    // Dataset nuevo (carga inicial o nueva búsqueda) -> los índices ya no
    // representan los mismos productos, así que reciclar nodos no sirve:
    // arrancamos el DOM virtualizado desde cero.
    resetVirtualDOM();

    virtualState.totalRows =
        Math.ceil(virtualState.dataset.length / virtualState.columns);

    // Render inicial con métricas estimadas/actuales
    const initialRange = computeVisibleRange();
    renderVisibleWindow(initialRange);

    // Con tarjetas reales ya en el DOM, medimos el grid de verdad
    // y corregimos la ventana visible si la estimación estaba mal.
    // renderVisibleWindow ya reconcilia (no recrea) lo que siga en rango.
    requestAnimationFrame(() => {
        const changed = measureGridMetrics();
        if (changed) {
            const refinedRange = computeVisibleRange();
            renderVisibleWindow(refinedRange);
        }
    });

    attachVirtualScrollListeners();

}

// Punto de extensión para futuras features (carrito, filtros avanzados,
// orden, categorías) sin tocar el motor de virtualización.
window.CatalogVirtual = {
    getDataset: () => virtualState.dataset,
    getMetrics: () => ({
        columns: virtualState.columns,
        rowHeight: virtualState.rowHeight,
        totalRows: virtualState.totalRows
    }),
    refresh: () => renderProducts(virtualState.dataset)
};


/* =========================
   INIT
========================= */

loadProducts();