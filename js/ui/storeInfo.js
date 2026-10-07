/* =========================================================
   STORE INFO — rellena datos de la tienda e íconos en HTML
   estático (data-store-*, data-icon) desde store.config.js
========================================================= */

(function () {

    const STORE = window.OMEGA_STORE;

    const fill = (selector, apply) => document.querySelectorAll(selector).forEach(apply);

    fill('[data-store-address]', n => { n.textContent = STORE.DIRECCION; });

    fill('[data-store-hours]', n => { n.textContent = STORE.HORARIO; });

    fill('[data-store-maps]', n => { n.href = STORE.MAPS_URL; n.dataset.track = 'click_maps'; });

    fill('[data-store-tiktok]', n => { n.href = STORE.TIKTOK_GUIA_URL; n.dataset.track = 'click_tiktok_guia'; });

    fill('[data-store-whatsapp]', n => {
        n.href = window.Omega.whatsapp.general(`Hola ${STORE.NOMBRE}, quiero información sobre la tienda.`);
        n.dataset.track = 'click_whatsapp';
    });

    fill('[data-icon]', n => { n.innerHTML = window.Omega.icons[n.dataset.icon] || ''; });

})();
