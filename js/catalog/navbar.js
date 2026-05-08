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
       OPTIONAL SHADOW STATE
    ========================= */

    if (scrollY > 10) {

        header.classList.add('compact-active');

    } else {

        header.classList.remove('compact-active');

    }

});