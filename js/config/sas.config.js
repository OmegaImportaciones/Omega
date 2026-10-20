/* =========================================================
   CONFIGURACIÓN DE LA MARCA SAS
   Todo lo editable de SAS está aquí: textos, garantía,
   cómo se reconoce un producto y en qué línea va.
========================================================= */

window.OMEGA_SAS = {

    NOMBRE: 'SAS',

    LEMA: 'Tecnología que responde.',

    GARANTIA_ANIOS: 2,

    // Un producto es SAS si su nombre tiene la etiqueta {SAS},
    // la palabra SAS, o su código empieza con "SAS ".
    // (Se revisa nombre y código de products.json)

    // Líneas de producto. Se evalúan EN ORDEN: la primera que
    // coincide gana. "buscar" son expresiones sobre el nombre
    // en MAYÚSCULAS y sin tildes.
    LINEAS: [
        {
            slug: 'carga',
            label: 'Carga',
            descripcion: 'Cargadores de pared, carga rápida y cables de carga.',
            buscar: ['^CARGADOR', '\\bCARGA\\b', 'LIGHTNING', 'TIPO C A TIPO C', 'USB A TIPO C']
        },
        {
            slug: 'conversores',
            label: 'Conversores',
            descripcion: 'Adaptadores y conversores de video y audio.',
            buscar: ['CONVERSOR', 'ADAPTADOR']
        },
        {
            slug: 'hdmi-video',
            label: 'HDMI y video',
            descripcion: 'Cables HDMI, fibra óptica, splitters y extensores.',
            buscar: ['HDMI', 'SPLITTER', 'DISPLAY ?PORT']
        },
        {
            slug: 'redes',
            label: 'Redes',
            descripcion: 'Patch cord UTP Cat 6 y fibra óptica SC.',
            buscar: ['\\bUTP\\b', 'FIBRA OPTICA SC', '\\bRJ45\\b']
        },
        {
            slug: 'audio',
            label: 'Audio',
            descripcion: 'Auxiliares, RCA y óptico digital.',
            buscar: ['AUXILIAR', 'AUDIO', 'OPTICO DIGITAL']
        },
        {
            slug: 'usb-pc',
            label: 'USB y PC',
            descripcion: 'Extensores USB, impresora, discos y poder.',
            buscar: ['USB', 'IMPRESORA', 'PODER', 'DISCO']
        }
    ],

    // Si no coincide con ninguna línea
    LINEA_OTROS: { slug: 'accesorios', label: 'Accesorios', descripcion: 'Otros accesorios SAS.' },

    // Productos que quieres fijar primero en la portada (por id).
    // Vacío = se eligen solos (con foto y mejor precio primero).
    DESTACADOS: []

};
