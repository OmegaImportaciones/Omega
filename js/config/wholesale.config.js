/* =========================================================
   CONFIGURACIÓN DEL MODO MAYORISTA
   Los precios, el mínimo y el stock real vienen cifrados en
   data/mayoristas.enc (lo crea el Generador Omega).
   Aquí solo van textos y límites de la web.
========================================================= */

window.OMEGA_WHOLESALE = {

    // false = oculta todo acceso al modo mayorista
    ACTIVO: true,

    // Archivo cifrado (relativo a la raíz del sitio)
    ARCHIVO: 'data/mayoristas.enc',

    // Tope por producto en un pedido mayorista
    MAX_POR_PRODUCTO: 200,

    // Texto del acceso discreto (pie de página y "Mi pedido")
    TEXTO_ACCESO: '¿Compras por mayor?',

    // Enlace directo para compartir con mayoristas:
    // https://omegaimportaciones.github.io/Omega/?mayorista
    PARAMETRO_URL: 'mayorista'

};
