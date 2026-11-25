/* =========================================================
   CART — "Mi pedido" guardado en localStorage.
   Solo guarda { id, qty }; precio y disponibilidad se
   recalculan siempre contra products.json (nunca quedan
   precios viejos en el pedido).
   Emite el evento "omega:cart" en cada cambio.
========================================================= */

(function () {

    const U = window.Omega.utils;

    const KEY = 'omega-cart-v1';

    const MAX = window.OMEGA_STORE.MAX_POR_PRODUCTO || 20;


    function read() {

        const data = U.storage(KEY);

        return Array.isArray(data) ? data.filter(i => i && i.id && i.qty > 0) : [];

    }


    function write(items) {

        U.storage(KEY, items);

        window.dispatchEvent(new CustomEvent('omega:cart', { detail: { items } }));

    }


    // Tope normal: MAX_POR_PRODUCTO y el stock publicado.
    // En modo mayorista: stock real y tope mayorista (wholesale.maxQty).
    function limitOf(product) {

        if (!product) return MAX;

        const normal = Math.min(MAX, Number(product.cantidad_disponible) || MAX);

        return window.Omega.wholesale ? window.Omega.wholesale.maxQty(product, normal) : normal;

    }


    function clampQty(qty, product) {

        return Math.max(1, Math.min(qty, limitOf(product)));

    }


    function add(product, qty) {

        const items = read();

        const id = String(product.id);

        const found = items.find(i => i.id === id);

        const nextQty = clampQty((found ? found.qty : 0) + (qty || 1), product);

        if (found) found.qty = nextQty;
        else items.push({ id, qty: nextQty });

        write(items);

        return nextQty;

    }


    function setQty(product, qty) {

        const id = String(product.id);

        if (qty <= 0) return remove(id);

        const items = read();

        const found = items.find(i => i.id === id);

        if (!found) return;

        found.qty = clampQty(qty, product);

        write(items);

    }


    function remove(id) {

        write(read().filter(i => i.id !== String(id)));

    }


    function clear() {

        write([]);

    }


    function count() {

        return read().reduce((sum, i) => sum + i.qty, 0);

    }


    function qtyOf(id) {

        const found = read().find(i => i.id === String(id));

        return found ? found.qty : 0;

    }


    // Une el pedido con el catálogo actual.
    // Devuelve líneas válidas + avisos de productos que ya no están.
    function resolve(catalog) {

        const lines = [];

        const removed = [];

        read().forEach(item => {

            const product = catalog.byId.get(item.id);

            if (!product) {

                const ghost = catalog.allById.get(item.id);

                removed.push(ghost ? ghost._name : `Producto ${item.id}`);

                return;

            }

            const qty = clampQty(item.qty, product);

            const W = window.Omega.wholesale;

            const { unit, wholesale } = W ? W.unitFor(product, qty) : { unit: product._price, wholesale: false };

            lines.push({
                product,
                qty,
                unit,
                wholesale,
                missing: W ? W.missingFor(product, qty) : 0,
                saving: (product._price - unit) * qty,
                subtotal: unit * qty
            });

        });

        if (removed.length) {
            write(lines.map(l => ({ id: String(l.product.id), qty: l.qty })));
        }

        const total = lines.reduce((sum, l) => sum + l.subtotal, 0);

        const saving = lines.reduce((sum, l) => sum + l.saving, 0);

        return { lines, removed, total, saving };

    }


    window.Omega.cart = { add, setQty, remove, clear, count, qtyOf, resolve, read, limitOf };

})();
