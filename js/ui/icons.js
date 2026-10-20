/* =========================================================
   ICONS — SVG en línea (heredan color con currentColor)
========================================================= */

(function () {

    const stroke = (d, extra) =>
        `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra || ''}>${d}</svg>`;

    window.Omega.icons = {

        bag: stroke('<path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),

        search: stroke('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),

        moon: stroke('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>'),

        sun: stroke('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>'),

        pin: stroke('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>'),

        truck: stroke('<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/>'),

        qr: stroke('<rect x="3.5" y="3.5" width="6" height="6" rx="1"/><rect x="14.5" y="3.5" width="6" height="6" rx="1"/><rect x="3.5" y="14.5" width="6" height="6" rx="1"/><path d="M14.5 14.5h2.5v2.5M20.5 14.5v6h-3.5M14.5 18.5v2"/>'),

        shield: stroke('<path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>'),

        clock: stroke('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),

        close: stroke('<path d="M6 6l12 12M18 6 6 18"/>'),

        plus: stroke('<path d="M12 5v14M5 12h14"/>'),

        minus: stroke('<path d="M5 12h14"/>'),

        check: stroke('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),

        trash: stroke('<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>'),

        arrowLeft: stroke('<path d="M19 12H5M11 6l-6 6 6 6"/>'),

        chat: stroke('<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/>'),

        link: stroke('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),

        bolt: stroke('<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8Z"/>'),

        swap: stroke('<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>'),

        search2: stroke('<circle cx="10.5" cy="10.5" r="6"/><path d="m19.5 19.5-4.5-4.5M8 10.5h5"/>'),

        award: stroke('<circle cx="12" cy="9" r="5.5"/><path d="m8.6 13.4-1.6 7.1 5-2.5 5 2.5-1.6-7.1"/>'),

        cable: stroke('<path d="M7 3v4M11 3v4M5.5 7h7v4a3.5 3.5 0 0 1-7 0V7ZM9 14.5V17a4 4 0 0 0 8 0V9a2 2 0 0 1 4 0v12"/>'),

        hdmi: stroke('<path d="M3 8.5h18v4l-2.5 3h-13L3 12.5v-4Z"/><path d="M7 11.5h10"/>'),

        network: stroke('<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-4h12v4"/>'),

        audio: stroke('<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4.5" height="6" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="6" rx="1.5"/>'),

        usb: stroke('<path d="M12 21V5M9 7.5 12 4l3 3.5M12 16l-4.5-3V10M12 13.5l4.5-3V8"/><circle cx="7.5" cy="9" r="1.2"/><rect x="15.3" y="6.5" width="2.4" height="2.4"/>'),

        convert: stroke('<rect x="3" y="7" width="7" height="10" rx="1.5"/><rect x="14" y="7" width="7" height="10" rx="1.5"/><path d="M10 12h4"/>'),

        arrowRight: stroke('<path d="M5 12h14M13 6l6 6-6 6"/>'),

        // Emblema SAS: el trazo oscuro usa currentColor, el rojo es fijo
        sas: `<svg class="sas-mark" viewBox="190 190 640 640" aria-hidden="true">
                <g fill="none" stroke-width="64" stroke-linejoin="miter">
                    <path stroke="currentColor" d="M440 510 H228 A282 282 0 0 1 775 414"/>
                    <path stroke="var(--red)" d="M580 510 H792 A282 282 0 0 1 245 606"/>
                </g>
                <polygon fill="currentColor" points="470,330 545,330 460,655 375,655"/>
                <polygon fill="var(--red)" points="545,330 635,655 555,655 507,477"/>
              </svg>`,

        // Palabra SΛƧ (como en el logo original)
        sasWord: `<svg class="sas-word" viewBox="0 -8 450 156" aria-hidden="true">
                <g fill="none" stroke="currentColor" stroke-width="26">
                    <path d="M86 31 A38 30 0 1 0 50 70 A38 30 0 1 1 14 110"/>
                    <path transform="translate(450 0) scale(-1 1)" d="M86 31 A38 30 0 1 0 50 70 A38 30 0 1 1 14 110"/>
                </g>
                <polygon fill="currentColor" points="210,0 235,0 202,140 172,140"/>
                <polygon fill="var(--red)" points="235,0 278,140 248,140 222,55"/>
              </svg>`,

        // Isotipo Omega: dos medialunas cromadas (del logo de la marca)
        mark: `<svg class="brand-mark" viewBox="0 0 44 40" aria-hidden="true">
                <defs>
                    <linearGradient id="omegaChrome" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="var(--chrome-1)"/>
                        <stop offset=".45" stop-color="var(--chrome-2)"/>
                        <stop offset=".55" stop-color="var(--chrome-3)"/>
                        <stop offset="1" stop-color="var(--chrome-1)"/>
                    </linearGradient>
                </defs>
                <path fill="url(#omegaChrome)" d="M20 1.5A18.5 18.5 0 0 0 20 38.5A9 18.5 0 0 1 20 1.5Z"/>
                <path fill="url(#omegaChrome)" d="M24 1.5A18.5 18.5 0 0 1 24 38.5A9 18.5 0 0 0 24 1.5Z"/>
              </svg>`

    };

})();
