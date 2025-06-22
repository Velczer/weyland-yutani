// Check for transaction code
export async function checkCode() {
  const code = document.getElementById('codeInput').value.trim();
  const loader = document.getElementById('loader');
  loader.classList.add('show');

  if (code.length == 0) {
    const modal = document.getElementById('buyTicket');
    if (modal) {
      modal.classList.add("show");
    }
    loader.classList.remove('show');
    return;
  }

  const response = await fetch('/.netlify/functions/verify-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code
    })
  });

  if (!response.ok) {
    const modal = document.getElementById('buyTicket');
    if (modal) {
      modal.classList.add("show");
    }
    loader.classList.remove('show');
    return;
  }

  const result = await response.json();

  if (result.redirect) {
    window.location.href = result.redirect;
  } else {
    loader.classList.remove('show');
    alert("❌ Coś poszło nie tak");
  }
}

export function initTransaction() {
  const checkCodeEl = document.querySelector('.js-check-code');
  if (checkCodeEl) {
    checkCodeEl.addEventListener('click', checkCode);
  }
}