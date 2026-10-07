/* =========================================================
   CONFIGURACIÓN DE PRECIOS DE LA WEB
   Único archivo a editar para cambiar precios o lanzar
   una venta urgente. No requiere tocar products.json.
========================================================= */

window.OMEGA_PRICING_CONFIG = {

    // Precio normal que ve el cliente
    NIVEL_WEB: 'precio1',

    // Venta urgente / campaña
    CAMPANA: {

        ACTIVA: false,

        // Nivel rebajado: 'precio2' … 'precio6'
        NIVEL: 'precio5',

        // true = aplica a todo el catálogo
        TODO_EL_CATALOGO: false,

        // Primera palabra del nombre del producto (AUDIFONO, PARLANTE, CABLE…)
        CATEGORIAS: [],

        // Productos puntuales por id, con su propio nivel (tiene prioridad)
        // Ejemplo: { 2065: 'precio6', 331: 'precio5' }
        PRODUCTOS: {}

    }

};
