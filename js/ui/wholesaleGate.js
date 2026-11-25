/* =========================================================
   WHOLESALE GATE — acceso discreto al modo mayorista
   - Cualquier elemento con [data-wholesale-open] abre la
     ventana de contraseña (pie de página y "Mi pedido").
   - ?mayorista en la URL la abre directo (enlace para
     compartir con mayoristas).
   - Con el modo activo muestra la franja "Modo mayorista · Salir".
   Al entrar o salir se recarga la página para que todos los
   precios se pinten de nuevo con la regla correcta.
========================================================= */

(function () {

    const U = window.Omega.utils;

    const I = window.Omega.icons;

    const W = window.Omega.wholesale;

    let gate = null;

    let lastFocus = null;


    const ERRORS = {
        'bad-password': 'Contraseña incorrecta. Revísala o escríbenos por WhatsApp.',
        'missing': 'El acceso mayorista no está disponible en este momento. Escríbenos por WhatsApp.',
        'unsupported': 'Tu navegador no permite este acceso. Ábrelo en Chrome o Safari actualizado.',
        'bad-file': 'El acceso mayorista no está disponible en este momento. Escríbenos por WhatsApp.'
    };


    function build() {

        gate = U.el(`
            <div class="wgate" aria-hidden="true">
                <div class="wgate-backdrop" data-wclose></div>
                <form class="wgate-panel" role="dialog" aria-modal="true" aria-labelledby="wgateTitle" novalidate>
                    <button type="button" class="icon-button wgate-x" data-wclose aria-label="Cerrar">${I.close}</button>
                    <h2 id="wgateTitle">Compras por mayor</h2>
                    <p>Si eres cliente mayorista de Omega, ingresa la contraseña que te compartimos para ver los precios por mayor.</p>
                    <label class="visually-hidden" for="wgatePass">Contraseña de mayorista</label>
                    <input id="wgatePass" class="wgate-input" type="password" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" placeholder="Contraseña">
                    <p class="wgate-error" role="alert" hidden></p>
                    <button type="submit" class="button button--solid button--block" data-wsubmit>Entrar</button>
                    <button type="button" class="button button--ghost button--block" data-wclose>Seguir comprando por unidad</button>
                    <a class="wgate-help" href="${window.Omega.whatsapp.wholesaleAccess()}" target="_blank" rel="noopener" data-track="click_wholesale_access">¿Aún no eres mayorista? Escríbenos</a>
                </form>
            </div>`);

        document.body.appendChild(gate);

        gate.addEventListener('click', event => {
            if (event.target.closest('[data-wclose]')) close();
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && gate.classList.contains('is-open')) close();
        });

        gate.querySelector('form').addEventListener('submit', submit);

        gate.querySelector('.wgate-input').addEventListener('input', () => showError(''));

    }


    function showError(message) {

        const node = gate.querySelector('.wgate-error');

        node.textContent = message;

        node.hidden = !message;

    }


    async function submit(event) {

        event.preventDefault();

        const input = gate.querySelector('.wgate-input');

        const button = gate.querySelector('[data-wsubmit]');

        if (!input.value.trim()) { showError('Escribe la contraseña.'); input.focus(); return; }

        button.disabled = true;

        button.textContent = 'Verificando…';

        try {

            const count = await W.unlock(input.value);

            button.textContent = `Listo: ${count} productos con precio por mayor`;

            setTimeout(() => location.reload(), 700);

        } catch (error) {

            showError(ERRORS[error.message] || ERRORS.missing);

            window.Omega.analytics.track('wholesale_login_failed', { reason: error.message });

            button.disabled = false;

            button.textContent = 'Entrar';

            input.select();

        }

    }


    function open() {

        if (W.isActive()) return;

        if (!gate) build();

        lastFocus = document.activeElement;

        if (window.Omega.cartDrawer && document.querySelector('.drawer.is-open')) window.Omega.cartDrawer.close();

        gate.classList.add('is-open');

        gate.setAttribute('aria-hidden', 'false');

        document.documentElement.classList.add('no-scroll');

        setTimeout(() => gate.querySelector('.wgate-input').focus(), 50);

        window.Omega.analytics.track('wholesale_gate_open');

    }


    function close() {

        gate.classList.remove('is-open');

        gate.setAttribute('aria-hidden', 'true');

        document.documentElement.classList.remove('no-scroll');

        showError('');

        if (lastFocus) lastFocus.focus();

    }


    function banner() {

        const bar = U.el(`
            <div class="wbar" role="status">
                <p><strong>Modo mayorista</strong><span> · precio por mayor desde ${W.minimum()} u. del mismo producto</span></p>
                <button type="button" class="wbar-exit" data-wholesale-exit>Salir</button>
            </div>`);

        const header = document.querySelector('.site-header');

        if (header) header.after(bar);
        else document.body.prepend(bar);

        bar.querySelector('[data-wholesale-exit]').addEventListener('click', () => {
            W.lock();
            location.reload();
        });

    }


    function mount() {

        if (!W || !W.isEnabled()) {
            document.querySelectorAll('[data-wholesale-open]').forEach(n => n.remove());
            return;
        }

        if (W.isActive()) banner();

        document.addEventListener('click', event => {
            if (event.target.closest('[data-wholesale-open]')) open();
        });

        // Enlace directo: ?mayorista
        const params = new URLSearchParams(location.search);

        const key = W.config.PARAMETRO_URL || 'mayorista';

        if (params.has(key)) {

            params.delete(key);

            const query = params.toString();

            history.replaceState(null, '', location.pathname + (query ? '?' + query : '') + location.hash);

            if (!W.isActive()) open();

        }

    }


    mount();

    window.Omega.wholesaleGate = { open, close };

})();
