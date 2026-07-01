/* ====================== SVG PIPE ICONS ======================
   Each elbow shape is named for the TWO sides it physically connects.
   e.g. elbowTR = a pipe bend that connects the TOP edge to the RIGHT edge.
   This matters for the puzzle: a piece is only "correct" in a slot if its
   open ends actually line up with the pipe coming in and the pipe going out. */
const SVG = {
  source: `<svg viewBox="0 0 48 48"><rect x="14" y="4" width="20" height="16" rx="2" fill="none" stroke="#1b3a5c" stroke-width="3"/><rect x="20" y="20" width="8" height="10" fill="#4a90c4"/><path d="M14 14 a10 4 0 0 0 20 0" fill="none" stroke="#1b3a5c" stroke-width="3"/></svg>`,
  house: `<svg viewBox="0 0 48 48"><path d="M8 24 L24 10 L40 24" fill="none" stroke="#1b3a5c" stroke-width="3"/><rect x="12" y="24" width="24" height="16" fill="none" stroke="#1b3a5c" stroke-width="3"/><rect x="21" y="30" width="6" height="10" fill="#1b3a5c"/></svg>`,

  // straight pieces: connect two opposite sides
  straightH: `<svg viewBox="0 0 48 48"><rect x="0" y="18" width="48" height="12" fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/></svg>`, // left + right
  straightV: `<svg viewBox="0 0 48 48"><rect x="18" y="0" width="12" height="48" fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/></svg>`, // top + bottom

  // elbow pieces: connect two adjacent sides (named by which sides they open to)
  elbowTR: `<svg viewBox="0 0 48 48"><path d="M18 0 L18 30 L48 30 L48 18 L30 18 L30 0 Z" fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/></svg>`, // top + right
  elbowTL: `<svg viewBox="0 0 48 48"><path d="M30 0 L30 30 L0 30 L0 18 L18 18 L18 0 Z" fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/></svg>`, // top + left
  elbowBR: `<svg viewBox="0 0 48 48"><path d="M18 48 L18 18 L48 18 L48 30 L30 30 L30 48 Z" fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/></svg>`, // bottom + right
  elbowBL: `<svg viewBox="0 0 48 48"><path d="M30 48 L30 18 L0 18 L0 30 L18 30 L18 48 Z" fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/></svg>`, // bottom + left

  tee: `<svg viewBox="0 0 48 48"><rect x="0" y="18" width="48" height="12" fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/><rect x="18" y="18" width="12" height="30" fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/></svg>`, // left + right + bottom
};

/* tray always offers these 4 shape categories (matches wireframe: straight, elbow, elbow, tee) */
const TRAY_SHAPES = ['straightH', 'elbowTR', 'elbowBL', 'tee'];

/* ====================== LEVEL DEFINITIONS ======================
   Grid coordinates r,c. Each level has: cols, rows, source pos, house pos,
   fixed pipes (decorative, already connected), and slots[] the player must fill
   with the correct shape key so the path lines up all the way to the house. */
function buildLevels() {
  const lv = [];
  for (let i = 1; i <= 10; i++) {
    const cols = 5;
    const rows = 4;
    const numSlots = Math.min(1 + Math.floor((i - 1) / 2), 4); // difficulty ramps 1->4 slots

    const fixed = {};
    const slots = {};
    fixed['0,0'] = 'source';     // exits to the right, toward 0,1
    fixed['3,4'] = 'house';      // entered from above, from 2,4

    // Path: source(0,0) -> right along row 0 -> bend down at col 2 ->
    // down column 2 -> bend right at row 2 -> right along row 2 -> bend down at col 4 -> house(3,4)
    // Each piece's required shape is chosen so its open ends match the
    // direction water enters from and the direction it needs to exit toward.
    const pathCells = [
      ['0,1', 'straightH'], // enters from left (source), exits right -> straight left/right
      ['0,2', 'elbowBL'],   // enters from left, must exit DOWN -> connects left + bottom
      ['1,2', 'straightV'], // enters from top, exits bottom -> straight top/bottom
      ['2,2', 'elbowTR'],   // enters from top, must exit RIGHT -> connects top + right
      ['2,3', 'straightH'], // enters from left, exits right -> straight left/right
      ['2,4', 'elbowBL'],   // enters from left, must exit DOWN into house -> connects left + bottom
    ];

    // assign which path cells become player-filled slots based on numSlots
    const candidateKeys = pathCells.map(p => p[0]);
    const chosen = [];
    const step = Math.max(1, Math.floor(candidateKeys.length / numSlots));
    for (let k = 0; k < numSlots; k++) {
      chosen.push(candidateKeys[Math.min(k * step, candidateKeys.length - 1)]);
    }
    const uniqueChosen = [...new Set(chosen)];

    pathCells.forEach(([key, shape]) => {
      if (uniqueChosen.includes(key)) {
        slots[key] = shape;
      } else {
        fixed[key] = shape;
      }
    });

    lv.push({
      id: i,
      cols,
      rows,
      fixed,
      slots,
      timeLimit: 60 + i * 5,
      reward: 10,
    });
  }
  return lv;
}
const LEVELS = buildLevels();

