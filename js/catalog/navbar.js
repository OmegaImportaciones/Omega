const header =
    document.getElementById('catalogHeader');


/* =========================
   CONFIG
========================= */

const maxScroll =
    160;


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

    if (scrollY >= 140) {

        header.setAttribute(
            'data-compact',
            'true'
        );

    } else {

        header.removeAttribute(
            'data-compact'
        );

    }

}


/* =========================
   SCROLL EVENT
========================= */

window.addEventListener(
    'scroll',
    updateNavbar,
    {
        passive: true
    }
);


/* =========================
   INIT
========================= */

updateNavbar();