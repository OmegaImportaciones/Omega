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

    return text
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

            const name =
                normalizeText(
                    product.name
                );

            const description =
                normalizeText(
                    product.description
                );

            return (
                name.includes(search) ||
                description.includes(search)
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

    if (search.length > 0) {

        promoSection.style.display =
            'none';

    } else {

        promoSection.style.display =
            'block';

    }

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