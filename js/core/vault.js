/* =========================================================
   VAULT — cifrado de los precios mayoristas
   ESTE ARCHIVO ES IDÉNTICO en la web (js/core/vault.js) y en
   el generador (js/vault.js). Si cambias uno, copia el otro.

   Algoritmo (Web Crypto del navegador, sin librerías):
     clave  = PBKDF2-SHA256(contraseña, sal 16 B, 600.000 vueltas)
     cifra  = AES-GCM 256 (iv 12 B)
   La contraseña no se guarda en ningún lado. No distingue
   mayúsculas/minúsculas ni espacios al inicio o al final.
========================================================= */

(function () {

    const VERSION = 1;

    const ITERATIONS = 600000;

    const encoder = new TextEncoder();

    const decoder = new TextDecoder();


    function supported() {

        return !!(window.crypto && window.crypto.subtle);

    }


    function normalizePassword(password) {

        return String(password || '').normalize('NFC').trim().toLowerCase();

    }


    function toBase64(bytes) {

        let binary = '';

        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);

        return btoa(binary);

    }


    function fromBase64(text) {

        const binary = atob(text);

        const bytes = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        return bytes;

    }


    async function deriveKey(password, salt, iterations, usage) {

        const base = await crypto.subtle.importKey(
            'raw', encoder.encode(normalizePassword(password)), 'PBKDF2', false, ['deriveKey']
        );

        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
            base,
            { name: 'AES-GCM', length: 256 },
            false,
            [usage]
        );

    }


    // Objeto -> caja cifrada (objeto JSON listo para guardar)
    async function seal(payload, password) {

        const salt = crypto.getRandomValues(new Uint8Array(16));

        const iv = crypto.getRandomValues(new Uint8Array(12));

        const key = await deriveKey(password, salt, ITERATIONS, 'encrypt');

        const data = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(payload))
        );

        return {
            v: VERSION,
            kdf: 'PBKDF2-SHA256',
            iter: ITERATIONS,
            alg: 'AES-GCM-256',
            salt: toBase64(salt),
            iv: toBase64(iv),
            data: toBase64(new Uint8Array(data))
        };

    }


    // Caja cifrada -> objeto. Lanza error "bad-password" si no abre.
    async function open(box, password) {

        if (!box || box.v !== VERSION || !box.salt || !box.iv || !box.data) {
            throw new Error('bad-file');
        }

        const key = await deriveKey(password, fromBase64(box.salt), box.iter || ITERATIONS, 'decrypt');

        let plain;

        try {

            plain = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: fromBase64(box.iv) }, key, fromBase64(box.data)
            );

        } catch (error) {

            throw new Error('bad-password');

        }

        return JSON.parse(decoder.decode(plain));

    }


    window.OmegaVault = { seal, open, supported, normalizePassword, ITERATIONS };

})();
