/* =========================================================
   PRICING — decide el único precio visible de cada producto
   Lee la configuración de js/config/pricing.config.js
   Prioridad de campaña: producto > todo el catálogo > categoría
========================================================= */

(function () {

    const CONFIG =
        window.OMEGA_PRICING_CONFIG || {
            NIVEL_WEB: 'precio1',
            CAMPANA: { ACTIVA: false }
        };


    function toNumber(value) {

        const number = Number(value);

        return Number.isFinite(number) ? number : 0;

    }


    // Categoría simple = primera palabra del nombre
    function getCategory(product) {

        const name =
            (product.producto || '').trim().toUpperCase();

        return name ? name.split(/\s+/)[0] : 'OTROS';

    }


    function getCampaignLevel(product) {

        const campaign = CONFIG.CAMPANA || {};

        if (!campaign.ACTIVA) return null;

        const byProduct = campaign.PRODUCTOS || {};

        if (byProduct[product.id]) return byProduct[product.id];

        if (campaign.TODO_EL_CATALOGO) return campaign.NIVEL;

        const categories =
            (campaign.CATEGORIAS || []).map(c => c.toUpperCase());

        if (categories.includes(getCategory(product))) return campaign.NIVEL;

        return null;

    }


    // Devuelve { price, oldPrice }
    //  - price: precio que ve el cliente
    //  - oldPrice: solo si hay campaña y el precio realmente baja
    function getPrice(product) {

        const normal =
            toNumber(product[CONFIG.NIVEL_WEB]);

        const level =
            getCampaignLevel(product);

        if (level) {

            const offer = toNumber(product[level]);

            if (offer > 0 && offer < normal) {

                return { price: offer, oldPrice: normal };

            }

        }

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
