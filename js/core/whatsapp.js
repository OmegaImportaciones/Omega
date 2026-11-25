/* =========================================================
   WHATSAPP — todos los mensajes que se envían desde la web
========================================================= */

(function () {

    const U = window.Omega.utils;

    const STORE = window.OMEGA_STORE;


    function link(message) {

        return `https://wa.me/${STORE.WHATSAPP}?text=${encodeURIComponent(message)}`;

    }


    // Código corto para identificar el pedido en el chat y en GA4
    function orderCode() {

        const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

        let code = '';

        for (let i = 0; i < 4; i++) {
            code += alphabet[Math.floor(Math.random() * alphabet.length)];
        }

        return `OM-${code}`;

    }


    function isWholesale() {

        return !!(window.Omega.wholesale && window.Omega.wholesale.isActive());

    }


    function row(product, qty, unit, wholesale) {

        return `• ${product._name} (cód. ${product.codigo})\n   ${qty} x ${U.money(unit)}${wholesale ? ' (por mayor)' : ''} = ${U.money(unit * qty)}`;

    }


    // lines: de cart.resolve() -> { product, qty, unit, wholesale }
    function order(lines, total, code) {

        const rows = lines.map(l => row(l.product, l.qty, l.unit, l.wholesale)).join('\n');

        const kind = isWholesale() ? 'pedido mayorista' : 'pedido';

        return link(
`Hola ${STORE.NOMBRE}, quiero hacer este ${kind}:

${rows}

Total: ${U.money(total)}
Pedido web: ${code}${isWholesale() ? ' (mayorista)' : ''}

¿Me confirman disponibilidad para coordinar el pago y la entrega?`
        );

    }


    function buyNow(product, qty) {

        const n = qty || 1;

        const W = window.Omega.wholesale;

        const { unit, wholesale } = W ? W.unitFor(product, n) : { unit: product._price, wholesale: false };

        return link(
`Hola ${STORE.NOMBRE}, quiero comprar${isWholesale() ? ' por mayor' : ''}:

${row(product, n, unit, wholesale)}

¿Me confirman disponibilidad para coordinar el pago y la entrega?`
        );

    }


    // Para quien quiere ser mayorista y aún no tiene la contraseña
    function wholesaleAccess() {

        return link(`Hola ${STORE.NOMBRE}, quiero comprar por mayor. ¿Cómo puedo acceder a los precios mayoristas?`);

    }


    function notifyMe(product) {

        return link(
`Hola ${STORE.NOMBRE}, me interesa este producto que figura agotado en su web:

• ${product._name || product.producto} (cód. ${product.codigo})

¿Me avisan cuando vuelva a estar disponible?`
        );

    }


    function general(text) {

        return link(text || `Hola ${STORE.NOMBRE}, quiero información sobre sus productos.`);

    }


    window.Omega.whatsapp = { link, orderCode, order, buyNow, notifyMe, general, wholesaleAccess };

})();