const FACTS = [
  "Millions of people still don't have access to clean water.",
  "Clean water means better health, education, and brighter futures.",
  "Girls in sub-Saharan Africa spend 200 million hours every day collecting water.",
  "Access to clean water can free up time for school and work.",
  "Waterborne illness is one of the leading causes of child mortality worldwide.",
  "Every $1 invested in clean water can return $4 in economic gains.",
  "Clean water projects can transform an entire community's future.",
  "Walking for water is often a multi-hour daily journey for women and children.",
  "Simple, sustainable water systems can serve a village for generations.",
  "You just helped fund the idea of clean water reaching a real community.",
];

/* ====================== STATE ====================== */
let state = {
  score: 0,
  unlocked: 1, // highest unlocked level
  stars: {},   // levelId -> stars earned
  currentLevel: null,
  selectedTrayShape: null,
  filledCount: 0,
  timer: null,
  secondsElapsed: 0,
  timeLimit: 0,
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('dbd_state_v1'));
    if (saved) state = Object.assign(state, saved, { timer: null });
  } catch (e) {}
}
function saveState() {
  const toSave = { score: state.score, unlocked: state.unlocked, stars: state.stars };
  try { localStorage.setItem('dbd_state_v1', JSON.stringify(toSave)); } catch (e) {}
}

/* ====================== NAVIGATION ====================== */
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('score-start').textContent = state.score;
  document.getElementById('score-levels').textContent = state.score;
}

/* ====================== LEVEL SELECT RENDER ====================== */
function renderLevels() {
  const grid = document.getElementById('level-grid');
  grid.innerHTML = '';
  LEVELS.forEach(lv => {
    const locked = lv.id > state.unlocked;
    const card = document.createElement('div');
    card.className = 'level-card' + (locked ? ' locked' : '');
    const starCount = state.stars[lv.id] || 0;
    let starsHtml = '';
    if (locked) {
      starsHtml = '🔒';
    } else {
      starsHtml = [1, 2, 3].map(n => n <= starCount ? '★' : '<span style="color:#d7dee5;">★</span>').join('');
    }
    card.innerHTML = `<div class="num">${lv.id}</div><div class="stars">${starsHtml}</div>`;
    if (!locked) {
      card.onclick = () => startLevel(lv.id);
    }
    grid.appendChild(card);
  });
}

/* ====================== GAMEPLAY ====================== */
function startLevel(id) {
  const lv = LEVELS.find(l => l.id === id);
  state.currentLevel = lv;
  state.filledCount = 0;
  state.selectedTrayShape = null;
  state.secondsElapsed = 0;
  state.timeLimit = lv.timeLimit;
  document.getElementById('level-badge').textContent = 'LEVEL ' + id;
  renderGrid(lv);
  renderTray();
  goTo('screen-game');
  startTimer();
}

function cellKey(r, c) { return r + ',' + c; }

