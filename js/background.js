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

// Color base sólido + gradiente para evitar transparencia en Safari
background.style.backgroundColor = '#05070c';
background.style.background = `
linear-gradient(
    to bottom,
    #05070c 0%,
    #0a0e18 42%,
    #121826 74%,
    #1a1620 100%
)
`;

document.body.prepend(background);

// =========================
// ANIMATIONS
// =========================
const style = document.createElement('style');

// He añadido translate3d para forzar la aceleración por hardware (GPU) en iPhone
style.textContent = `
@keyframes blob1 {
    0% { transform: translate3d(0px, 0px, 0) scale(1); }
    100% { transform: translate3d(280px, -220px, 0) scale(1.14); }
}

@keyframes blob2 {
    0% { transform: translate3d(0px, 0px, 0) scale(1); }
    100% { transform: translate3d(-260px, 220px, 0) scale(1.10); }
}

@keyframes blob3 {
    0% { transform: translate3d(0px, 0px, 0) scale(1); }
    100% { transform: translate3d(220px, 280px, 0) scale(1.18); }
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
    blob.style.filter = 'blur(40px)'; // Un poco más de blur para suavidad
    blob.style.opacity = '1';
    blob.style.mixBlendMode = 'screen';
    blob.style.pointerEvents = 'none';
    blob.style.willChange = 'transform';
    blob.style.animation = animation;

    background.appendChild(blob);
}

// =========================
// BLOBS
// =========================
createBlob({
    size: 260,
    color: 'rgba(227,193,112,0.16)',
    top: '12%',
    left: '15%',
    animation: 'blob1 9s ease-in-out infinite alternate'
});

createBlob({
    size: 200,
    color: 'rgba(200,210,225,0.10)',
    top: '52%',
    left: '62%',
    animation: 'blob2 11s ease-in-out infinite alternate-reverse'
});

createBlob({
    size: 230,
    color: 'rgba(120,150,200,0.14)',
    top: '68%',
    left: '18%',
    animation: 'blob3 10s ease-in-out infinite alternate'
});