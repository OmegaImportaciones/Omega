/* =========================
   ELEMENTS
========================= */

const heroSearchInput =
    document.querySelector(
        '.catalog-hero-search-input'
    );

const compactSearchInput =
    document.querySelector(
        '.catalog-compact-search-input'
    );

const promoSection =
    document.getElementById(
        'promoSection'
    );


/* =========================
   GLOBAL SEARCH STATE
========================= */

let currentSearch =
    '';


/* =========================
   NORMALIZE TEXT
========================= */

function normalizeText(text) {

    return (text || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

}


/* =========================
   APPLY SEARCH
========================= */

function applySearch(products) {

    const search =
        normalizeText(
            currentSearch
        );


    /* =========================
       FILTER PRODUCTS
    ========================= */

    const filteredProducts =
        products.filter(product => {

            const nombre =
                normalizeText(
                    product.producto
                );

            const codigo =
                normalizeText(
                    product.codigo
                );

            return (
                nombre.includes(search) ||
                codigo.includes(search)
            );

        });


    /* =========================
       RENDER PRODUCTS
    ========================= */

    renderProducts(
        filteredProducts
    );


    /* =========================
       SHOW / HIDE PROMOS
    ========================= */

    if (!promoSection) return;

    promoSection.style.display =
        search.length > 0
            ? 'none'
            : 'block';

}


/* =========================
   HANDLE INPUT
========================= */

function handleSearchInput(
    event,
    products
) {

    currentSearch =
        event.target.value;


    /* =========================
       SYNC INPUTS
    ========================= */

    heroSearchInput.value =
        currentSearch;

    compactSearchInput.value =
        currentSearch;


    /* =========================
       APPLY FILTER
    ========================= */

    applySearch(products);

}


/* =========================
   INITIALIZE SEARCH
========================= */

function initializeSearch(products) {

    heroSearchInput.addEventListener(
        'input',
        event => {

            handleSearchInput(
                event,
                products
            );

        }
    );


    compactSearchInput.addEventListener(
        'input',
        event => {

            handleSearchInput(
                event,
                products
            );

        }
    );

}