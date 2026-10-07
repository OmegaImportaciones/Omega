/* =========================================================
   TOAST — confirmaciones breves ("Agregado a tu pedido")
========================================================= */

(function () {

    let node = null;

    let timer = null;


    function show(message, actionLabel, onAction) {

        if (!node) {

            node = document.createElement('div');

            node.className = 'toast';

            node.setAttribute('role', 'status');

            node.setAttribute('aria-live', 'polite');

            document.body.appendChild(node);

        }

        node.innerHTML = `<span>${window.Omega.utils.escapeHTML(message)}</span>`;

        if (actionLabel) {

            const button = document.createElement('button');

            button.type = 'button';

            button.className = 'toast-action';

            button.textContent = actionLabel;

            button.addEventListener('click', () => { hide(); onAction(); });

            node.appendChild(button);

        }

        node.classList.add('is-visible');

        clearTimeout(timer);

        timer = setTimeout(hide, 3200);

    }


    function hide() {

        if (node) node.classList.remove('is-visible');

    }


    window.Omega.toast = { show, hide };

})();
