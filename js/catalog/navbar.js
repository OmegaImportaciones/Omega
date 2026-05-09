const header =
    document.getElementById('catalogHeader');


/* =========================
   CONFIG
========================= */

const compactOffset =
    80;


/* =========================
   UPDATE NAVBAR
========================= */

function updateNavbar() {

    const scrollY =
        window.scrollY;


    /* =========================
       COMPACT MODE
    ========================= */

    if (scrollY >= compactOffset) {

        header.classList.add(
            'compact-active'
        );

    } else {

        header.classList.remove(
            'compact-active'
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