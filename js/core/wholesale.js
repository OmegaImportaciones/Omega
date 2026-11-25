/* =========================================================
   WHOLESALE — modo mayorista
   - unlock(contraseña): descarga data/mayoristas.enc, lo
     descifra y guarda el resultado en sessionStorage (solo
     dura mientras la pestaña esté abierta).
   - Regla: el precio por mayor aplica por PRODUCTO, cuando
     se llevan "minimo" unidades o más del mismo producto.
     (1 Q3 + 1 Q1 + 1 18H NO aplica: cada uno va a precio normal)
   Sin modo activo, nada de esto cambia la web.
========================================================= */

(function () {

    const U = window.Omega.utils;

    const CFG = window.OMEGA_WHOLESALE || { ACTIVO: false };

    const KEY = 'omega-mayorista-v1';

    let state = restore();


    function restore() {

        if (!CFG.ACTIVO) return null;

        try {

            const data = JSON.parse(sessionStorage.getItem(KEY));

            return data && data.items ? data : null;

        } catch (error) {

            return null;

        }

    }


    function isEnabled() {

        return !!CFG.ACTIVO;

    }


    function isActive() {

        return !!state;

    }


    function minimum() {

        return state ? Math.max(2, Number(state.minimo) || 3) : 3;

    }


    // { price, min, stock } o null si este producto no tiene precio por mayor
    // (o si el precio por unidad ya es igual o más bajo, p. ej. por campaña)
    function infoOf(product) {

        if (!state) return null;

        const item = state.items[String(product.id)];

        if (!item || !(item.p > 0) || item.p >= product._price) return null;

        return { price: item.p, min: minimum(), stock: Number(item.s) || 0 };

    }


    // Precio unitario según la cantidad del MISMO producto
    function unitFor(product, qty) {

        const info = infoOf(product);

        if (info && qty >= info.min) return { unit: info.price, wholesale: true, info };

        return { unit: product._price, wholesale: false, info };

    }


    // Cuántas faltan para el precio por mayor (0 si ya aplica o no hay)
    function missingFor(product, qty) {

        const info = infoOf(product);

        if (!info || qty >= info.min) return 0;

        return info.min - qty;

    }


    // Tope de unidades: en modo mayorista se usa el stock real cifrado
    function maxQty(product, fallback) {

        const info = infoOf(product);

        if (!info) return fallback;

        return Math.max(1, Math.min(info.stock || fallback, CFG.MAX_POR_PRODUCTO || 200));

    }


    async function unlock(password) {

        if (!window.OmegaVault || !window.OmegaVault.supported()) throw new Error('unsupported');

        let box;

        try {

            const response = await fetch(U.url(CFG.ARCHIVO), { cache: 'no-cache' });

            if (!response.ok) throw new Error(String(response.status));

            box = await response.json();

        } catch (error) {

            throw new Error('missing');

        }

        const data = await window.OmegaVault.open(box, password);

        state = { minimo: data.minimo, items: data.items || {}, creado: data.creado };

        try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (error) { /* modo privado */ }

        window.Omega.analytics.track('wholesale_login', { items: Object.keys(state.items).length });

        return Object.keys(state.items).length;

    }


    function lock() {

        state = null;

        try { sessionStorage.removeItem(KEY); } catch (error) { /* nada */ }

    }


    window.Omega.wholesale = {
        isEnabled, isActive, minimum, infoOf, unitFor, missingFor, maxQty, unlock, lock, config: CFG
    };

})();
