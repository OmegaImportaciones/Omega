const header =
    document.getElementById('catalogHeader');


window.addEventListener('scroll', () => {

    if (window.scrollY > 80) {

        header.classList.add(
            'compact-active'
        );

    } else {

        header.classList.remove(
            'compact-active'
        );

    }

});