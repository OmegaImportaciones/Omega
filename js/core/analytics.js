/* =========================================================
   ANALYTICS — eventos GA4 orientados a intención de compra
   Nombres recomendados por GA4 para ecommerce:
   view_item, add_to_cart, remove_from_cart, view_cart,
   begin_checkout, generate_lead, search, select_item
========================================================= */

(function () {

    function track(name, params) {

        try {

            if (typeof window.gtag === 'function') {
                window.gtag('event', name, params || {});
            }

        } catch (error) {
            /* analytics nunca debe romper la tienda */
        }

    }


    function item(product, quantity) {

        return {
            item_id: String(product.id),
            item_name: product.producto,
            item_category: product._category ? product._category.label : undefined,
            price: product._price,
            quantity: quantity || 1
        };

    }


    function ecommerce(name, products, extra) {

        const items = products.map(entry =>
            entry.product ? item(entry.product, entry.qty) : item(entry, 1)
        );

        const value = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        track(name, Object.assign({ currency: 'BOB', value, items }, extra || {}));

    }


    window.Omega.analytics = { track, ecommerce };

})();
