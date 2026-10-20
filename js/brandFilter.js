/* =========================================================
   BRAND FILTER
   Un producto es de la marca SAS si su nombre incluye la
   etiqueta "{SAS}" (igual que ya se arman categorías leyendo
   el nombre). Un solo lugar para ajustar la regla si el
   convenio de nombres cambia más adelante.
========================================================= */

function isSasProduct(product) {

    if (!product || typeof product.producto !== 'string') {

        return false;

    }

    return product.producto
        .toUpperCase()
        .includes('{SAS}');

}

// Dentro de SAS, cargadores y cables son la línea prioritaria
// (así lo pide la ficha de marca): los subimos primero dentro
// del propio carrusel/catálogo SAS.
function isPriorityChargingProduct(product) {

    if (!product || typeof product.producto !== 'string') {

        return false;

    }

    const name =
        product.producto.toLowerCase();

    return (
        name.includes('cargador') ||
        name.includes('cable')
    );

}

// Limpia la etiqueta "{SAS}" (y espacios sobrantes) del nombre
// para mostrarlo sin la marca técnica de filtrado.
function stripBrandTag(name) {

    if (typeof name !== 'string') return name;

    return name
        .replace(/\{\s*SAS\s*\}/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

}
