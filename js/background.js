// =========================
// BACKGROUND BLOBS
// =========================

const body = document.body;

// =========================
// CREATE BACKGROUND
// =========================

const background = document.createElement('div');

background.style.position = 'fixed';

background.style.inset = '0';

background.style.overflow = 'hidden';

background.style.pointerEvents = 'none';

background.style.zIndex = '0';

background.style.background =
    'linear-gradient(to bottom, #050505 0%, #0a0f18 45%, #111111 100%)';

body.prepend(background);

// =========================
// TOP LIGHT
// =========================

const topGlow = document.createElement('div');

topGlow.style.position = 'fixed';

topGlow.style.top = '-180px';

topGlow.style.left = '50%';

topGlow.style.transform =
    'translateX(-50%)';

topGlow.style.width = '160vw';

topGlow.style.height = '520px';

topGlow.style.background =
    `
    radial-gradient(
        circle,
        rgba(120,210,255,0.18) 0%,
        rgba(255,255,255,0.10) 35%,
        transparent 72%
    )
    `;

topGlow.style.filter = 'blur(80px)';

topGlow.style.pointerEvents = 'none';

topGlow.style.zIndex = '0';

background.appendChild(topGlow);

// =========================
// BOTTOM LIGHT
// =========================

const bottomGlow = document.createElement('div');

bottomGlow.style.position = 'fixed';

bottomGlow.style.left = '50%';

bottomGlow.style.bottom = '-80px';

bottomGlow.style.transform =
    'translateX(-50%)';

bottomGlow.style.width = '180vw';

bottomGlow.style.height = '700px';

bottomGlow.style.background =
    `
    radial-gradient(
        circle,
        rgba(255,255,255,0.14) 0%,
        rgba(255,180,90,0.10) 28%,
        rgba(120,210,255,0.08) 52%,
        transparent 75%
    )
    `;

bottomGlow.style.filter = 'blur(70px)';

bottomGlow.style.pointerEvents = 'none';

bottomGlow.style.zIndex = '0';

background.appendChild(bottomGlow);

// =========================
// CONFIG
// =========================

const blobsConfig = [

    // CELESTE

    {
        size: 520,

        color:
            'rgba(120, 210, 255, 0.26)',

        speedX: 2.3,

        speedY: 1.7
    },

    // BLANCO

    {
        size: 420,

        color:
            'rgba(255, 255, 255, 0.14)',

        speedX: -1.9,

        speedY: 1.5
    },

    // NARANJA

    {
        size: 360,

        color:
            'rgba(255, 170, 90, 0.18)',

        speedX: 1.8,

        speedY: -2.1
    }

];

// =========================
// BLOBS ARRAY
// =========================

const blobs = [];

// =========================
// CREATE BLOBS
// =========================

blobsConfig.forEach((config) => {

    const blob = document.createElement('div');

    // STYLE

    blob.style.position = 'absolute';

    blob.style.width =
        `${config.size}px`;

    blob.style.height =
        `${config.size}px`;

    blob.style.borderRadius = '50%';

    blob.style.background =
        config.color;

    blob.style.filter =
        'blur(85px)';

    blob.style.opacity = '1';

    blob.style.pointerEvents = 'none';

    blob.style.willChange = 'transform';

    // INITIAL POSITION

    const x =
        Math.random() *
        (window.innerWidth - config.size);

    const y =
        Math.random() *
        (window.innerHeight - config.size);

    // APPLY INITIAL POSITION

    blob.style.transform =
        `translate3d(${x}px, ${y}px, 0)`;

    background.appendChild(blob);

    blobs.push({

        element: blob,

        x,
        y,

        speedX: config.speedX,
        speedY: config.speedY,

        size: config.size

    });

});

// =========================
// ANIMATION
// =========================

function animateBlobs() {

    blobs.forEach((blob) => {

        // MOVE

        blob.x += blob.speedX;

        blob.y += blob.speedY;

        // HORIZONTAL LIMITS

        if (

            blob.x <= -180 ||

            blob.x >=
            window.innerWidth - blob.size + 180

        ) {

            blob.speedX *= -1;

        }

        // VERTICAL LIMITS

        if (

            blob.y <= -180 ||

            blob.y >=
            window.innerHeight - blob.size + 180

        ) {

            blob.speedY *= -1;

        }

        // APPLY MOVEMENT

        blob.element.style.transform =
            `translate3d(${blob.x}px, ${blob.y}px, 0)`;

    });

    requestAnimationFrame(animateBlobs);

}

// =========================
// START
// =========================

animateBlobs();