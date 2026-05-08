/* =========================
   ELEMENTS
========================= */

const searchInput =
    document.getElementById('searchInput');

const promoSection =
    document.getElementById('promoSection');


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
   INITIALIZE SEARCH
========================= */

function initializeSearch(products) {

    searchInput.addEventListener('input', () => {

        const search =
            normalizeText(
                searchInput.value
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
           RE-RENDER PRODUCTS
        ========================= */

        renderProducts(filteredProducts);


        /* =========================
           SHOW/HIDE PROMOS
        ========================= */

        if (search.length > 0) {

            promoSection.style.display =
                'none';

        } else {

            promoSection.style.display =
                'block';

        }

    });

}