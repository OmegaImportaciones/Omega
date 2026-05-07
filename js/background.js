// =========================
// OMEGA BACKGROUND
// LIGHT + FLUID
// =========================

// =========================
// CREATE BACKGROUND
// =========================

const background = document.createElement('div');

background.style.position = 'fixed';

background.style.inset = '0';

background.style.width = '100vw';

background.style.height = '100dvh';

background.style.overflow = 'hidden';

background.style.pointerEvents = 'none';

background.style.zIndex = '-1';

background.style.background = `
linear-gradient(
    to bottom,
    #08101d 0%,
    #0f1a2b 45%,
    #171f2d 72%,
    #221f28 100%
)
`;

document.body.prepend(background);

// =========================
// ANIMATIONS
// =========================

const style =
    document.createElement('style');

style.textContent = `

@keyframes blob1 {

    0% {

        transform:
            translate(0px, 0px)
            scale(1);

    }

    100% {

        transform:
            translate(280px, -220px)
            scale(1.14);

    }

}

@keyframes blob2 {

    0% {

        transform:
            translate(0px, 0px)
            scale(1);

    }

    100% {

        transform:
            translate(-260px, 220px)
            scale(1.10);

    }

}

@keyframes blob3 {

    0% {

        transform:
            translate(0px, 0px)
            scale(1);

    }

    100% {

        transform:
            translate(220px, 280px)
            scale(1.18);

    }

}

`;

document.head.appendChild(style);

// =========================
// CREATE BLOB
// =========================

function createBlob({

    size,
    color,
    top,
    left,
    animation

}) {

    const blob =
        document.createElement('div');

    blob.style.position = 'fixed';

    blob.style.width =
        `${size}px`;

    blob.style.height =
        `${size}px`;

    blob.style.top =
        top;

    blob.style.left =
        left;

    blob.style.borderRadius =
        '50%';

    blob.style.background =
        color;

    blob.style.filter =
        'blur(36px)';

    blob.style.opacity =
        '1';

    blob.style.mixBlendMode =
        'screen';

    blob.style.pointerEvents =
        'none';

    blob.style.willChange =
        'transform';

    blob.style.transform =
        'translate3d(0,0,0)';

    blob.style.animation =
        animation;

    background.appendChild(blob);

}

// =========================
// BLOBS
// =========================

createBlob({

    size: 240,

    color:
        'rgba(90,180,255,0.24)',

    top: '8%',

    left: '10%',

    animation:
        'blob1 3.5s linear infinite alternate'

});

createBlob({

    size: 190,

    color:
        'rgba(255,255,255,0.12)',

    top: '52%',

    left: '70%',

    animation:
        'blob2 4s linear infinite alternate-reverse'

});

createBlob({

    size: 220,

    color:
        'rgba(255,170,90,0.18)',

    top: '70%',

    left: '14%',

    animation:
        'blob3 3.2s linear infinite alternate'

});