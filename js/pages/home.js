/* =========================================================
   HOME — portada SAS: líneas, carga, productos SAS
========================================================= */

(function () {

    const U = window.Omega.utils;

    const I = window.Omega.icons;

    const Card = window.Omega.productCard;

    const SAS = window.OMEGA_SAS;

    // Ícono de cada línea (slug -> nombre en icons.js)
    const LINE_ICONS = {
        carga: 'bolt',
        conversores: 'convert',
        'hdmi-video': 'hdmi',
        redes: 'network',
        audio: 'audio',
        'usb-pc': 'usb',
        accesorios: 'cable'
    };


    // Fijados en sas.config.js primero; luego con foto, mezclados por día
    function pickFeatured(catalog, count) {

        const pinned = SAS.DESTACADOS
            .map(id => catalog.byId.get(String(id)))
            .filter(p => p && p._isSas);

        const withPhoto = U.seededShuffle(catalog.sas.filter(p => p._images.length), U.daySeed());

        const rest = U.seededShuffle(catalog.sas.filter(p => !p._images.length), U.daySeed());

        const seen = new Set();

        return [...pinned, ...withPhoto, ...rest]
            .filter(p => !seen.has(p.id) && seen.add(p.id))
            .slice(0, count);

    }


    function renderLines(catalog) {

        const grid = document.getElementById('lineGrid');

        if (!grid) return;

        const lines = [...catalog.sasLines];

        // La línea de carga es prioritaria: se muestra aunque aún no tenga stock
        const charge = SAS.LINEAS.find(l => l.slug === 'carga');

        if (charge && !lines.some(l => l.slug === 'carga')) {
            lines.unshift({ slug: 'carga', label: charge.label, descripcion: charge.descripcion, count: 0 });
        }

        grid.innerHTML = lines.map(line => {

            const icon = I[LINE_ICONS[line.slug] || 'cable'];

            const soon = line.count === 0;

            const tag = soon ? 'div' : 'a';

            const href = soon ? '' : ` href="${U.url('pages/sas.html?linea=' + line.slug)}"`;

            return `
                <${tag} class="line-tile${line.slug === 'carga' ? ' line-tile--main' : ''}${soon ? ' is-soon' : ''}"${href}>
                    <span class="line-icon">${icon}</span>
                    <span class="line-label">${U.escapeHTML(line.label)}</span>
                    <span class="line-desc">${U.escapeHTML(line.descripcion || '')}</span>
                    <span class="line-count">${soon ? 'Muy pronto' : `${line.count} ${line.count === 1 ? 'producto' : 'productos'}`}</span>
                </${tag}>`;

        }).join('');

    }


    function renderCharge(catalog) {

        const section = document.getElementById('carga');

        if (!section) return;

        const products = catalog.sas.filter(p => p._sasLine.slug === 'carga');

        if (!products.length) { section.hidden = true; return; }

        section.hidden = false;

        Card.renderInto(section.querySelector('.rail'), products.slice(0, 12), { list: 'sas_carga' });

    }


    async function init() {

        try {

            const catalog = await window.Omega.catalog.load();

            renderLines(catalog);

            renderCharge(catalog);

            Card.renderInto(document.getElementById('sasGrid'), pickFeatured(catalog, 8), { list: 'sas_portada' });

            document.querySelectorAll('[data-total-sas]').forEach(n => { n.textContent = catalog.sas.length; });

            document.querySelectorAll('[data-total-products]').forEach(n => { n.textContent = catalog.products.length; });

        } catch (error) {

            console.error('No se pudo cargar el catálogo', error);

            document.getElementById('loadError').hidden = false;

        }

    }


    init();

})();
