/* =========================================================
   INVENTORY — qué productos se muestran en la web
   Regla: activo + al menos 1 unidad + precio válido
========================================================= */

(function () {

    function isPublishable(product) {

        return (
            product.estado === 1 &&
            Number(product.cantidad_disponible) >= 1 &&
            window.OmegaPricing.getPrice(product).price > 0
        );

    }


    function filterPublishable(products) {

        return Array.isArray(products)
            ? products.filter(isPublishable)
            : [];

    }


    window.OmegaInventory = {
        isPublishable,
        filterPublishable
    };

})();
