const header =
    document.getElementById('catalogHeader');


/* =========================
   LAST SCROLL
========================= */

let lastScroll =
    0;


/* =========================
   SCROLL EVENT
========================= */

window.addEventListener(
    'scroll',
    () => {

        const currentScroll =
            window.scrollY;


        /* =========================
           COMPACT MODE
        ========================= */

        if (currentScroll > 70) {

            header.classList.add(
                'compact-active'
            );

        } else {

            header.classList.remove(
                'compact-active'
            );

        }


        /* =========================
           HIDE / SHOW EFFECT
        ========================= */

        if (
            currentScroll > lastScroll &&
            currentScroll > 120
        ) {

            header.style.transform =
                'translateX(-50%) translateY(-12px)';

            header.style.opacity =
                '0.96';

        } else {

            header.style.transform =
                'translateX(-50%) translateY(0)';

            header.style.opacity =
                '1';

        }


        /* =========================
           UPDATE SCROLL
        ========================= */

        lastScroll =
            currentScroll;

    },
    {
        passive: true
    }
);