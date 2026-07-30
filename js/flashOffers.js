/* =========================================================
   FLASH OFFERS — DINÁMICO, DETERMINÍSTICO Y SINCRONIZADO
   Fuente de datos única: products.json (misma que el catálogo)
========================================================= */


/* =========================
   1. DOM & CONFIG
========================= */

const flashSection =
    document.getElementById(
        'flashSection'
    );

const flashContainer =
    document.getElementById(
        'flashContainer'
    );

const CONFIG = {

    PRODUCTS_URL:
        './data/products.json',

    TOTAL_OFFERS:
        10,

    ROTATION_MS:
        4 * 60 * 60 * 1000, // 4 horas

    SCROLL_INTERVAL_MS:
        10000,

    WHATSAPP_NUMBER:
        '59164216262'

};


/* =========================
   2. STATE
========================= */

const STATE = {

    currentOffers:
        [],

    sliderInterval:
        null,

    rotationTimeout:
        null,

    isUserTouching:
        false,

    listenersRegistered:
        false

};


/* =========================
   3. DATA LAYER
========================= */

async function fetchProducts() {

    const response =
        await fetch(
            CONFIG.PRODUCTS_URL
        );

    if (!response.ok) {

        throw new Error(
            'No se pudo obtener products.json'
        );

    }

    return await response.json();

}


function filterAvailableProducts(products) {

    if (!Array.isArray(products)) {

        return [];

    }

    return products.filter(product =>

        product.estado === 1 &&
        product.cantidad_disponible > 0

    );

}


/* =========================
   4. RANDOM ENGINE
   (Seeded Shuffle determinístico,
   la semilla depende del bloque horario)
========================= */

function mulberry32(seed) {

    return function () {

        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;

        let t =
            Math.imul(
                seed ^ seed >>> 15,
                1 | seed
            );

        t =
            t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;

        return (
            (t ^ t >>> 14) >>> 0
        ) / 4294967296;

    };

}


function getCurrentBlockSeed() {

    return Math.floor(
        Date.now() / CONFIG.ROTATION_MS
    );

}


function seededShuffle(array, seed) {

    const result =
        [...array];

    const random =
        mulberry32(seed);

    for (let i = result.length - 1; i > 0; i--) {

        const j =
            Math.floor(
                random() * (i + 1)
            );

        [result[i], result[j]] =
            [result[j], result[i]];

    }

    return result;

}


function selectFlashOffers(products) {

    const seed =
        getCurrentBlockSeed();

    const shuffled =
        seededShuffle(products, seed);

    return shuffled.slice(
        0,
        CONFIG.TOTAL_OFFERS
    );

}


/* =========================
   5. CARD BUILDER
========================= */

function buildWhatsAppLink(product) {

    const nombreParaMensaje =
        product.whatsapp || product.producto;

    const mensaje =

        `Hola, quiero información sobre:

${nombreParaMensaje}

Precio Oferta Flash:
Bs. ${product.precio5}

Vi esta Oferta en su página web.
¿Sigue disponible?`;

    return (
        `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
    );

}


function buildFlashCard(product) {

    const card =
        document.createElement('a');

    card.href =
        buildWhatsAppLink(product);

    card.target =
        '_blank';

    card.rel =
        'noopener noreferrer';

    card.className =
        'flash-card';

    card.innerHTML = `

        <img src="${product.imagen}"
            alt="${product.producto}"
            class="flash-image"
            loading="lazy">

        <div class="flash-info">

            <span class="flash-tag">
                ⚡ Oferta Flash
            </span>

            <h3>
                ${product.producto}
            </h3>

            <div class="flash-prices">

                <span class="flash-old-price">
                    Bs. ${product.precio1}
                </span>

                <span class="flash-price">
                    Bs. ${product.precio5}
                </span>

            </div>

            <span class="flash-contact">
                Consultar disponibilidad
            </span>

        </div>

    `;

    return card;

}


/* =========================
   6. RENDER
========================= */

function renderFlashCards(products) {

    flashContainer.innerHTML =
        '';

    const fragment =
        document.createDocumentFragment();

    products.forEach(product => {

        fragment.appendChild(
            buildFlashCard(product)
        );

    });

    flashContainer.appendChild(
        fragment
    );

}


/* =========================
   7. SLIDER
========================= */

function registerSliderListenersOnce() {

    if (STATE.listenersRegistered) {

        return;

    }

    flashContainer.addEventListener(
        'touchstart',
        () => {

            STATE.isUserTouching =
                true;

        },
        { passive: true }
    );

    flashContainer.addEventListener(
        'touchend',
        () => {

            setTimeout(() => {

                STATE.isUserTouching =
                    false;

            }, 1500);

        },
        { passive: true }
    );

    STATE.listenersRegistered =
        true;

}


function startFlashSlider() {

    if (!flashContainer) return;

    const firstCard =
        flashContainer.querySelector(
            '.flash-card'
        );

    if (!firstCard) return;

    const scrollAmount =
        firstCard.offsetWidth + 12;

    /* =========================
       UNA ÚNICA INSTANCIA DE INTERVALO
    ========================= */

    clearInterval(
        STATE.sliderInterval
    );

    STATE.sliderInterval =
        setInterval(() => {

            if (STATE.isUserTouching) {

                return;

            }

            const maxScroll =
                flashContainer.scrollWidth -
                flashContainer.clientWidth;

            if (

                flashContainer.scrollLeft >=
                maxScroll - 10

            ) {

                flashContainer.scrollTo({

                    left: 0,
                    behavior: 'smooth'

                });

                return;

            }

            flashContainer.scrollBy({

                left: scrollAmount,
                behavior: 'smooth'

            });

        }, CONFIG.SCROLL_INTERVAL_MS);

    /* =========================
       LISTENERS TÁCTILES UNA SOLA VEZ
    ========================= */

    registerSliderListenersOnce();

}


/* =========================
   8. PUBLIC API
========================= */

async function loadFlashOffers() {

    try {

        const products =
            await fetchProducts();

        const availableProducts =
            filterAvailableProducts(products);

        if (availableProducts.length === 0) {

            flashSection.style.display =
                'none';

            return;

        }

        STATE.currentOffers =
            selectFlashOffers(availableProducts);

        flashSection.style.display =
            '';

        renderFlashCards(
            STATE.currentOffers
        );

        startFlashSlider();

    } catch (error) {

        console.error(
            'Error cargando Ofertas Flash:',
            error
        );

        flashSection.style.display =
            'none';

    }

}


function getMsUntilNextRotation() {

    const now =
        Date.now();

    return (
        CONFIG.ROTATION_MS -
        (now % CONFIG.ROTATION_MS)
    );

}


function scheduleNextRotation() {

    clearTimeout(
        STATE.rotationTimeout
    );

    STATE.rotationTimeout =
        setTimeout(async () => {

            await loadFlashOffers();

            scheduleNextRotation();

        }, getMsUntilNextRotation());

}


const FlashOffers = {

    init: async function () {

        await loadFlashOffers();

        scheduleNextRotation();

    },

    refresh:
        loadFlashOffers

};


window.FlashOffers =
    FlashOffers;


/* =========================
   INIT
========================= */

FlashOffers.init();
