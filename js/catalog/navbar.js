const header =
    document.getElementById('catalogHeader');


/* =========================
   CONFIG
========================= */

const maxScroll =
    180;

const compactThreshold =
    0.90;


/* =========================
   RAF STATE
========================= */

let ticking =
    false;


/* =========================
   UPDATE NAVBAR
========================= */

function updateNavbar() {

    const scrollY =
        window.scrollY;


    /* =========================
       PROGRESS
    ========================= */

    const progress =
        Math.min(
            scrollY / maxScroll,
            1
        );


    /* =========================
       UPDATE CSS VARIABLE
    ========================= */

    header.style.setProperty(
        '--compact-progress',
        progress
    );


    /* =========================
       COMPACT MODE
    ========================= */

    if (progress >= compactThreshold) {

        header.setAttribute(
            'data-compact',
            'true'
        );

    } else {

        header.removeAttribute(
            'data-compact'
        );

    }


    /* =========================
       ACTIVE STATE
    ========================= */

    if (scrollY > 8) {

        header.classList.add(
            'compact-active'
        );

    } else {

        header.classList.remove(
            'compact-active'
        );

    }


    /* =========================
       RESET RAF
    ========================= */

    ticking =
        false;

}


/* =========================
   SCROLL EVENT
========================= */

window.addEventListener(
    'scroll',
    () => {

        if (!ticking) {

            window.requestAnimationFrame(
                updateNavbar
            );

            ticking =
                true;

        }

    },
    {
        passive: true
    }
);


/* =========================
   INIT
========================= */

updateNavbar();