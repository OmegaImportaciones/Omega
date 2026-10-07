/* =========================================================
   PRODUCT — ficha dinámica: producto.html?id=2065
========================================================= */

(function () {

    const U = window.Omega.utils;

    const I = window.Omega.icons;

    const STORE = window.OMEGA_STORE;

    const Card = window.Omega.productCard;

    const root = document.getElementById('productRoot');

    const id = new URLSearchParams(location.search).get('id');


    function setMeta(product) {

        document.title = `${product._name} | ${STORE.NOMBRE}`;

        const desc = document.querySelector('meta[name="description"]');

        if (desc) desc.setAttribute('content', `${product._name} a ${U.money(product._price)}. Compra en ${STORE.NOMBRE}, tienda física en La Paz con delivery.`);

    }


    function gallery(product) {

        const images = product._images;

        if (!images.length) return `<div class="gallery"><div class="gallery-main pedestal"></div></div>`;

        return `
            <div class="gallery">
                <div class="gallery-main pedestal">
                    <img src="${U.escapeHTML(images[0])}" alt="${U.escapeHTML(product._name)}" data-main fetchpriority="high">
                </div>
                ${images.length > 1 ? `
                <div class="gallery-thumbs" role="group" aria-label="Fotos del producto">
                    ${images.map((src, i) => `
                        <button type="button" class="thumb" data-src="${U.escapeHTML(src)}" aria-pressed="${i === 0}" aria-label="Foto ${i + 1}">
                            <img src="${U.escapeHTML(src)}" alt="" loading="lazy">
                        </button>`).join('')}
                </div>` : ''}
            </div>`;

    }


    function perks() {

        return `
            <ul class="perks">
                <li>${I.pin}<div><strong>Recoge en tienda</strong><span>${STORE.DIRECCION}. ${STORE.HORARIO}.</span></div></li>
                <li>${I.truck}<div><strong>Delivery en La Paz y envíos nacionales</strong><span>Coordinamos costo y horario por WhatsApp.</span></div></li>
                <li>${I.qr}<div><strong>Paga con QR o transferencia</strong><span>Te enviamos los datos al confirmar tu pedido.</span></div></li>
                <li>${I.shield}<div><strong>Garantía Omega</strong><span>Consulta la cobertura de este producto por WhatsApp.</span></div></li>
            </ul>`;

    }


    function renderAvailable(product, catalog) {

        let qty = 1;

        const max = Math.min(Number(product.cantidad_disponible) || 1, STORE.MAX_POR_PRODUCTO);

        root.innerHTML = `
            <nav class="crumbs" aria-label="Ruta">
                <a href="${U.url('pages/catalogo.html')}">Tienda</a>
                <span aria-hidden="true">/</span>
                <a href="${U.url('pages/catalogo.html?cat=' + product._category.slug)}">${U.escapeHTML(product._category.label)}</a>
            </nav>

            <div class="product-layout">
                ${gallery(product)}

                <div class="product-info">
                    ${product._isNew ? '<span class="badge">Recién llegado</span>' : ''}
                    <h1 class="product-title">${U.escapeHTML(product._name)}</h1>
                    <p class="product-code">Código ${U.escapeHTML(product.codigo)}</p>

                    <div class="product-price">
                        ${Card.priceTag(product, 'large')}
                        ${product._discount ? `<span class="saving">Ahorras ${U.money(product._oldPrice - product._price)}</span>` : ''}
                    </div>

                    <p class="stock-line"><span class="dot"></span>Disponible en tienda</p>

                    <div class="buy-box">
                        <div class="stepper stepper--large" role="group" aria-label="Cantidad">
                            <button type="button" data-step="-1" aria-label="Quitar uno">${I.minus}</button>
                            <output aria-live="polite" data-qty>1</output>
                            <button type="button" data-step="1" aria-label="Agregar uno">${I.plus}</button>
                        </div>
                        <button type="button" class="button button--solid button--grow" data-add>${I.bag}<span>Agregar al pedido</span></button>
                    </div>

                    <a class="button button--whatsapp-outline button--block" target="_blank" rel="noopener" data-buy>
                        ${I.chat}<span>Comprar ahora por WhatsApp</span>
                    </a>

                    ${perks()}
                </div>
            </div>

            <section class="section" id="related" hidden>
                <div class="section-head">
                    <h2>Más en ${U.escapeHTML(product._category.label)}</h2>
                    <a class="section-link" href="${U.url('pages/catalogo.html?cat=' + product._category.slug)}">Ver todo</a>
                </div>
                <div class="rail"></div>
            </section>`;

        const qtyOut = root.querySelector('[data-qty]');

        const buy = root.querySelector('[data-buy]');

        const updateBuy = () => { buy.href = window.Omega.whatsapp.buyNow(product, qty); };

        updateBuy();

        root.querySelectorAll('[data-step]').forEach(button => {

            button.addEventListener('click', () => {
                qty = Math.max(1, Math.min(max, qty + Number(button.dataset.step)));
                qtyOut.textContent = qty;
                updateBuy();
            });

        });

        root.querySelector('[data-add]').addEventListener('click', () => {

            window.Omega.cart.add(product, qty);

            window.Omega.analytics.ecommerce('add_to_cart', [{ product, qty }], { item_list_name: 'ficha' });

            window.Omega.toast.show(`${qty} agregado${qty > 1 ? 's' : ''} a tu pedido`, 'Ver pedido', () => window.Omega.cartDrawer.open());

        });

        buy.addEventListener('click', () => {

            window.Omega.analytics.ecommerce('begin_checkout', [{ product, qty }], { checkout_type: 'compra_directa' });

            window.Omega.analytics.track('generate_lead', { currency: 'BOB', value: product._price * qty, lead_source: 'compra_directa' });

        });

        root.querySelectorAll('.thumb').forEach(thumb => {

            thumb.addEventListener('click', () => {
                root.querySelector('[data-main]').src = thumb.dataset.src;
                root.querySelectorAll('.thumb').forEach(t => t.setAttribute('aria-pressed', String(t === thumb)));
            });

        });

        const related = catalog.products
            .filter(p => p._category.slug === product._category.slug && p.id !== product.id)
            .slice(0, 10);

        if (related.length) {
            const section = document.getElementById('related');
            section.hidden = false;
            Card.renderInto(section.querySelector('.rail'), related, { list: 'relacionados' });
        }

        window.Omega.analytics.ecommerce('view_item', [product]);

    }


    function renderUnavailable(product) {

        root.innerHTML = `
            <div class="product-layout">
                ${gallery(product)}
                <div class="product-info">
                    <span class="badge badge--muted">Agotado por ahora</span>
                    <h1 class="product-title">${U.escapeHTML(product._name)}</h1>
                    <p class="product-code">Código ${U.escapeHTML(product.codigo)}</p>
                    <p class="lead">Este producto se agotó. Escríbenos y te avisamos apenas vuelva a llegar.</p>
                    <a class="button button--whatsapp button--block" target="_blank" rel="noopener" href="${window.Omega.whatsapp.notifyMe(product)}" data-track="notify_me">
                        ${I.chat}<span>Avísame cuando llegue</span>
                    </a>
                    <a class="button button--ghost button--block" href="${U.url('pages/catalogo.html?cat=' + product._category.slug)}">Ver ${U.escapeHTML(product._category.label.toLowerCase())} disponibles</a>
                </div>
            </div>`;

        document.title = `${product._name} | ${STORE.NOMBRE}`;

    }


    function renderMissing() {

        root.innerHTML = `
            <div class="empty-state empty-state--wide">
                <p><strong>No encontramos este producto.</strong></p>
                <p>Puede que el enlace sea antiguo. Búscalo en la tienda o pregúntanos por WhatsApp.</p>
                <a class="button button--solid" href="${U.url('pages/catalogo.html')}">Ir a la tienda</a>
            </div>`;

    }


    async function init() {

        try {

            const catalog = await window.Omega.catalog.load();

            const product = catalog.byId.get(String(id));

            if (product) { setMeta(product); renderAvailable(product, catalog); return; }

            const ghost = catalog.allById.get(String(id));

            if (ghost) renderUnavailable(ghost);
            else renderMissing();

        } catch (error) {

            console.error(error);

            root.innerHTML = '<p class="notice">No pudimos cargar el producto. Revisa tu conexión y recarga la página.</p>';

        }

    }


    init();

})();
