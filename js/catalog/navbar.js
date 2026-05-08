const header =
    document.getElementById('catalogHeader');

const logo =
    document.querySelector('.catalog-logo');

const backButton =
    document.querySelector('.compact-back-button');

const searchWrapper =
    document.querySelector('.catalog-search-wrapper');


window.addEventListener('scroll', () => {

    if (window.scrollY > 120) {

        header.classList.add('compact');

    } else {

        header.classList.remove('compact');

    }

});