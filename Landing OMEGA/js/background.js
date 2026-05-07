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

body.prepend(background);

// =========================
// CONFIG
// =========================

const blobsConfig = [

    {
        size: 420,
        color: 'rgba(0, 102, 255, 0.22)',
        speedX: 2.2,
        speedY: 1.6
    },

    {
        size: 360,
        color: 'rgba(255, 255, 255, 0.10)',
        speedX: -1.8,
        speedY: 1.4
    },

    {
        size: 300,
        color: 'rgba(0, 140, 255, 0.16)',
        speedX: 1.5,
        speedY: -2
    }

];

// =========================
// CREATE BLOBS
// =========================

const blobs = [];

blobsConfig.forEach((config) => {

    const blob = document.createElement('div');

    // STYLE

    blob.style.position = 'absolute';

    blob.style.width = `${config.size}px`;
    blob.style.height = `${config.size}px`;

    blob.style.borderRadius = '50%';

    blob.style.background = config.color;

    blob.style.filter = 'blur(70px)';

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

        // HORIZONTAL BOUNDS

        if (
            blob.x <= -120 ||
            blob.x >=
            window.innerWidth - blob.size + 120
        ) {

            blob.speedX *= -1;

        }

        // VERTICAL BOUNDS

        if (
            blob.y <= -120 ||
            blob.y >=
            window.innerHeight - blob.size + 120
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