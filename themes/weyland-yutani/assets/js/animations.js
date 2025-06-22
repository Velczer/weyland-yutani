
// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const mainHeader = document.querySelector('[data-header]');

ScrollTrigger.create({
  trigger: 'h1',
  start: 'top top+=100',
  end: 'max',
  onEnter: () => mainHeader.classList.add('main-header--faded'),
  onLeaveBack: () => mainHeader.classList.remove('main-header--faded'),
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
export const setupFadeInAnimation = (element) => {
  // Set initial state
  gsap.set(element, {
    opacity: 0,
    y: 30
  });

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
