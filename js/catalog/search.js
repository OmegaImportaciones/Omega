const searchInput =
    document.getElementById('searchInput');

const productCards =
    document.querySelectorAll('.product-card');

const promoSection =
    document.querySelector('.promo-slider');


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
   SEARCH PRODUCTS
========================= */

searchInput.addEventListener('input', () => {

    const search =
        normalizeText(searchInput.value);

    let hasSearch =
        search.length > 0;


    productCards.forEach(card => {

        const productName =
            normalizeText(
                card.dataset.name
            );

        const isVisible =
            productName.includes(search);


        card.style.display =
            isVisible
                ? 'flex'
                : 'none';

    });


    /* =========================
       HIDE PROMOS ON SEARCH
    ========================= */

    if (promoSection) {

        promoSection.parentElement.style.display =
            hasSearch
                ? 'none'
                : 'block';

    }

});