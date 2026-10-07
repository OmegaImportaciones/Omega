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


    function order(lines, total, code) {

        const rows = lines.map(l =>
            `• ${l.product._name} (cód. ${l.product.codigo})\n   ${l.qty} x ${U.money(l.product._price)} = ${U.money(l.subtotal)}`
        ).join('\n');

        return link(
`Hola ${STORE.NOMBRE}, quiero hacer este pedido:

${rows}

Total: ${U.money(total)}
Pedido web: ${code}

¿Me confirman disponibilidad para coordinar el pago y la entrega?`
        );

    }


    function buyNow(product, qty) {

        const n = qty || 1;

        return link(
`Hola ${STORE.NOMBRE}, quiero comprar:

• ${product._name} (cód. ${product.codigo})
   ${n} x ${U.money(product._price)} = ${U.money(product._price * n)}

¿Me confirman disponibilidad para coordinar el pago y la entrega?`
        );

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


    window.Omega.whatsapp = { link, orderCode, order, buyNow, notifyMe, general };

})();
