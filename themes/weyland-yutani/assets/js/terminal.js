

// Terminal JS hack
const commands = [
  "[OVRD] CONNECTING TO NODE... ✔",
  "[OVRD] HANDSHAKE PROTOCOL INITIATED...",
  "[OVRD] BYPASSING SECURITY TOKEN...",
  "[OVRD] ACCESS LEVEL: EMPLOYEE",
  "[OVRD] ELEVATING PERMISSIONS... ███████████████ 100%",
  "[OVRD] ROOT CREDENTIALS ACCEPTED.",
  "[OVRD] ACCESSING /usr/sys/wy-core/blackbox",
  "[OVRD] DECRYPTING... DONE",
  "[OVRD] SYSTEM OVERRIDE: ACTIVE",
  "[OVRD] CONNECTION STABLE",
  "[OVRD] ACCESSING HIGH-CONFIDENTIAL DATA...",
];

function setItemWithExpiry(key, value, ttl) {
  const now = Date.now();
  const item = {
    value: value,
    expiry: now + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function initiateOverride() {
  const overlay = document.getElementById('terminal-overlay');
  const terminal = document.getElementById('terminal');
  const accessText = document.getElementById('terminal-access');
  const button = document.querySelector('.override-btn');

  const dataInputSound = document.getElementById("dataInputSound");
  dataInputSound.currentTime = 0; // resetuje, by zagrało od początku
  dataInputSound.play().catch(e => console.warn("Nie można odtworzyć dźwięku:", e));

  overlay.classList.add('show');
  button.style.display = 'none';
  terminal.innerHTML = '';
  document.body.style.overflow = 'hidden';

  let lineIndex = 0;

  function typeLine(line, callback) {
    const container = document.createElement('div');
    terminal.appendChild(container);

    let charIndex = 0;
    const cursor = document.createElement('span');
    cursor.className = 'blinking-cursor';
    container.appendChild(cursor);

    function typeChar() {
      if (charIndex < line.length) {
        cursor.insertAdjacentText('beforebegin', line[charIndex]);
        charIndex++;
        terminal.scrollTop = terminal.scrollHeight;
        setTimeout(typeChar, 10 + Math.random() * 35);
      } else {
        container.removeChild(cursor);
        callback();
      }
    }

    typeChar();
  }

  function typeNext() {
    if (lineIndex < commands.length) {
      typeLine(commands[lineIndex], () => {
        lineIndex++;
        setTimeout(typeNext, 200);
      });
    } else {
        accessText.classList.add('show');
        dataInputSound.pause();
        dataInputSound.currentTime = 0;
        const accessGrantedSound = document.getElementById("accessGrantedSound");
        accessGrantedSound.currentTime = 0; // resetuje, by zagrało od początku
        accessGrantedSound.play().catch(e => console.warn("Nie można odtworzyć dźwięku:", e));

      setTimeout(() => {
        setItemWithExpiry("corpToken", "AUTHORIZED" , 10 * 60 * 60 * 1000); // expire za 10h
        location.reload();
      }, 2000);
    }
  }

  typeNext();
}

 