/* =========================================================
   SHELL — encabezado, pie, barra de pedido y aviso de
   navegador de TikTok. Se inyecta en todas las páginas
   para editar en un solo lugar.
========================================================= */

(function () {

    const U = window.Omega.utils;

    const I = window.Omega.icons;

    const STORE = window.OMEGA_STORE;

    const page = document.body.dataset.page || '';


    function header() {

        const query = new URLSearchParams(location.search).get('q') || '';

        return U.el(`
            <header class="site-header">
                <div class="header-inner">
                    <a class="brand" href="${U.url('index.html')}" aria-label="${STORE.NOMBRE}, inicio">
                        ${I.mark}
                        <span class="brand-word">Omega<small>Importaciones</small></span>
                    </a>

                    <form class="header-search" role="search" action="${U.url('pages/catalogo.html')}">
                        <label class="visually-hidden" for="headerSearch">Buscar productos</label>
                        ${I.search}
                        <input id="headerSearch" name="q" type="search" placeholder="Buscar audífonos, cargadores, cámaras…" value="${U.escapeHTML(page === 'shop' ? query : '')}" autocomplete="off" enterkeyhint="search">
                    </form>

                    <nav class="header-nav" aria-label="Principal">
                        <a href="${U.url('pages/catalogo.html')}" ${page === 'shop' ? 'aria-current="page"' : ''}>Tienda</a>
                        <a href="${U.url('pages/ubicacion.html')}" ${page === 'location' ? 'aria-current="page"' : ''}>Visítanos</a>
                    </nav>

                    <div class="header-actions">
                        <button type="button" class="icon-button" data-theme-toggle></button>
                        <button type="button" class="cart-button" data-open-cart aria-label="Abrir mi pedido">
                            ${I.bag}
                            <span class="cart-count" data-cart-count hidden>0</span>
                        </button>
                    </div>
                </div>
            </header>`);

    }


    function footer() {

        return U.el(`
            <footer class="site-footer">
                <div class="footer-inner">
                    <div class="footer-brand">
                        ${I.mark}
                        <p><strong>${STORE.NOMBRE}</strong><br>Tecnología importada con tienda física en La Paz.</p>
                    </div>
                    <div class="footer-col">
                        <h2>Tienda</h2>
                        <p>${STORE.DIRECCION}</p>
                        <p>${STORE.HORARIO}</p>
                        <a href="${STORE.MAPS_URL}" target="_blank" rel="noopener">Cómo llegar</a>
                    </div>
                    <div class="footer-col">
                        <h2>Contacto</h2>
                        <a href="${window.Omega.whatsapp.general()}" target="_blank" rel="noopener" data-track="click_whatsapp">WhatsApp</a>
                        <a href="${STORE.TIKTOK_URL}" target="_blank" rel="noopener" data-track="click_tiktok">TikTok</a>
                        <a href="${STORE.FACEBOOK_URL}" target="_blank" rel="noopener" data-track="click_facebook">Facebook</a>
                    </div>
                </div>
                <p class="footer-note">Precios en bolivianos. Disponibilidad sujeta a confirmación por WhatsApp.</p>
            </footer>`);

    }


    // Barra fija inferior (móvil) cuando hay productos en el pedido
    function orderBar() {

        return U.el(`
            <button type="button" class="order-bar" data-open-cart hidden>
                <span class="order-bar-count" data-cart-count>0</span>
                <span>Ver mi pedido</span>
                <strong data-cart-total></strong>
            </button>`);

    }


    function inAppNotice() {

        if (!/TikTok|musical_ly|Bytedance|FBAN|FBAV|Instagram/i.test(navigator.userAgent)) return null;

        const notice = U.el(`
            <div class="inapp-notice" role="note">
                <p>Estás en el navegador de la app. Para no perder tu pedido, ábrelo en tu navegador.</p>
                <button type="button" class="button button--small">${I.link}<span>Copiar enlace</span></button>
            </div>`);

        notice.querySelector('button').addEventListener('click', async () => {

            try { await navigator.clipboard.writeText(location.href); } catch (e) { /* sin permiso */ }

            notice.querySelector('p').textContent = 'Enlace copiado. Toca ⋯ arriba a la derecha y elige "Abrir en navegador".';

            window.Omega.analytics.track('click_open_browser', { page });

        });

        return notice;

    }


    async function refreshCount() {

        const count = window.Omega.cart.count();

        document.querySelectorAll('[data-cart-count]').forEach(node => {
            node.textContent = count;
            node.hidden = count === 0;
        });

        const bar = document.querySelector('.order-bar');

        if (!bar) return;

        bar.hidden = count === 0;

        if (count > 0) {

            try {

                const catalog = await window.Omega.catalog.load();

                bar.querySelector('[data-cart-total]').textContent = U.money(window.Omega.cart.resolve(catalog).total);

            } catch (e) { /* sin catálogo aún */ }

        }

    }


    function mount() {

        const notice = inAppNotice();

        document.body.prepend(header());

        if (notice) document.body.prepend(notice);

        document.body.appendChild(footer());

        document.body.appendChild(orderBar());

        window.Omega.theme.bind(document.querySelector('[data-theme-toggle]'));

        document.addEventListener('click', event => {

            if (event.target.closest('[data-open-cart]')) window.Omega.cartDrawer.open();

            const tracked = event.target.closest('[data-track]');

            if (tracked) window.Omega.analytics.track(tracked.dataset.track, { page });

        });

        const form = document.querySelector('.header-search');

        form.addEventListener('submit', event => {

            const value = form.q.value.trim();

            if (!value) { event.preventDefault(); return; }

            window.Omega.analytics.track('search', { search_term: value, page });

            // En la tienda, la búsqueda se aplica sin recargar
            if (page === 'shop' && window.Omega.shopPage) {
                event.preventDefault();
                window.Omega.shopPage.setQuery(value);
            }

        });

        if (page === 'shop') {
            form.q.addEventListener('input', () => window.Omega.shopPage && window.Omega.shopPage.setQuery(form.q.value, true));
        }

        window.addEventListener('omega:cart', refreshCount);

        window.addEventListener('storage', refreshCount);

        refreshCount();

    }


    mount();

})();
