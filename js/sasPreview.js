/* =========================================================
   SAS — PREVIEW EN HOME
   Carrusel con los productos de la marca propia SAS
   (identificados por "{SAS}" en el nombre, ver brandFilter.js).
   Cargadores y cables van primero: son la línea prioritaria
   de la marca.
========================================================= */


/* =========================
   1. DOM & CONFIG
========================= */

const sasPreviewSection =
    document.getElementById(
        'sasSection'
    );

const sasPreviewContainer =
    document.getElementById(
        'sasContainer'
    );

const SAS_PREVIEW_CONFIG = {

    PRODUCTS_URL:
        './data/products.json',

    OLD_STOCK_URL:
        './data/old.json',

    PREVIEW_COUNT:
        12,

    SCROLL_INTERVAL_MS:
        9000,

    WHATSAPP_NUMBER:
        '59164216262'

};


/* =========================
   2. STATE
========================= */

const SAS_PREVIEW_STATE = {

    sliderInterval:
        null,

    isUserTouching:
        false,

    listenersRegistered:
        false

};


/* =========================
   3. DATA LAYER
========================= */

async function fetchSasPreviewJSON(path) {

    const response =
        await fetch(path);

    if (!response.ok) {

        throw new Error(
            `No se pudo cargar ${path}: ${response.status}`
        );

    }

    return await response.json();

}


function filterSasProducts(products) {

    if (!Array.isArray(products)) {

        return [];

    }

    return products.filter(product =>

        product.estado === 1 &&
        product.cantidad_disponible > 0 &&
        isSasProduct(product)

    );

}


async function fetchOldStockMapSasPreview() {

    try {

        const oldProducts =
            await fetchSasPreviewJSON(
                SAS_PREVIEW_CONFIG.OLD_STOCK_URL
            );

        const oldStockMap =
            new Map();

        oldProducts.forEach(product => {

            oldStockMap.set(
                product.id,
                Number(product.cantidad_disponible) || 0
            );

        });

        return oldStockMap;

    } catch (error) {

        return null;

    }

}


function markNewStockSasPreview(products, oldStockMap) {

    if (!oldStockMap) {

        return products.map(product => (
            { ...product, _isNewStock: false }
        ));

    }

    return products.map(product => {

        const isNewStock =
            !oldStockMap.has(product.id) ||
            oldStockMap.get(product.id) <= 0;

        return { ...product, _isNewStock: isNewStock };

    });

}

// Cargadores y cables primero (línea prioritaria SAS), luego
// stock nuevo, conservando el resto del orden.
function sortSasPreview(products) {

    return [...products].sort((a, b) => {

        const aPriority =
            isPriorityChargingProduct(a);

        const bPriority =
            isPriorityChargingProduct(b);

        if (aPriority !== bPriority) {

            return aPriority ? -1 : 1;

        }

        if (a._isNewStock !== b._isNewStock) {

            return a._isNewStock ? -1 : 1;

        }

        return 0;

    });

}


async function fetchSasPreviewProducts() {

    const [products, oldStockMap] =
        await Promise.all([
            fetchSasPreviewJSON(
                SAS_PREVIEW_CONFIG.PRODUCTS_URL
            ),
            fetchOldStockMapSasPreview()
        ]);

    const sasOnly =
        filterSasProducts(products);

    const withFlag =
        markNewStockSasPreview(sasOnly, oldStockMap);

    return sortSasPreview(withFlag)
        .slice(0, SAS_PREVIEW_CONFIG.PREVIEW_COUNT);

}


/* =========================
   4. CARD BUILDER
========================= */