function renderGrid(lv) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${lv.cols}, 56px)`;
  grid.style.gridTemplateRows = `repeat(${lv.rows}, 56px)`;
  for (let r = 0; r < lv.rows; r++) {
    for (let c = 0; c < lv.cols; c++) {
      const key = cellKey(r, c);
      const div = document.createElement('div');
      div.className = 'cell';
      div.dataset.key = key;
      if (lv.fixed[key] === 'source') {
        div.classList.add('source');
        div.innerHTML = SVG.source;
      } else if (lv.fixed[key] === 'house') {
        div.classList.add('target');
        div.innerHTML = SVG.house;
      } else if (lv.fixed[key]) {
        div.innerHTML = SVG[lv.fixed[key]];
      } else if (lv.slots[key]) {
        div.classList.add('slot');
        div.dataset.required = lv.slots[key];
        div.onclick = () => handleSlotClick(div);
      }
      grid.appendChild(div);
    }
  }
}

function renderTray() {
  const tray = document.getElementById('tray');
  tray.innerHTML = '';
  TRAY_SHAPES.forEach(shape => {
    const piece = document.createElement('div');
    piece.className = 'tray-piece';
    piece.dataset.shape = shape;
    piece.innerHTML = SVG[shape];
    piece.onclick = () => selectTrayPiece(piece, shape);
    tray.appendChild(piece);
  });
}

function selectTrayPiece(el, shape) {
  document.querySelectorAll('.tray-piece').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedTrayShape = shape;
}

function handleSlotClick(div) {
  if (div.classList.contains('filled')) return;
  if (!state.selectedTrayShape) {
    showToast('Pick a pipe piece first!', 'bad');
    return;
  }
  const required = div.dataset.required;
  if (state.selectedTrayShape === required) {
    div.innerHTML = SVG[required];
    div.classList.add('filled', 'correct');
    div.onclick = null;
    state.filledCount++;
    showToast('Nice connection!', 'good');
    checkLevelComplete();
  } else {
    div.classList.add('wrong');
    state.score = Math.max(0, state.score - 5);
    updateScoreDisplays();
    showToast("That pipe doesn't fit there! -5 points", 'bad');
    setTimeout(() => div.classList.remove('wrong'), 350);
  }
}

function updateScoreDisplays() {
  document.getElementById('score-start').textContent = state.score;
  document.getElementById('score-levels').textContent = state.score;
}

function showToast(msg, type) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'feedback-toast show ' + (type || '');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 1400);
}

function startTimer() {
  clearInterval(state.timer);
  updateTimerDisplay();
  state.timer = setInterval(() => {
    state.secondsElapsed++;
    updateTimerDisplay();
    if (state.secondsElapsed >= state.timeLimit) {
      clearInterval(state.timer);
      showToast("Time's up! Try again.", 'bad');
      setTimeout(() => { startLevel(state.currentLevel.id); }, 1300);
    }
  }, 1000);
}
function updateTimerDisplay() {
  const remaining = Math.max(0, state.timeLimit - state.secondsElapsed);
  const m = String(Math.floor(remaining / 60)).padStart(2, '0');
  const s = String(remaining % 60).padStart(2, '0');
  document.getElementById('timer-display').textContent = `${m}:${s}`;
}
function pauseGame() {
  if (!state.timer) return;
  clearInterval(state.timer);
  state.timer = null;
  showToast('Paused — tap PLAY to resume', 'bad');
  setTimeout(() => { startTimer(); }, 1600);
}

function resetLevel() {
  if (!state.currentLevel) return;
  showToast('Level reset', 'good');
  startLevel(state.currentLevel.id);
}

function checkLevelComplete() {
  const lv = state.currentLevel;
  const totalSlots = Object.keys(lv.slots).length;
  if (state.filledCount >= totalSlots) {
    clearInterval(state.timer);
    const timeUsed = state.secondsElapsed;
    let stars = 1;
    if (timeUsed < lv.timeLimit * 0.5) stars = 3;
    else if (timeUsed < lv.timeLimit * 0.8) stars = 2;
    state.stars[lv.id] = Math.max(state.stars[lv.id] || 0, stars);
    state.score += lv.reward;
    updateScoreDisplays();
    if (lv.id + 1 > state.unlocked && lv.id < 10) state.unlocked = lv.id + 1;
    saveState();
    showComplete(lv, stars);
  }
}

function showComplete(lv, stars) {
  document.getElementById('complete-level-label').textContent = 'LEVEL ' + lv.id;
  document.getElementById('complete-points').textContent = lv.reward;
  const starsEl = document.getElementById('complete-stars');
  starsEl.innerHTML = [1, 2, 3].map(n => n <= stars ? '★' : '<span class="empty">★</span>').join('');
  goTo('screen-complete');
}

function goToFact() {
  document.getElementById('fact-text').textContent = FACTS[(state.currentLevel.id - 1) % FACTS.length];
  goTo('screen-fact');
}

function goToNextLevelOrDonate() {
  const lv = state.currentLevel;
  if (lv.id % 3 === 0 || lv.id === 10) {
    goTo('screen-donate');
  } else {
    goTo('screen-levels');
    renderLevels();
  }
}

function resetGame() {
  state.score = 0;
  state.unlocked = 1;
  state.stars = {};
  saveState();
  goTo('screen-start');
}

/* ====================== INIT ====================== */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderLevels();
  document.getElementById('score-start').textContent = state.score;
  document.getElementById('score-levels').textContent = state.score;
});