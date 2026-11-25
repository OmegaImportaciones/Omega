/* =========================================================
   CART DRAWER — panel "Mi pedido" y envío por WhatsApp
========================================================= */

(function () {

    const U = window.Omega.utils;

    const I = window.Omega.icons;

    let drawer = null;

    let lastFocus = null;


    function build() {

        drawer = U.el(`
            <div class="drawer" aria-hidden="true">
                <div class="drawer-backdrop" data-close></div>
                <aside class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawerTitle" tabindex="-1">
                    <header class="drawer-head">
                        <h2 id="drawerTitle">Mi pedido</h2>
                        <button type="button" class="icon-button" data-close aria-label="Cerrar pedido">${I.close}</button>
                    </header>
                    <div class="drawer-body"></div>
                    <footer class="drawer-foot"></footer>
                </aside>
            </div>`);

        document.body.appendChild(drawer);

        drawer.addEventListener('click', event => {
            if (event.target.closest('[data-close]')) close();
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && drawer.classList.contains('is-open')) close();
        });

        window.addEventListener('omega:cart', () => {
            if (drawer.classList.contains('is-open')) paint();
        });

    }


    async function paint() {

        const body = drawer.querySelector('.drawer-body');

        const foot = drawer.querySelector('.drawer-foot');

        const catalog = await window.Omega.catalog.load();

        const { lines, removed, total, saving } = window.Omega.cart.resolve(catalog);

        const W = window.Omega.wholesale;

        const notice = removed.length
            ? `<p class="notice">Ya no tenemos disponible: ${removed.map(U.escapeHTML).join(', ')}. Lo quitamos de tu pedido.</p>`
            : '';

        if (lines.length === 0) {

            body.innerHTML = `
                ${notice}
                <div class="empty-state">
                    <div class="empty-bag">${I.bag}</div>
                    <p><strong>Tu pedido está vacío.</strong></p>
                    <p>Agrega productos desde la tienda y envíalos juntos en un solo mensaje.</p>
                </div>`;

            foot.innerHTML = `<a class="button button--solid button--block" href="${U.url("pages/sas.html")}">Ver productos SAS</a>${accessLink()}`;

            return;

        }

        body.innerHTML = notice;

        const list = document.createElement('ul');

        list.className = 'cart-lines';

        lines.forEach(line => list.appendChild(renderLine(line)));

        body.appendChild(list);

        const isWholesale = W && W.isActive();

        foot.innerHTML = `
            ${saving > 0 ? `<p class="cart-saving">Ahorras ${U.money(saving)} con precio por mayor</p>` : ''}
            <div class="cart-total">
                <span>Total${isWholesale ? ' <small class="cart-kind">Pedido mayorista</small>' : ''}</span>
                <strong>${U.money(total)}</strong>
            </div>
            <p class="cart-hint">Te confirmamos disponibilidad por WhatsApp y coordinamos pago (QR o transferencia) y entrega.</p>
            <a class="button button--whatsapp button--block" target="_blank" rel="noopener" data-send>
                ${I.chat}<span>Enviar pedido por WhatsApp</span>
            </a>
            <button type="button" class="text-button" data-clear>Vaciar pedido</button>
            ${accessLink()}`;

        const send = foot.querySelector('[data-send]');

        const code = window.Omega.whatsapp.orderCode();

        send.href = window.Omega.whatsapp.order(lines, total, code);

        send.addEventListener('click', () => {

            window.Omega.analytics.ecommerce('begin_checkout', lines, { order_code: code });

            window.Omega.analytics.track('generate_lead', { currency: 'BOB', value: total, order_code: code, lead_source: 'pedido_web' });

        });

        foot.querySelector('[data-clear]').addEventListener('click', () => {

            window.Omega.cart.clear();

            window.Omega.toast.show('Pedido vaciado');

        });

    }


    // Acceso discreto al modo mayorista (solo si no está activo)
    function accessLink() {

        const W = window.Omega.wholesale;

        if (!W || !W.isEnabled() || W.isActive()) return '';

        return `<button type="button" class="text-button text-button--quiet" data-wholesale-open>${U.escapeHTML(W.config.TEXTO_ACCESO)}</button>`;

    }


    function unitText(line) {

        const p = line.product;

        if (line.wholesale) {
            return `<s>${U.money(p._price)}</s> ${U.money(line.unit)} c/u · por mayor`;
        }

        return `${U.money(line.unit)} c/u`;

    }


    function missingHint(line) {

        if (!line.missing) return '';

        const info = window.Omega.wholesale.infoOf(line.product);

        return `<span class="cart-wholesale-hint">Agrega ${line.missing} más y pagas ${U.money(info.price)} c/u</span>`;

    }


    function renderLine(line) {

        const p = line.product;

        const item = U.el(`
            <li class="cart-line">
                <a class="cart-thumb" href="${window.Omega.productCard.productHref(p)}">
                    ${p._images[0] ? `<img src="${U.escapeHTML(p._images[0])}" alt="" loading="lazy">` : ''}
                </a>
                <div class="cart-info">
                    <a class="cart-name" href="${window.Omega.productCard.productHref(p)}">${U.escapeHTML(p._name)}</a>
                    <span class="cart-unit${line.wholesale ? ' is-wholesale' : ''}">${unitText(line)}</span>
                    ${missingHint(line)}
                    <div class="stepper" role="group" aria-label="Cantidad">
                        <button type="button" data-step="-1" aria-label="Quitar uno">${line.qty === 1 ? I.trash : I.minus}</button>
                        <output aria-live="polite">${line.qty}</output>
                        <button type="button" data-step="1" aria-label="Agregar uno">${I.plus}</button>
                    </div>
                </div>
                <strong class="cart-subtotal">${U.money(line.subtotal)}</strong>
            </li>`);

        item.querySelectorAll('[data-step]').forEach(button => {

            button.addEventListener('click', () => {

                const step = Number(button.dataset.step);

                const next = line.qty + step;

                window.Omega.cart.setQty(p, next);

                if (next <= 0) {
                    window.Omega.analytics.ecommerce('remove_from_cart', [{ product: p, qty: line.qty, unit: line.unit }]);
                } else if (step > 0) {
                    window.Omega.analytics.ecommerce('add_to_cart', [{ product: p, qty: 1 }], { item_list_name: 'pedido' });
                }

            });

        });

        return item;

    }


    async function open() {

        if (!drawer) build();

        lastFocus = document.activeElement;

        window.Omega.toast.hide();

        await paint();

        drawer.classList.add('is-open');

        drawer.setAttribute('aria-hidden', 'false');

        document.documentElement.classList.add('no-scroll');

        drawer.querySelector('.drawer-panel').focus();

        const catalog = await window.Omega.catalog.load();

        const { lines } = window.Omega.cart.resolve(catalog);

        window.Omega.analytics.ecommerce('view_cart', lines);

    }


    function close() {

        drawer.classList.remove('is-open');

        drawer.setAttribute('aria-hidden', 'true');

        document.documentElement.classList.remove('no-scroll');

        if (lastFocus) lastFocus.focus();

    }


    window.Omega.cartDrawer = { open, close };

})();
