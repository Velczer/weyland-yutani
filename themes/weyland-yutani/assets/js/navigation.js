// navigation.js

export function initNavigation() {
  const mainHeader = document.querySelector('[data-header]');
  const mainNavigation = document.querySelector('[data-navigation]');
  const mobileNavigationTrigger = document.querySelector('[data-navigation-toggle]');
  const mobileNavigation = document.querySelector('[data-navigation-list]');

  if (!mainHeader || !mainNavigation || !mobileNavigationTrigger || !mobileNavigation) return;

  function navigationFocus() {
    const focusableElements = mainNavigation.querySelectorAll('a[href], button');
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    mainNavigation.addEventListener('keydown', function (e) {
      if (e.target === first && e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        last.focus();
      } else if (e.target === last && e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  function handleEscape() {
    document.addEventListener('keyup', function (e) {
      if (e.key === 'Escape' && mobileNavigation.classList.contains('open')) {
        mobileNavigationTrigger.setAttribute('aria-expanded', 'false');
        mobileNavigationTrigger.focus();
        mobileNavigation.classList.remove('open');
        mainHeader.classList.remove('main-header--navigation-open');
        mobileNavigationTrigger.innerHTML = "Open Menu";
      }
    });
  }

  mobileNavigationTrigger.addEventListener("click", function () {
    mainHeader.classList.toggle('main-header--navigation-open');
    mobileNavigation.classList.toggle("open");
    this.classList.toggle("nav-open");

    navigationFocus();
    handleEscape();

    if (mobileNavigation.classList.contains('open')) {
      this.setAttribute('aria-expanded', 'true');
      this.innerHTML = "Close Menu";
    } else {
      this.setAttribute('aria-expanded', 'false');
      this.innerHTML = "Open Menu";
    }
  });
}