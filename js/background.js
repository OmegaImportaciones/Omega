// =========================
// OMEGA BACKGROUND
// LIGERO + ESTABLE
// =========================

// IMPORTANTE:
// - Todo usa position: fixed
// - Sin resize hacks
// - Sin scrollHeight
// - Animaciones MUY suaves
// - Blur reducido
// - Optimizado para iOS

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
    #0b1220 0%,
    #101826 40%,
    #181d28 70%,
    #211f27 100%
)
`;

document.body.prepend(background);

// =========================
// TOP LIGHT
// =========================

const topGlow = document.createElement('div');

topGlow.style.position = 'fixed';

topGlow.style.top = '-180px';

topGlow.style.left = '50%';

topGlow.style.transform =
    'translateX(-50%)';

topGlow.style.width = '140vw';

topGlow.style.height = '420px';

topGlow.style.borderRadius = '50%';

topGlow.style.background = `
radial-gradient(
    circle,
    rgba(120,210,255,0.14) 0%,
    rgba(255,255,255,0.06) 35%,
    transparent 72%
)
`;

topGlow.style.filter = 'blur(60px)';

topGlow.style.opacity = '0.9';

topGlow.style.pointerEvents = 'none';

background.appendChild(topGlow);

// =========================
// BOTTOM LIGHT
// =========================

const bottomGlow = document.createElement('div');

bottomGlow.style.position = 'fixed';

bottomGlow.style.bottom = '-220px';

bottomGlow.style.left = '50%';

bottomGlow.style.transform =
    'translateX(-50%)';

bottomGlow.style.width = '160vw';

bottomGlow.style.height = '520px';

bottomGlow.style.borderRadius = '50%';

bottomGlow.style.background = `
radial-gradient(
    circle,
    rgba(255,190,120,0.10) 0%,
    rgba(120,210,255,0.08) 42%,
    transparent 76%
)
`;

bottomGlow.style.filter = 'blur(70px)';

bottomGlow.style.opacity = '0.9';

bottomGlow.style.pointerEvents = 'none';

background.appendChild(bottomGlow);

// =========================
// FLOATING BLOBS
// =========================

const blobsConfig = [

    {
        size: 240,

        color:
            'rgba(120,210,255,0.10)',

        top: '12%',

        left: '8%',

        duration: '18s'
    },

    {
        size: 180,

        color:
            'rgba(255,255,255,0.06)',

        top: '58%',

        left: '72%',

        duration: '22s'
    },

    {
        size: 200,

        color:
            'rgba(255,170,90,0.08)',

        top: '72%',

        left: '18%',

        duration: '20s'
    }

];

// =========================
// CREATE BLOBS
// =========================

blobsConfig.forEach((config, index) => {

    const blob = document.createElement('div');

    blob.style.position = 'fixed';

    blob.style.width =
        `${config.size}px`;

    blob.style.height =
        `${config.size}px`;

    blob.style.top =
        config.top;

    blob.style.left =
        config.left;

    blob.style.borderRadius = '50%';

    blob.style.background =
        config.color;

    blob.style.filter =
        'blur(55px)';

    blob.style.opacity = '0.9';

    blob.style.pointerEvents = 'none';

    blob.style.willChange =
        'transform';

    blob.style.animation =
        `floatBlob${index} ${config.duration} ease-in-out infinite alternate`;

    background.appendChild(blob);

    // =========================
    // KEYFRAMES
    // =========================

    const style = document.createElement('style');

    style.textContent = `
    
    @keyframes floatBlob${index} {

        0% {

            transform:
                translate3d(0px, 0px, 0px)
                scale(1);

        }

        100% {

            transform:
                translate3d(
                    ${20 + (index * 10)}px,
                    ${-30 - (index * 8)}px,
                    0
                )
                scale(1.08);

        }

    }

    `;

    document.head.appendChild(style);

});