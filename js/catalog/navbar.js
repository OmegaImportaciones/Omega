const header =
    document.getElementById('catalogHeader');


/* =========================
   SCROLL ANIMATION
========================= */

window.addEventListener('scroll', () => {

    const scrollY =
        window.scrollY;

    const maxScroll =
        180;


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

    if (progress >= 0.55) {

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
       OPTIONAL ACTIVE STATE
    ========================= */

    if (scrollY > 10) {

        header.classList.add(
            'compact-active'
        );

    } else {

        header.classList.remove(
            'compact-active'
        );

    }

});