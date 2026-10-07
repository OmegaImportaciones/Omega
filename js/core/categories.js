/* =========================================================
   CATEGORÍAS — derivadas de la primera palabra del nombre
   Para renombrar o agregar una categoría, edita LABELS.
========================================================= */

(function () {

    const LABELS = {
        AUDIFONO: 'Audífonos',
        AUDIFONOS: 'Audífonos',
        AURICULAR: 'Audífonos',
        CABLE: 'Cables',
        DISCO: 'Discos y SSD',
        CAMARA: 'Cámaras',
        MOUSE: 'Mouse',
        PARLANTE: 'Parlantes',
        CARGADOR: 'Cargadores',
        TECLADO: 'Teclados',
        MICROFONO: 'Micrófonos',
        SMARTWATCH: 'Smartwatch',
        RELOJ: 'Smartwatch',
        FLASH: 'Memorias USB',
        MSD: 'Memorias microSD',
        MEMORIA: 'Memorias',
        ROUTER: 'Routers',
        HUB: 'Hubs USB',
        POWER: 'Power banks',
        ADAPTADOR: 'Adaptadores',
        PROYECTOR: 'Proyectores',
        RECEPTOR: 'Receptores',
        TV: 'TV y streaming',
        SWITCH: 'Switches',
        REPETIDOR: 'Repetidores WiFi',
        FOCO: 'Iluminación',
        CASE: 'Cases',
        SOPORTE: 'Soportes',
        LECTOR: 'Lectores',
        SINTONIZADOR: 'TV y streaming',
        MI: 'TV y streaming'
    };


    function keyOf(product) {

        const name = window.Omega.utils.normalize(product.producto).toUpperCase();

        return name.split(/\s+/)[0] || 'OTROS';

    }


    function of(product) {

        const key = keyOf(product);

        const label = LABELS[key] || window.Omega.utils.titleCase(key);

        // slug estable para la URL (?cat=audifonos)
        const slug = window.Omega.utils.normalize(label).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        return { slug, label };

    }


    // Lista de categorías con al menos `min` productos, ordenada por cantidad
    function summarize(products, min) {

        const map = new Map();

        products.forEach(product => {

            const cat = product._category;

            if (!map.has(cat.slug)) {
                map.set(cat.slug, { slug: cat.slug, label: cat.label, count: 0, sample: product });
            }

            map.get(cat.slug).count++;

        });

        return [...map.values()]
            .filter(cat => cat.count >= (min || 1))
            .sort((a, b) => b.count - a.count);

    }


    window.Omega.categories = { of, summarize };

})();
