/* =========================================================
   UTILS — helpers compartidos (namespace window.Omega)
========================================================= */

window.Omega = window.Omega || {};

(function () {

    // Ruta base de la página actual ("./" en la raíz, "../" en /pages)
    const BASE =
        document.body.dataset.base || './';


    function url(path) {

        return BASE + path;

    }


    function escapeHTML(value) {

        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    }


    // 1410 -> "Bs 1.410"   |   12.5 -> "Bs 12,50"
    function money(value) {

        const number = Number(value) || 0;

        const hasCents = Math.round(number * 100) % 100 !== 0;

        const formatted = number.toLocaleString('es-BO', {
            minimumFractionDigits: hasCents ? 2 : 0,
            maximumFractionDigits: 2
        });

        return `Bs ${formatted}`;

    }


    function normalize(text) {

        return String(text || '')
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .toLowerCase()
            .trim();

    }


    // Siglas que siempre van en mayúsculas y palabras que van en minúscula
    const ACRONYMS = new Set(['HDMI', 'USB', 'UTP', 'VGA', 'DVI', 'RCA', 'AV', 'AV2', 'DP', 'UHD', 'FHD', 'HD',
        'PC', 'CPU', 'SSD', 'HDD', 'TV', 'LED', 'RGB', 'SC', 'IP', 'TWS', 'BT', 'OTG', 'KVM', 'HDTV', 'POE', 'RJ45',
        'SD', 'MSD', 'NVME', 'SATA', 'PD', 'QC', 'GB', 'TB', 'MB', '2RCA', '4K', '2K', '8K', 'TP-LINK']);

    const LOWER = new Set(['de', 'a', 'para', 'con', 'y', 'o', 'por', 'en', 'del', 'el', 'la', 'sin', 'mm', 'cm', 'w', 'mah', 'metros', 'metro', 'm']);


    // "CABLE HDMI 2.0V DE 3 METROS" -> "Cable HDMI 2.0v de 3 metros"
    function titleCase(text) {

        return String(text || '')
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .map((word, i) => word
                // cada parte separada por "/" se trata como palabra ("hdmi/vga" -> "HDMI/VGA")
                .split('/')
                .map((part, j) => {
                    const up = part.toUpperCase();
                    if (ACRONYMS.has(up)) return up;
                    if ((i > 0 || j > 0) && LOWER.has(part)) return part;
                    return part.replace(/(^|[\-(])([a-záéíóúñ])/g, (m, sep, ch) => sep + ch.toUpperCase());
                })
                .join('/'))
            .join(' ');

    }


    // Aleatorio determinístico (misma selección para todos durante el día)
    function seededShuffle(list, seed) {

        const result = [...list];

        let s = seed | 0;

        const random = () => {
            s = s + 0x6D2B79F5 | 0;
            let t = Math.imul(s ^ s >>> 15, 1 | s);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;

    }


    function daySeed() {

        const d = new Date();

        return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();

    }


    function el(html) {

        const template = document.createElement('template');

        template.innerHTML = html.trim();

        return template.content.firstElementChild;

    }


    function storage(key, value) {

        try {

            if (value === undefined) {
                return JSON.parse(localStorage.getItem(key));
            }

            localStorage.setItem(key, JSON.stringify(value));

        } catch (error) {

            return null;

        }

    }


    window.Omega.utils = {
        BASE,
        url,
        escapeHTML,
        money,
        normalize,
        titleCase,
        seededShuffle,
        daySeed,
        el,
        storage
    };

})();
