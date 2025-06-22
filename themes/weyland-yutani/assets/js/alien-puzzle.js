import { initiateOverride } from './terminal.js';
import { getItemWithExpiry } from './helpers/getItemWithExpiry.js';

const size = 4;
const puzzle = document.getElementById('alien-puzzle');

let tiles = [];
let emptyIndex = size * size - 1;

function createTiles() {
  tiles = Array.from({ length: size * size }, (_, i) => i);
  do {
    shuffle(tiles);
  } while (!isSolvable(tiles) || tiles.indexOf(size * size - 1) !== tiles.length - 1);

  renderInitialTiles();
  updateTilePositions();
  emptyIndex = tiles.indexOf(size * size - 1);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function isSolvable(array) {
  let invCount = 0;
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] !== size * size - 1 && array[j] !== size * size - 1 && array[i] > array[j]) {
        invCount++;
      }
    }
  }
  const emptyRowFromBottom = size - Math.floor(array.indexOf(size * size - 1) / size);
  if (size % 2 === 0) {
    return (invCount + emptyRowFromBottom) % 2 === 0;
  }
  return invCount % 2 === 0;
}

function renderInitialTiles() {
  puzzle.innerHTML = '';
  tiles.forEach((value) => {
    const tile = document.createElement('div');
    tile.classList.add('alien-puzzle__tile');
    tile.dataset.index = value;

    if (value === size * size - 1) {
      tile.classList.add('alien-puzzle__empty');
    } else {
      const x = value % size;
      const y = Math.floor(value / size);
      tile.style.backgroundPosition = `${-x * 100}% ${-y * 100}%`;
      tile.addEventListener('click', () => moveTile(value));
    }

    tile.style.transition = 'transform 0.3s ease';
    tile.style.position = 'absolute';
    puzzle.appendChild(tile);
  });
}

function updateTilePositions() {
  const allTiles = document.querySelectorAll('.alien-puzzle__tile');
  allTiles.forEach((tile) => {
    const index = tiles.indexOf(parseInt(tile.dataset.index));
    const x = index % size;
    const y = Math.floor(index / size);
    tile.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
  });
}

function moveTile(value) {
  const index = tiles.indexOf(value);
  const row = Math.floor(index / size);
  const col = index % size;
  const emptyRow = Math.floor(emptyIndex / size);
  const emptyCol = emptyIndex % size;

  const dx = Math.abs(row - emptyRow);
  const dy = Math.abs(col - emptyCol);

  if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
    [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
    emptyIndex = index;
    updateTilePositions();
    checkWin();
  }
}

function checkWin() {
  if (tiles.every((val, idx) => val === idx)) {
    initiateOverride();
  }
}

export function initAlienPuzzle() {
  const logo = document.querySelector('.logo');
  const puzzleKey = 'wy_logoClicks';

  const alienPuzzleClose = document.getElementById('alien-puzzle-close');
  const alienPuzzleContainer = document.getElementById('alien-puzzle-container');

  if (logo) {
    logo.addEventListener('click', () => {
      const clicks = parseInt(localStorage.getItem(puzzleKey)) || 0;
      const newClicks = clicks + 1;
      localStorage.setItem(puzzleKey, newClicks);

      if (newClicks >= 3) {
        localStorage.setItem('showPuzzle', 'true');
      }
    });
  }

  const hasAccess = getItemWithExpiry("corpToken") === "AUTHORIZED";

  if (localStorage.getItem('showPuzzle') === 'true' && !hasAccess) {
    alienPuzzleContainer?.classList.add('show');
    createTiles();

    alienPuzzleClose.addEventListener('click', () => {
      localStorage.removeItem('wy_logoClicks');
      localStorage.removeItem('showPuzzle');
      alienPuzzleContainer?.classList.remove('show');
    });
  }
}
