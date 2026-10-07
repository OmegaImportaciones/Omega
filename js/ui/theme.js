/* =========================================================
   THEME — modo claro / oscuro (clave "omega-theme")
   El tema inicial lo aplica el script inline del <head>.
========================================================= */

(function () {

    const KEY = 'omega-theme';

    const root = document.documentElement;


    function isDark() {

        return root.getAttribute('data-theme') === 'dark';

    }


    function sync(button) {

        const dark = isDark();

        button.innerHTML = dark ? window.Omega.icons.sun : window.Omega.icons.moon;

        button.setAttribute('aria-pressed', dark ? 'true' : 'false');

        button.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');

        const meta = document.querySelector('meta[name="theme-color"]');

        if (meta) meta.setAttribute('content', dark ? '#131518' : '#e8ebee');

    }


    function bind(button) {

        if (!button) return;

        sync(button);

        button.addEventListener('click', () => {

            const next = isDark() ? 'light' : 'dark';

            root.setAttribute('data-theme', next);

            try { localStorage.setItem(KEY, next); } catch (e) { /* sin storage */ }

            sync(button);

            window.Omega.analytics.track('toggle_theme', { theme: next });

        });

    }


    window.Omega.theme = { bind };

})();
