/* =========================================================
   SEARCH — búsqueda tolerante: sin tildes, plurales y
   sinónimos comunes. "audifonos inalambricos" encuentra
   "AUDIFONO BLUETOOTH ...".
   Para agregar sinónimos, edita GROUPS.
========================================================= */

(function () {

    const U = window.Omega.utils;

    const GROUPS = [
        ['audifono', 'audifonos', 'auricular', 'auriculares', 'earbuds', 'buds', 'headset', 'headphone', 'cascos'],
        ['inalambrico', 'inalambricos', 'bluetooth', 'wireless', 'bt', 'tws'],
        ['parlante', 'parlantes', 'bocina', 'bocinas', 'speaker', 'altavoz'],
        ['cargador', 'cargadores', 'charger', 'carga'],
        ['bateria', 'powerbank', 'power', 'bank'],
        ['reloj', 'smartwatch', 'watch', 'smartband', 'banda'],
        ['memoria', 'flash', 'usb', 'pendrive', 'msd', 'microsd', 'sd'],
        ['disco', 'ssd', 'hdd', 'almacenamiento'],
        ['camara', 'camaras', 'webcam', 'ip', 'seguridad'],
        ['tv', 'stick', 'tvbox', 'streaming', 'chromecast'],
        ['wifi', 'router', 'repetidor', 'red', 'internet'],
        ['celular', 'telefono', 'phone', 'movil'],
        ['microfono', 'mic', 'micro'],
        ['teclado', 'keyboard'],
        ['mouse', 'raton'],
        ['luz', 'foco', 'led', 'lampara', 'aro']
    ];

    const SYNONYMS = new Map();

    GROUPS.forEach(group => group.forEach(word => SYNONYMS.set(word, group)));


    function variants(token) {

        const base = new Set([token]);

        // plurales simples
        if (token.endsWith('es') && token.length > 4) base.add(token.slice(0, -2));
        if (token.endsWith('s') && token.length > 3) base.add(token.slice(0, -1));

        [...base].forEach(word => {
            (SYNONYMS.get(word) || []).forEach(s => base.add(s));
        });

        return [...base];

    }


    function haystackOf(product) {

        if (!product._haystack) {
            product._haystack = U.normalize(
                `${product.producto} ${product.codigo} ${product._category.label}`
            );
        }

        return product._haystack;

    }


    // Cada palabra buscada debe coincidir (ella o un sinónimo)
    function filter(products, query) {

        const tokens = U.normalize(query).split(/\s+/).filter(Boolean);

        if (tokens.length === 0) return products;

        const tokenVariants = tokens.map(variants);

        return products.filter(product => {

            const hay = haystackOf(product);

            return tokenVariants.every(options => options.some(word => hay.includes(word)));

        });

    }


    window.Omega.search = { filter };

})();
