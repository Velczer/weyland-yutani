import { initiateOverride } from './terminal.js';
import { getItemWithExpiry } from './helpers/getItemWithExpiry.js';

const size = 4;
const puzzle = document.getElementById('alien-puzzle');

let tiles = [];
let emptyIndex = size * size - 1;

function createTiles() {
  tiles = Array.from({ length: size * size }, (_, i) => i);
  emptyIndex = tiles.length - 1;

  // wykonaj 1000 losowych ruchów
  for (let i = 0; i < 1000; i++) {
    const moves = getValidMoves(emptyIndex);
    const move = moves[Math.floor(Math.random() * moves.length)];
    [tiles[emptyIndex], tiles[move]] = [tiles[move], tiles[emptyIndex]];
    emptyIndex = move;
  }

  renderInitialTiles();
  updateTilePositions();
}

function getValidMoves(index) {
  const row = Math.floor(index / size);
  const col = index % size;
  const moves = [];

  if (row > 0) moves.push(index - size);     // up
  if (row < size - 1) moves.push(index + size); // down
  if (col > 0) moves.push(index - 1);        // left
  if (col < size - 1) moves.push(index + 1); // right

  return moves;
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
      tile.addEventListener('click', handleTileClick);
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

function handleTileClick(e) {
  const clickedIndex = tiles.indexOf(parseInt(e.target.dataset.index));
  moveTile(clickedIndex);
}

function moveTile(index) {
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
    setTimeout(() => {
      initiateOverride();
    }, 600);
  }
}

export function initAlienPuzzle() {
  const logo = document.querySelector('.footer__logo');
  const puzzleKey = 'wy_logoClicks';

  if (logo) {
    logo.addEventListener('click', () => {
      const clicks = parseInt(localStorage.getItem(puzzleKey)) || 0;
      const newClicks = clicks + 1;
      localStorage.setItem(puzzleKey, newClicks);

      if (newClicks >= 3) {
        localStorage.setItem('showPuzzle', 'true');
        showPuzzle()
      }
    });
  }

  const hasAccess = getItemWithExpiry("corpToken") === "AUTHORIZED";

  if (localStorage.getItem('showPuzzle') === 'true' && !hasAccess) {
    showPuzzle()
  }
}

function showPuzzle() {
  const alienPuzzleClose = document.getElementById('alien-puzzle-close');
  const alienPuzzleContainer = document.getElementById('alien-puzzle-container');

  alienPuzzleContainer?.classList.add('show');
  createTiles();

  const hackingFazeSound = document.getElementById("hackingFazeSound");
  hackingFazeSound.currentTime = 0; // resetuje, by zagrało od początku
  hackingFazeSound.play().catch(e => console.warn("Nie można odtworzyć dźwięku:", e));

  const startingSong = document.getElementById("startingSong");
  startingSong.pause();
  startingSong.currentTime = 0;

  alienPuzzleClose.addEventListener('click', () => {
    localStorage.removeItem('wy_logoClicks');
    localStorage.removeItem('showPuzzle');
    alienPuzzleContainer?.classList.remove('show');
    hackingFazeSound.pause();
    hackingFazeSound.currentTime = 0;
    startingSong.play().catch(e => console.warn("Nie można odtworzyć dźwięku:", e));
  });
}