let menuButton = document.getElementById('hamburger-icon');
let menu = document.getElementById('header-links');
let menuActive = false;

function toggleMobileMenu() {
    if (menuActive) {
        menu.style.display = 'none';
        menuActive = false;
    } else {
        menu.style.display = 'flex';
        menuActive = true;
    }
}

menuButton.addEventListener('click', e => {toggleMobileMenu()})

window.addEventListener('resize', () => {
    if (window.innerWidth > 767) {
        menu.style.display = '';

        menuActive = false;
    }
});