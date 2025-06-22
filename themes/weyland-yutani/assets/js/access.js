import { getItemWithExpiry } from './helpers/getItemWithExpiry.js';

export function initAccessControl() {
  const hasAccess = getItemWithExpiry("corpToken") === "AUTHORIZED";

  if (hasAccess) {
    document.querySelectorAll("li[data-restricted='true']").forEach(el => {
      el.classList.add("show-restricted");
    });

    const button = document.querySelector(".override-btn");
    if (button) {
      button.style.display = "none";
    }
  }

  document.querySelectorAll("li[data-restricted='true'] .button").forEach(btn => {
    btn.addEventListener("click", event => {
      if (!hasAccess) {
        event.preventDefault();
      }
    });
  });
}