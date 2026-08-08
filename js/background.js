// =========================
// OMEGA BACKGROUND - OPTIMIZED FOR iOS
// =========================

// =========================
// CREATE BACKGROUND
// =========================
const background = document.createElement('div');

// Usamos valores negativos en inset para "sangrar" el fondo fuera de la pantalla
// y evitar que se vean bordes blancos al hacer scroll o en el notch.
background.style.position = 'fixed';
background.style.top = '-5%';
background.style.left = '-5%';
background.style.width = '110vw';
background.style.height = '110dvh';

background.style.overflow = 'hidden';
background.style.pointerEvents = 'none';
background.style.zIndex = '0';

// Negro puro (true black), como el modo oscuro nativo de iOS.
background.style.backgroundColor = '#000000';
background.style.background = '#000000';

document.body.prepend(background);

// =========================
// ANIMATIONS
// =========================
const style = document.createElement('style');

// He añadido translate3d para forzar la aceleración por hardware (GPU) en iPhone
style.textContent = `
@keyframes blob1 {
    0% { transform: translate3d(0px, 0px, 0) scale(1); }
    100% { transform: translate3d(120px, -100px, 0) scale(1.08); }
}

@keyframes blob2 {
    0% { transform: translate3d(0px, 0px, 0) scale(1); }
    100% { transform: translate3d(-100px, 90px, 0) scale(1.05); }
}
`;

document.head.appendChild(style);

// =========================
// CREATE BLOB
// =========================
function createBlob({ size, color, top, left, animation }) {
    const blob = document.createElement('div');

    blob.style.position = 'absolute'; // Absolute respecto al background fijo
    blob.style.width = `${size}px`;
    blob.style.height = `${size}px`;
    blob.style.top = top;
    blob.style.left = left;
    blob.style.borderRadius = '50%';
    blob.style.background = color;
    blob.style.filter = 'blur(90px)'; // Difuminado amplio para un glow ambiental, no una mancha visible
    blob.style.opacity = '1';
    blob.style.pointerEvents = 'none';
    blob.style.willChange = 'transform';
    blob.style.animation = animation;

    background.appendChild(blob);
}

// =========================
// BLOBS
// Solo dos glows muy sutiles y monocromáticos (azul sistema de iOS),
// muy lentos — nada de mezcla de colores ni movimiento brusco.
// =========================
createBlob({
    size: 380,
    color: 'rgba(10,132,255,0.10)',
    top: '2%',
    left: '10%',
    animation: 'blob1 16s ease-in-out infinite alternate'
});

createBlob({
    size: 320,
    color: 'rgba(10,132,255,0.06)',
    top: '60%',
    left: '55%',
    animation: 'blob2 18s ease-in-out infinite alternate-reverse'
});
