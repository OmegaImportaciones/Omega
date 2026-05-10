/* =========================
   CONTAINERS
========================= */

const flashSection =
    document.getElementById(
        'flashSection'
    );

const flashContainer =
    document.getElementById(
        'flashContainer'
    );


/* =========================
   SLIDER STATE
========================= */

let flashSliderInterval =
    null;

let isUserTouching =
    false;


/* =========================
   LOAD FLASH OFFERS
========================= */

async function loadFlashOffers() {

    try {

        /* =========================
           LOAD JSON
        ========================= */

        const response =
            await fetch(
                './data/oferta_flash.json'
            );

        const products =
            await response.json();


        /* =========================
           EMPTY STATE
        ========================= */

        if (
            !products ||
            products.length === 0
        ) {

            flashSection.style.display =
                'none';

            return;

        }


        /* =========================
           RANDOMIZE
        ========================= */

        const shuffledProducts =
            [...products];

        shuffledProducts.sort(
            () => Math.random() - 0.5
        );


        /* =========================
           LIMIT
        ========================= */

        const visibleProducts =
            shuffledProducts.slice(0, 5);


        /* =========================
           RENDER
        ========================= */

        flashContainer.innerHTML =
            visibleProducts.map(product => `

                <a href="https://wa.me/59164216262?text=${encodeURIComponent(

                `Hola, quiero información sobre:

${product.whatsapp || product.name}

Precio oferta flash:
${product.price}

Vi esta oferta en su página web.`

            )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flash-card">

                    <img src="${product.image}"
                        alt="${product.name}"
                        class="flash-image"
                        loading="lazy">

                    <div class="flash-info">

                        <span class="flash-tag">

                            ${product.promoTag || '⚡ Oferta Flash'}

                        </span>

                        <h3>

                            ${product.name}

                        </h3>

                        <p>

                            ${product.description || ''}

                        </p>

                        <div class="flash-prices">

                            ${product.oldPrice ? `

                                <span class="flash-old-price">

                                    ${product.oldPrice}

                                </span>

                            ` : ''}

                            <span class="flash-price">

                                ${product.price || ''}

                            </span>

                        </div>

                        <span class="flash-contact">

                            Consultar disponibilidad

                        </span>

                    </div>

                </a>

            `).join('');


        /* =========================
           INIT SLIDER
        ========================= */

        initializeFlashSlider();

    } catch (error) {

        console.error(
            'Error loading flash offers:',
            error
        );

        flashSection.style.display =
            'none';

    }

}


/* =========================
   AUTO FLASH SLIDER
========================= */

function initializeFlashSlider() {

    if (!flashContainer) return;


    /* =========================
       FIRST CARD
    ========================= */

    const firstCard =
        flashContainer.querySelector(
            '.flash-card'
        );


    if (!firstCard) return;


    /* =========================
       SCROLL AMOUNT
    ========================= */

    const scrollAmount =
        firstCard.offsetWidth + 12;


    /* =========================
       CONFIG
    ========================= */

    const intervalTime =
        10000;


    /* =========================
       CLEAR OLD INTERVAL
    ========================= */

    clearInterval(
        flashSliderInterval
    );


    /* =========================
       AUTO SCROLL
    ========================= */

    flashSliderInterval =
        setInterval(() => {

            /* =========================
               USER TOUCHING
            ========================= */

            if (isUserTouching) {

                return;

            }


            const maxScroll =
                flashContainer.scrollWidth -
                flashContainer.clientWidth;


            /* =========================
               RESTART
            ========================= */

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


            /* =========================
               NEXT
            ========================= */

            flashContainer.scrollBy({

                left: scrollAmount,
                behavior: 'smooth'

            });

        }, intervalTime);


    /* =========================
       TOUCH START
    ========================= */

    flashContainer.addEventListener(
        'touchstart',
        () => {

            isUserTouching =
                true;

        },
        { passive: true }
    );


    /* =========================
       TOUCH END
    ========================= */

    flashContainer.addEventListener(
        'touchend',
        () => {

            setTimeout(() => {

                isUserTouching =
                    false;

            }, 1500);

        },
        { passive: true }
    );

}


/* =========================
   INIT
========================= */

loadFlashOffers();