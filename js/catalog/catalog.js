/* =========================
   CONTAINERS
========================= */

const promoContainer =
    document.getElementById(
        'promoContainer'
    );

const productsContainer =
    document.getElementById(
        'productsContainer'
    );


/* =========================
   PRODUCTS CACHE
========================= */

let allProducts = [];


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

    try {

        /* =========================
           LOAD INDEX
        ========================= */

        const indexResponse =
            await fetch(
                '../data/products.json'
            );

        const productFiles =
            await indexResponse.json();


        /* =========================
           LOAD FILES
        ========================= */

        const responses =
            await Promise.all(

                productFiles.map(file =>

                    fetch(
                        `../data/products/${file}`
                    ).then(response =>
                        response.json()
                    )

                )

            );


        /* =========================
           MERGE PRODUCTS
        ========================= */

        allProducts =
            responses.flat();


        /* =========================
           RENDER
        ========================= */

        renderPromos(allProducts);

        renderProducts(allProducts);


        /* =========================
           INIT PROMO SLIDER
        ========================= */

        initializePromoSlider();


        /* =========================
           INIT SEARCH
        ========================= */

        if (
            typeof initializeSearch ===
            'function'
        ) {

            initializeSearch(
                allProducts
            );

        }

    } catch (error) {

        console.error(
            'Error loading products:',
            error
        );

    }

}


/* =========================
   RENDER PROMOS
========================= */

function renderPromos(products) {

    /* =========================
       FILTER PROMOS
    ========================= */

    const promos =
        products.filter(product =>

            product.promoTag &&
            product.promoTag.trim() !== ''

        );


    /* =========================
       RANDOMIZE
    ========================= */

    const shuffledPromos =
        [...promos];

    shuffledPromos.sort(
        () => Math.random() - 0.5
    );


    /* =========================
       RENDER
    ========================= */

    promoContainer.innerHTML =
        shuffledPromos.map(product => `

            <a href="https://wa.me/59164216262?text=Hola,%20quiero%20información%20sobre%20${encodeURIComponent(product.whatsapp || product.name)}"
                target="_blank"
                rel="noopener noreferrer"
                class="promo-card">

                <img src="${product.image}"
                    alt="${product.name}"
                    class="promo-image"
                    loading="lazy">

                <div class="promo-info">

                    <span class="promo-tag">

                        ${product.promoTag}

                    </span>

                    <h3>

                        ${product.name}

                    </h3>

                    <p>

                        ${product.description}

                    </p>

                    <span class="promo-contact">

                        Consultar disponibilidad

                    </span>

                </div>

            </a>

        `).join('');

}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(products) {

    productsContainer.innerHTML =
        products.map(product => `

            <article class="main-button product-card"
                data-name="${product.name}">

                <img src="${product.image}"
                    alt="${product.name}"
                    class="product-image"
                    loading="lazy">

                <div class="product-content">

                    <h3>

                        ${product.name}

                    </h3>

                    <p>

                        ${product.description}

                    </p>

                    <span class="product-contact">

                        Consultar disponibilidad

                    </span>

                </div>

                <a href="https://wa.me/59164216262?text=Hola,%20quiero%20información%20sobre%20${encodeURIComponent(product.whatsapp || product.name)}"
                    target="_blank"
                    class="product-action">

                    Consultar

                </a>

            </article>

        `).join('');

}


/* =========================
   AUTO PROMO SLIDER
========================= */

function initializePromoSlider() {

    if (!promoContainer) return;


    /* =========================
       CONFIG
    ========================= */

    const scrollAmount =
        320;

    const intervalTime =
        10000;


    /* =========================
       AUTO SCROLL
    ========================= */

    setInterval(() => {

        const maxScroll =
            promoContainer.scrollWidth -
            promoContainer.clientWidth;


        /* =========================
           RESTART
        ========================= */

        if (

            promoContainer.scrollLeft >=
            maxScroll - 10

        ) {

            promoContainer.scrollTo({

                left: 0,
                behavior: 'smooth'

            });

            return;

        }


        /* =========================
           NEXT
        ========================= */

        promoContainer.scrollBy({

            left: scrollAmount,
            behavior: 'smooth'

        });

    }, intervalTime);

}


/* =========================
   INIT
========================= */

loadProducts();