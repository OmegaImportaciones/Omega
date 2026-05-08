const header =
    document.getElementById('catalogHeader');


/* =========================
   SCROLL EVENT
========================= */

window.addEventListener(
    'scroll',
    () => {

        const scrollY =
            window.scrollY;


        /* =========================
           ACTIVATE
        ========================= */

        if (scrollY > 80) {

            header.classList.add(
                'compact-active'
            );

        } else {

            header.classList.remove(
                'compact-active'
            );

        }

    },
    {
        passive: true
    }
);