function buildSasPreviewWhatsAppLink(product) {

    const displayName =
        stripBrandTag(product.producto);

    const price =
        Number(product.precio5).toFixed(2);

    const message =
        `Hola.

Quisiera comprar el siguiente producto SAS:

${displayName}

Vi que en su catálogo web figura con un precio de Bs ${price}.

¿Podrían confirmarme si aún está disponible para coordinar la compra?

¡Quedo atento, muchas gracias!`;

    return (
        `https://wa.me/${SAS_PREVIEW_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    );

}


function buildSasPreviewCard(product) {

    const card =
        document.createElement('a');

    card.href =
        buildSasPreviewWhatsAppLink(product);

    card.target =
        '_blank';

    card.rel =
        'noopener noreferrer';

    card.className =
        'carousel-card';

    const displayName =
        stripBrandTag(product.producto);

    const tagClass =
        product._isNewStock
            ? 'carousel-tag carousel-tag--new'
            : 'carousel-tag carousel-tag--sas';

    const tagLabel =
        product._isNewStock
            ? '🆕 Nuevo'
            : 'SAS';

    card.innerHTML = `

        <img src="${product.imagen}"
            alt="${displayName}"
            class="carousel-image"
            loading="lazy">

        <div class="carousel-info">

            <span class="${tagClass}">
                ${tagLabel}
            </span>

            <h3>
                ${displayName}
            </h3>

            <div class="carousel-prices">

                <span class="carousel-price">
                    Bs. ${Number(product.precio5).toFixed(2)}
                </span>

            </div>

            <span class="carousel-contact">
                Consultar disponibilidad
            </span>

        </div>

    `;

    card.addEventListener('click', () => {

        if (typeof gtag === 'function') {

            gtag(
                'event',
                'click_product_whatsapp',
                {
                    product_name: displayName,
                    page: 'index_sas_preview'
                }
            );

        }

    });

    return card;

}


/* =========================
   5. RENDER
========================= */

function renderSasPreviewCards(products) {

    sasPreviewContainer.innerHTML =
        '';

    const fragment =
        document.createDocumentFragment();

    products.forEach(product => {

        fragment.appendChild(
            buildSasPreviewCard(product)
        );

    });

    sasPreviewContainer.appendChild(
        fragment
    );

}


/* =========================
   6. SLIDER
========================= */

function registerSasPreviewListenersOnce() {

    if (SAS_PREVIEW_STATE.listenersRegistered) {

        return;

    }

    sasPreviewContainer.addEventListener(
        'touchstart',
        () => {

            SAS_PREVIEW_STATE.isUserTouching =
                true;

        },
        { passive: true }
    );

    sasPreviewContainer.addEventListener(
        'touchend',
        () => {

            setTimeout(() => {

                SAS_PREVIEW_STATE.isUserTouching =
                    false;

            }, 1500);

        },
        { passive: true }
    );

    SAS_PREVIEW_STATE.listenersRegistered =
        true;

}


function startSasPreviewSlider() {

    if (!sasPreviewContainer) return;

    const firstCard =
        sasPreviewContainer.querySelector(
            '.carousel-card'
        );

    if (!firstCard) return;

    const scrollAmount =
        firstCard.offsetWidth + 12;

    clearInterval(
        SAS_PREVIEW_STATE.sliderInterval
    );

    SAS_PREVIEW_STATE.sliderInterval =
        setInterval(() => {

            if (SAS_PREVIEW_STATE.isUserTouching) {

                return;

            }

            const maxScroll =
                sasPreviewContainer.scrollWidth -
                sasPreviewContainer.clientWidth;

            if (

                sasPreviewContainer.scrollLeft >=
                maxScroll - 10

            ) {

                sasPreviewContainer.scrollTo({

                    left: 0,
                    behavior: 'smooth'

                });

                return;

            }

            sasPreviewContainer.scrollBy({

                left: scrollAmount,
                behavior: 'smooth'

            });

        }, SAS_PREVIEW_CONFIG.SCROLL_INTERVAL_MS);

    registerSasPreviewListenersOnce();

}


/* =========================
   7. INIT
========================= */

async function loadSasPreview() {

    try {

        const products =
            await fetchSasPreviewProducts();

        if (products.length === 0) {

            // Todavía no hay productos SAS marcados en products.json:
            // ocultamos la sección entera (hero incluido) en vez de
            // mostrar un carrusel vacío.
            sasPreviewSection.style.display =
                'none';

            const heroEl =
                document.getElementById('sasHero');

            if (heroEl) heroEl.style.display = 'none';

            return;

        }

        sasPreviewSection.style.display =
            '';

        renderSasPreviewCards(
            products
        );

        startSasPreviewSlider();

    } catch (error) {

        console.error(
            'Error cargando SAS (preview):',
            error
        );

        sasPreviewSection.style.display =
            'none';

    }

}


loadSasPreview();
