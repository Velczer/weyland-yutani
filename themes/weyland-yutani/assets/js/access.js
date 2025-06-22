function getItemWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = Date.now();
    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (e) {
    console.warn("Nieprawidłowe dane w localStorage:", e);
    return null;
  }
}

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