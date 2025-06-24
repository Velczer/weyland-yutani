import { initNavigation } from './navigation.js';
import { initAccessControl } from './access.js';
import { initTransaction } from './transaction.js';
import { setupFadeInAnimation } from './animations.js';
import { displayFutureDateTime } from './future-clock.js';
import { initModals } from './modal.js';
import { initAlienPuzzle } from './alien-puzzle.js';

// Netlify forms
document.querySelectorAll("form[netlify]").forEach(form => {
  form.addEventListener("submit", () => {
    const loader = document.getElementById('loader');
    loader.classList.add('show');
  });
});


const warning = document.getElementById('f11-warning');

// Wykrycie trybu pełnoekranowego
function checkFullscreen() {
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    window.innerHeight === screen.height
  ) {
    warning.classList.add('hide');
  }
}

// Obsługa klawisza F11
document.addEventListener('keydown', (e) => {
  if (e.key === 'F11') {
    // Daj chwilę na wejście w fullscreen
    setTimeout(checkFullscreen, 500);
  }
});

// Na wszelki wypadek – wykryj fullscreen zmiany systemowe
document.addEventListener('fullscreenchange', checkFullscreen);
document.addEventListener('webkitfullscreenchange', checkFullscreen);
document.addEventListener('mozfullscreenchange', checkFullscreen);

// Init functions
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAccessControl();
  initTransaction();
  initModals();
  initAlienPuzzle();

  // Start the future time display
  displayFutureDateTime();
  checkFullscreen()

  document.querySelectorAll('.gsap-fade-in').forEach(setupFadeInAnimation);
});

