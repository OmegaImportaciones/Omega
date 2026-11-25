/* =========================================================
   PRICING — precio por unidad que ve todo cliente
   products.json (público) trae:
     precio1        precio normal
     precio_oferta  solo si hay campaña (lo calcula el Generador)
   Las campañas ya no se configuran en la web: se activan en
   el Generador Omega al crear products.json.
========================================================= */

(function () {

    function toNumber(value) {

        const number = Number(value);

        return Number.isFinite(number) ? number : 0;

    }


    // Categoría simple = primera palabra del nombre
    function getCategory(product) {

        const name = (product.producto || '').trim().toUpperCase();

        return name ? name.split(/\s+/)[0] : 'OTROS';

    }


    // Devuelve { price, oldPrice }
    //  - price: precio que ve el cliente
    //  - oldPrice: solo si hay oferta y el precio realmente baja
    function getPrice(product) {

        const normal = toNumber(product.precio1);

        const offer = toNumber(product.precio_oferta);

        if (offer > 0 && offer < normal) return { price: offer, oldPrice: normal };

        return { price: normal, oldPrice: null };

    }


    function isOnOffer(product) {

        return getPrice(product).oldPrice !== null;

    }


    function format(value) {

        return toNumber(value).toFixed(2);

    }


    window.OmegaPricing = {
        getPrice,
        isOnOffer,
        getCategory,
        format
    };

})();
