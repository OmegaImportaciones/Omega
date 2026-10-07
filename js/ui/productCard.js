/* =========================================================
   PRODUCT CARD — tarjeta de producto reutilizable
   La etiqueta amarilla de precio es la firma visual.
========================================================= */

(function () {

    const U = window.Omega.utils;

    const I = window.Omega.icons;


    function priceTag(product, size) {

        const old = product._oldPrice
            ? `<s class="tag-old">${U.money(product._oldPrice)}</s>`
            : '';

        return `
            <span class="price-tag${size ? ' price-tag--' + size : ''}">
                ${old}
                <span class="tag-price">${U.money(product._price)}</span>
            </span>`;

    }


    function badges(product) {

        const list = [];

        if (product._discount > 0) list.push(`<span class="badge badge--offer">−${product._discount}%</span>`);

        if (product._isNew) list.push(`<span class="badge">Recién llegado</span>`);

        return list.length ? `<div class="card-badges">${list.join('')}</div>` : '';

    }


    function productHref(product) {

        return U.url(`pages/producto.html?id=${encodeURIComponent(product.id)}`);

    }


    function render(product, options) {

        const opts = options || {};

        const image = product._images[0] || '';

        const card = U.el(`
            <article class="product-card">
                <a class="card-link" href="${productHref(product)}">
                    <div class="pedestal">
                        ${image ? `<img src="${U.escapeHTML(image)}" alt="" loading="lazy" decoding="async">` : ''}
                        ${badges(product)}
                    </div>
                    <h3 class="card-name">${U.escapeHTML(product._name)}</h3>
                </a>
                <div class="card-foot">
                    ${priceTag(product)}
                    <button type="button" class="add-button" aria-label="Agregar ${U.escapeHTML(product._name)} a tu pedido">
                        ${I.plus}<span>Agregar</span>
                    </button>
                </div>
            </article>`);

        card.querySelector('.card-link').addEventListener('click', () => {

            window.Omega.analytics.ecommerce('select_item', [product], { item_list_name: opts.list || 'catalogo' });

        });

        const button = card.querySelector('.add-button');

        button.addEventListener('click', () => {

            window.Omega.cart.add(product, 1);

            window.Omega.analytics.ecommerce('add_to_cart', [{ product, qty: 1 }], { item_list_name: opts.list || 'catalogo' });

            button.classList.add('is-added');

            button.innerHTML = `${I.check}<span>Agregado</span>`;

            setTimeout(() => {
                button.classList.remove('is-added');
                button.innerHTML = `${I.plus}<span>Agregar</span>`;
            }, 1400);

            window.Omega.toast.show('Agregado a tu pedido', 'Ver pedido', () => window.Omega.cartDrawer.open());

        });

        return card;

    }


    function renderInto(container, products, options) {

        const fragment = document.createDocumentFragment();

        products.forEach(p => fragment.appendChild(render(p, options)));

        container.appendChild(fragment);

    }


    window.Omega.productCard = { render, renderInto, priceTag, productHref };

})();
