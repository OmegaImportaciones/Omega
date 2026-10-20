/* =========================================================
   SAS — reconoce productos de la marca, su modelo y su línea.
   Reglas editables en js/config/sas.config.js
========================================================= */

(function () {

    const U = window.Omega.utils;

    const CONFIG = window.OMEGA_SAS;

    const LINES = CONFIG.LINEAS.map(line =>
        Object.assign({}, line, { regex: line.buscar.map(rx => new RegExp(rx)) })
    );


    function upper(text) {

        return U.normalize(text).toUpperCase();

    }


    function isSas(product) {

        const name = String(product.producto || '');

        const code = String(product.codigo || '');

        return /\{SAS\}/i.test(name) || /\bSAS\b/i.test(name) || /^SAS\s/i.test(code);

    }


    // "CABLE HDMI 2.0V DE 3 METROS SAS S2K3"
    //   -> { base: "CABLE HDMI 2.0V DE 3 METROS", model: "S2K3" }
    function split(product) {

        let base = String(product.producto || '').replace(/\{SAS\}/ig, ' ');

        let model = '';

        const tail = base.match(/\s+SAS\s+(\S+)\s*$/i);

        if (tail) {
            model = tail[1];
            base = base.slice(0, tail.index);
        } else {
            base = base.replace(/\bSAS\b/ig, ' ');
            const code = String(product.codigo || '').match(/^SAS\s+(.+)$/i);
            if (code) model = code[1].trim();
        }

        return { base: base.replace(/\s+/g, ' ').trim(), model: model.toUpperCase() };

    }


    function lineOf(product) {

        const name = upper(product.producto);

        const line = LINES.find(l => l.regex.some(rx => rx.test(name)));

        const pick = line || CONFIG.LINEA_OTROS;

        return { slug: pick.slug, label: pick.label, descripcion: pick.descripcion };

    }


    // Resumen de líneas con cantidad, en el orden de la configuración
    function summarize(products) {

        const all = [...LINES, CONFIG.LINEA_OTROS];

        return all
            .map(line => ({
                slug: line.slug,
                label: line.label,
                descripcion: line.descripcion,
                count: products.filter(p => p._sasLine && p._sasLine.slug === line.slug).length,
                sample: products.find(p => p._sasLine && p._sasLine.slug === line.slug && p._images.length)
            }))
            .filter(line => line.count > 0);

    }


    window.Omega.sas = { isSas, split, lineOf, summarize, config: CONFIG };

})();
