const mainHeader = document.querySelector('[data-header]');
const mainNavigation = document.querySelector('[data-navigation]');
const mobileNavigationTrigger = document.querySelector('[data-navigation-toggle]');
const mobileNavigation = document.querySelector('[data-navigation-list]');
const fadeIns = document.querySelectorAll('.gsap-fade-in');

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: 'h1',
  start: 'top top+=100',
  end: 'max',
  onEnter: () => mainHeader.classList.add('main-header--faded'),
  onLeaveBack: () => mainHeader.classList.remove('main-header--faded'),
});

/**
 * Trap focus within navigation
 */
function navigationFocus() {
  const focusableElements = mainNavigation.querySelectorAll('a[href], button');
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  mainNavigation.addEventListener('keydown', function (e) {
    if (e.target === firstFocusableElement && e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      lastFocusableElement.focus();
    } else if (e.target === lastFocusableElement && e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      firstFocusableElement.focus();
    }
  });
}

/**
 * Close navigation if escape key is pressed
 */
function handleEscape() {
  document.addEventListener('keyup', function (e) {
    const escape = e.key;

    if (escape === 'Escape' && mobileNavigation.classList.contains('open')) {
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
  mobileNavigation.classList.toggle("open")
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

// Function to trigger the fade-in animation
const triggerFadeInAnimation = (element) => {
  gsap.to(element, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'sine.inOut',
  });
};

// Function to setup fade-in animations on scroll
const setupFadeInAnimation = (element) => {
  // Set initial state
  gsap.set(element, { opacity: 0, y: 30 });

  // Create ScrollTrigger instance
  const trigger = ScrollTrigger.create({
    trigger: element,
    start: 'top 90%',
    end: 'bottom top',
    once: true,
    onEnter: () => triggerFadeInAnimation(element)
  });

  // Handle focus for focusable child elements
  const focusableChildren = element.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  focusableChildren.forEach((child) => {
    child.addEventListener('focus', () => {
      if (!trigger.isActive) {
        triggerFadeInAnimation(element);
      }
    });
  });
};

// Initialize animations for fade-in elements
if (fadeIns.length > 0) {
  fadeIns.forEach(setupFadeInAnimation);
}

function displayFutureDateTime() {
  const clockElement = document.getElementById('clock');
  if (!clockElement) return;

  const FUTURE_YEAR = 2239;
  const CURRENT_YEAR = new Date().getFullYear();
  const YEAR_OFFSET = FUTURE_YEAR - CURRENT_YEAR;

  const updateTime = () => {
    const now = new Date();
    const futureYear = now.getFullYear() + YEAR_OFFSET;

    const dateString = `${futureYear}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    clockElement.innerHTML = `${dateString}<br>${timeString}`;
  };

  updateTime();
  setInterval(updateTime, 1000);
}

// Start the future time display
displayFutureDateTime();

document.addEventListener("DOMContentLoaded", function () {
  // Otwieranie
  document.querySelectorAll("[data-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("show");
      }
    });
  });

  // Zamknięcie przez kliknięcie w .close
  document.querySelectorAll(".modal .close").forEach(closeBtn => {
    closeBtn.addEventListener("click", () => {
      const modal = closeBtn.closest(".modal");
      if (modal) {
        modal.classList.remove("show");
      }
    });
  });

  // Zamknięcie przez kliknięcie w tło
  window.addEventListener("click", (event) => {
    document.querySelectorAll(".modal").forEach(modal => {
      if (event.target === modal) {
        modal.classList.remove("show");
      }
    });
  });
});

 async function checkCode() {
    const code = document.getElementById('codeInput').value.trim();

    const response = await fetch('/.netlify/functions/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = result.path;
    } else {

      const modal = document.getElementById('buyTicket');
      if (modal) {
        modal.classList.add("show");
      }
      alert("❌ Nieprawidłowy kod");
    }
}