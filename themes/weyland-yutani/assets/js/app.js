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

// Init functions
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAccessControl();
  initTransaction();
  initModals();
  initAlienPuzzle();

  // Start the future time display
  displayFutureDateTime();

  document.querySelectorAll('.gsap-fade-in').forEach(setupFadeInAnimation);
});