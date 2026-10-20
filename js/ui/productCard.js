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

        // En SAS el sello de marca ya destaca; "Recién llegado" solo para el resto
        if (product._isNew && !product._isSas) list.push(`<span class="badge">Recién llegado</span>`);

        return list.length ? `<div class="card-badges">${list.join('')}</div>` : '';

    }


    // Sin foto: los SAS muestran su emblema y modelo; el resto, su categoría
    function placeholder(product) {

        if (product._isSas) {
            return `
                <div class="ph ph--sas">
                    ${I.sas}
                    ${product._model ? `<span class="ph-model">${U.escapeHTML(product._model)}</span>` : ''}
                </div>`;
        }

        return `<div class="ph"><span>${U.escapeHTML(product._category.label)}</span></div>`;

    }


    function media(product, alt) {

        const image = product._images[0];

        return image
            ? `<img src="${U.escapeHTML(image)}" alt="${U.escapeHTML(alt || '')}" loading="lazy" decoding="async">`
            : placeholder(product);

    }


    function sasSeal(product) {

        if (!product._isSas) return '';

        return `<span class="sas-seal">${I.sas}<span>SAS${product._model ? ' · ' + U.escapeHTML(product._model) : ''}</span></span>`;

    }


    function productHref(product) {

        return U.url(`pages/producto.html?id=${encodeURIComponent(product.id)}`);

    }


    function render(product, options) {

        const opts = options || {};

        const card = U.el(`
            <article class="product-card${product._isSas ? ' product-card--sas' : ''}">
                <a class="card-link" href="${productHref(product)}">
                    <div class="pedestal">
                        ${media(product)}
                        ${badges(product)}
                    </div>
                    ${sasSeal(product)}
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


    window.Omega.productCard = { render, renderInto, priceTag, productHref, media, placeholder, sasSeal };

})();
