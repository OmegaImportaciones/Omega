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


    // Pestañas principales. "page" = data-page del <body>
    const TABS = [
        { page: 'home', label: 'Inicio', href: 'index.html' },
        { page: 'sas', label: 'Productos SAS', href: 'pages/sas.html' },
        { page: 'shop', label: 'Catálogo Omega', href: 'pages/catalogo.html' },
        { page: 'warranty', label: 'Garantía', href: 'pages/garantia.html' },
        { page: 'location', label: 'Visítanos', href: 'pages/ubicacion.html' }
    ];


    function tabs(className) {

        return `
            <nav class="${className}" aria-label="Principal">
                ${TABS.map(t => `<a href="${U.url(t.href)}" ${page === t.page ? 'aria-current="page"' : ''}${t.page === 'sas' ? ' class="tab-sas"' : ''}>${t.page === 'sas' ? I.sas : ''}${t.label}</a>`).join('')}
            </nav>`;

    }


    function header() {

        const query = new URLSearchParams(location.search).get('q') || '';

        const searchesHere = page === 'shop' || page === 'sas';

        const searchAction = page === 'sas' ? 'pages/sas.html' : 'pages/catalogo.html';

        const placeholder = page === 'sas' ? 'Buscar en SAS: HDMI, UTP, conversor…' : 'Buscar cables, audífonos, cargadores…';

        return U.el(`
            <header class="site-header">
                <div class="header-inner">
                    <a class="brand" href="${U.url('index.html')}" aria-label="${STORE.NOMBRE}, inicio">
                        ${I.mark}
                        <span class="brand-word">Omega<small>Importaciones</small></span>
                    </a>

                    <form class="header-search" role="search" action="${U.url(searchAction)}">
                        <label class="visually-hidden" for="headerSearch">Buscar productos</label>
                        ${I.search}
                        <input id="headerSearch" name="q" type="search" placeholder="${placeholder}" value="${U.escapeHTML(searchesHere ? query : '')}" autocomplete="off" enterkeyhint="search">
                    </form>

                    ${tabs('header-nav')}

                    <div class="header-actions">
                        <button type="button" class="cart-button" data-open-cart aria-label="Abrir mi pedido">
                            ${I.bag}
                            <span class="cart-count" data-cart-count hidden>0</span>
                        </button>
                    </div>
                </div>
                ${tabs('tab-bar')}
            </header>`);

    }


    function footer() {

        const SAS = window.OMEGA_SAS;

        return U.el(`
            <footer class="site-footer">
                <div class="footer-inner">
                    <div class="footer-brand">
                        <div class="footer-lockup">
                            ${I.sas}
                            <span class="footer-x" aria-hidden="true">×</span>
                            ${I.mark}
                        </div>
                        <p><strong>SAS · ${SAS.LEMA}</strong><br>${STORE.NOMBRE}, socio estratégico de SAS. Tienda de tecnología con local en La Paz.</p>
                    </div>
                    <div class="footer-col">
                        <h2>SAS</h2>
                        <a href="${U.url('pages/sas.html')}">Productos SAS</a>
                        <a href="${U.url('pages/garantia.html')}">Garantía de ${SAS.GARANTIA_ANIOS} años</a>
                        <a href="${U.url('pages/catalogo.html')}">Catálogo Omega</a>
                    </div>
                    <div class="footer-col">
                        <h2>Tienda Omega</h2>
                        <p>${STORE.DIRECCION}</p>
                        <p>${STORE.HORARIO}</p>
                        <a href="${STORE.MAPS_URL}" target="_blank" rel="noopener" data-track="click_maps">Cómo llegar</a>
                    </div>
                    <div class="footer-col">
                        <h2>Contacto</h2>
                        <a href="${window.Omega.whatsapp.general()}" target="_blank" rel="noopener" data-track="click_whatsapp">WhatsApp</a>
                        <a href="${STORE.TIKTOK_URL}" target="_blank" rel="noopener" data-track="click_tiktok">TikTok</a>
                        <a href="${STORE.FACEBOOK_URL}" target="_blank" rel="noopener" data-track="click_facebook">Facebook</a>
                    </div>
                </div>
                <p class="footer-note">Precios en bolivianos. Disponibilidad sujeta a confirmación por WhatsApp. Garantía SAS según las condiciones de cada producto.</p>
            </footer>`);

    }


    // Botón flotante de WhatsApp (escritorio y móvil sin pedido)
    function whatsappFab() {

        return U.el(`
            <a class="wa-fab" href="${window.Omega.whatsapp.general()}" target="_blank" rel="noopener" data-track="click_whatsapp_fab" aria-label="Escribir por WhatsApp">
                ${I.chat}<span>WhatsApp</span>
            </a>`);

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

        document.body.classList.toggle('has-order', count > 0);

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

        document.body.appendChild(whatsappFab());

        // En móvil, deja visible la pestaña de la página actual
        const bar = document.querySelector('.tab-bar');

        const current = bar && bar.querySelector('[aria-current="page"]');

        if (current) bar.scrollLeft = current.offsetLeft - (bar.clientWidth - current.offsetWidth) / 2;

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
            if ((page === 'shop' || page === 'sas') && window.Omega.shopPage) {
                event.preventDefault();
                window.Omega.shopPage.setQuery(value);
            }

        });

        if (page === 'shop' || page === 'sas') {
            form.q.addEventListener('input', () => window.Omega.shopPage && window.Omega.shopPage.setQuery(form.q.value, true));
        }

        window.addEventListener('omega:cart', refreshCount);

        window.addEventListener('storage', refreshCount);

        refreshCount();

    }


    mount();

})();
