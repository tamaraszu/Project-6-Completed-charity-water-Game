/* ====================== SVG PIPE ICONS ======================
   Named for the TWO sides each piece physically opens to.
   elbowTR = opens at TOP and RIGHT, etc.               */
const SVG = {
  source: `<svg viewBox="0 0 48 48"><rect x="14" y="4" width="20" height="16" rx="2" fill="none" stroke="#1b3a5c" stroke-width="3"/><rect x="20" y="20" width="8" height="10" fill="#4a90c4"/><path d="M14 14 a10 4 0 0 0 20 0" fill="none" stroke="#1b3a5c" stroke-width="3"/></svg>`,
  house:  `<svg viewBox="0 0 48 48"><path d="M8 24 L24 10 L40 24" fill="none" stroke="#1b3a5c" stroke-width="3"/><rect x="12" y="24" width="24" height="16" fill="none" stroke="#1b3a5c" stroke-width="3"/><rect x="21" y="30" width="6" height="10" fill="#1b3a5c"/></svg>`,

  // Straight pieces
  straightH: `<svg viewBox="0 0 48 48"><rect x="0"  y="18" width="48" height="12" fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/></svg>`,   // LEFT + RIGHT
  straightV: `<svg viewBox="0 0 48 48"><rect x="18" y="0"  width="12" height="48" fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/></svg>`,   // TOP  + BOTTOM

  // Elbow pieces (named by their two open ends)
  elbowTR: `<svg viewBox="0 0 48 48"><path d="M18 0 L18 30 L48 30 L48 18 L30 18 L30 0 Z"    fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/></svg>`, // TOP  + RIGHT
  elbowTL: `<svg viewBox="0 0 48 48"><path d="M30 0 L30 30 L0  30 L0  18 L18 18 L18 0 Z"    fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/></svg>`, // TOP  + LEFT
  elbowBR: `<svg viewBox="0 0 48 48"><path d="M18 48 L18 18 L48 18 L48 30 L30 30 L30 48 Z"  fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/></svg>`, // BOTTOM + RIGHT
  elbowBL: `<svg viewBox="0 0 48 48"><path d="M30 48 L30 18 L0  18 L0  30 L18 30 L18 48 Z"  fill="#cfd9e0" stroke="#4a90c4" stroke-width="2"/></svg>`, // BOTTOM + LEFT
};

/* ====================== LEVEL DEFINITIONS ======================
   Every level is hand-crafted so the pipe path is unique.
   Convention: source always exits RIGHT; house always entered from TOP.

   How to read the path comments:
     → means "water flows right into next cell"
     ↓ means "water flows down into next cell"
     ← means "water flows left"
     [SLOT] = player must place this piece
     [FIXED] = pre-placed, shown from the start             */
const LEVELS = [

  /* LEVEL 1 — Simple L  (1 slot, beginner)
     (0,0)src →SH*→ (0,2)eBL ↓SV↓SV↓ house(3,2)        */
  {
    id:1, cols:4, rows:4,
    fixed: { '0,0':'source', '0,2':'elbowBL', '1,2':'straightV', '2,2':'straightV', '3,2':'house' },
    slots: { '0,1':'straightH' },
    tray:  ['straightH','straightV','elbowBL','elbowTR'],
    timeLimit:70, reward:10,
  },

  /* LEVEL 2 — Longer straight then drop  (1 slot)
     (0,0)src →SH→SH→eBL*↓SV↓SV↓ house(3,3)            */
  {
    id:2, cols:4, rows:4,
    fixed: { '0,0':'source', '0,1':'straightH', '0,2':'straightH', '1,3':'straightV', '2,3':'straightV', '3,3':'house' },
    slots: { '0,3':'elbowBL' },
    tray:  ['elbowBL','elbowBR','straightH','straightV'],
    timeLimit:75, reward:10,
  },

  /* LEVEL 3 — Zigzag right-down-right  (2 slots)
     (0,0)src →SH→eBL*↓eTR*→SH→eBL↓SV↓ house(3,4)      */
  {
    id:3, cols:5, rows:4,
    fixed: { '0,0':'source', '0,1':'straightH', '1,3':'straightH', '1,4':'elbowBL', '2,4':'straightV', '3,4':'house' },
    slots: { '0,2':'elbowBL', '1,2':'elbowTR' },
    tray:  ['elbowBL','elbowTR','straightH','straightV'],
    timeLimit:80, reward:10,
  },

  /* LEVEL 4 — U shape: right→down→right→down  (2 slots)
     (0,0)src →eBL*↓SV↓eTR*→SH→SH→eBL↓SV↓ house(4,4)  */
  {
    id:4, cols:5, rows:5,
    fixed: { '0,0':'source', '1,1':'straightV', '2,2':'straightH', '2,3':'straightH', '2,4':'elbowBL', '3,4':'straightV', '4,4':'house' },
    slots: { '0,1':'elbowBL', '2,1':'elbowTR' },
    tray:  ['elbowBL','elbowTR','straightH','straightV'],
    timeLimit:85, reward:10,
  },

  /* LEVEL 5 — S-curve  (3 slots)
     (0,0)src →SH*→eBL↓eTR*→eBL↓eTL*←eBR↓SV↓ house(4,2) */
  {
    id:5, cols:5, rows:5,
    fixed: { '0,0':'source', '0,2':'elbowBL', '1,3':'elbowBL', '2,2':'elbowBR', '3,2':'straightV', '4,2':'house' },
    slots: { '0,1':'straightH', '1,2':'elbowTR', '2,3':'elbowTL' },
    tray:  ['straightH','elbowTR','elbowTL','elbowBL'],
    timeLimit:85, reward:10,
  },

  /* LEVEL 6 — Wide then back  (3 slots)
     (0,0)src →SH→SH*→SH→eBL*↓SV↓eTL*←SH←eBR↓SV↓ house(4,2) */
  {
    id:6, cols:5, rows:5,
    fixed: { '0,0':'source', '0,1':'straightH', '0,3':'straightH', '1,4':'straightV', '2,3':'straightH', '2,2':'elbowBR', '3,2':'straightV', '4,2':'house' },
    slots: { '0,2':'straightH', '0,4':'elbowBL', '2,4':'elbowTL' },
    tray:  ['straightH','elbowBL','elbowTL','elbowBR'],
    timeLimit:90, reward:10,
  },

  /* LEVEL 7 — Down-across-down  (4 slots)
     (0,0)src →eBL*↓SV*↓eTR→SH*→SH→eBL*↓SV↓ house(4,4) */
  {
    id:7, cols:5, rows:5,
    fixed: { '0,0':'source', '2,1':'elbowTR', '2,3':'straightH', '3,4':'straightV', '4,4':'house' },
    slots: { '0,1':'elbowBL', '1,1':'straightV', '2,2':'straightH', '2,4':'elbowBL' },
    tray:  ['elbowBL','straightV','straightH','elbowTR'],
    timeLimit:90, reward:10,
  },

  /* LEVEL 8 — Complex zigzag  (4 slots)
     (0,0)src →SH→eBL*↓eTR*→SH*→eBL↓eTL*←eBR↓SV↓ house(4,3) */
  {
    id:8, cols:5, rows:5,
    fixed: { '0,0':'source', '0,1':'straightH', '1,4':'elbowBL', '2,3':'elbowBR', '3,3':'straightV', '4,3':'house' },
    slots: { '0,2':'elbowBL', '1,2':'elbowTR', '1,3':'straightH', '2,4':'elbowTL' },
    tray:  ['elbowBL','elbowTR','straightH','elbowTL'],
    timeLimit:95, reward:10,
  },

  /* LEVEL 9 — Long winding path  (5 slots), 6×6 grid
     (0,0)src →SH*→SH→eBL*←eTL*  (1,2)eBR*↓eTR*→SH→eBL↓SV↓SV↓ house(5,4) */
  {
    id:9, cols:6, rows:6,
    fixed: { '0,0':'source', '0,2':'straightH', '2,3':'straightH', '2,4':'elbowBL', '3,4':'straightV', '4,4':'straightV', '5,4':'house' },
    slots: { '0,1':'straightH', '0,3':'elbowBL', '1,3':'elbowTL', '1,2':'elbowBR', '2,2':'elbowTR' },
    tray:  ['straightH','elbowBL','elbowTL','elbowBR','elbowTR'],
    timeLimit:100, reward:10,
  },

  /* LEVEL 10 — Hardest: double-back maze  (6 slots), 6×6 grid
     (0,0)src →eBL*↓eTR*→SH*→eBL*↓eTL←eBR*↓eTR→SH*→eBL↓SV↓ house(5,4) */
  {
    id:10, cols:6, rows:6,
    fixed: { '0,0':'source', '2,3':'elbowTL', '3,2':'elbowTR', '3,4':'elbowBL', '4,4':'straightV', '5,4':'house' },
    slots: { '0,1':'elbowBL', '1,1':'elbowTR', '1,2':'straightH', '1,3':'elbowBL', '2,2':'elbowBR', '3,3':'straightH' },
    tray:  ['elbowBL','elbowTR','straightH','elbowBR','elbowTL'],
    timeLimit:105, reward:10,
  },
];

/* ====================== FACTS ====================== */
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
  "You just helped bring the idea of clean water to a real community.",
];

/* ====================== STATE ====================== */
let state = {
  score: 0,
  unlocked: 1,
  stars: {},
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
  updateScoreDisplays();
}

/* ====================== SCORE ====================== */
function updateScoreDisplays() {
  document.getElementById('score-start').textContent  = state.score;
  document.getElementById('score-levels').textContent = state.score;
}

/* ====================== LEVEL SELECT ====================== */
function renderLevels() {
  const grid = document.getElementById('level-grid');
  grid.innerHTML = '';
  LEVELS.forEach(lv => {
    const locked = lv.id > state.unlocked;
    const card   = document.createElement('div');
    card.className = 'level-card' + (locked ? ' locked' : '');
    const starCount = state.stars[lv.id] || 0;
    let starsHtml = locked
      ? '🔒'
      : [1,2,3].map(n => n <= starCount ? '★' : '<span style="color:#d7dee5;">★</span>').join('');
    card.innerHTML = `<div class="num">${lv.id}</div><div class="stars">${starsHtml}</div>`;
    if (!locked) card.onclick = () => startLevel(lv.id);
    grid.appendChild(card);
  });
}

/* ====================== GAMEPLAY ====================== */
function getCellSize(cols) {
  if (cols <= 4) return 60;
  if (cols <= 5) return 54;
  return 46; // 6-column levels need smaller cells on mobile
}

function startLevel(id) {
  const lv = LEVELS.find(l => l.id === id);
  state.currentLevel   = lv;
  state.filledCount    = 0;
  state.selectedTrayShape = null;
  state.secondsElapsed = 0;
  state.timeLimit      = lv.timeLimit;
  document.getElementById('level-badge').textContent = 'LEVEL ' + id;
  renderGrid(lv);
  renderTray(lv);
  goTo('screen-game');
  startTimer();
}

function cellKey(r, c) { return r + ',' + c; }

function renderGrid(lv) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  const cs = getCellSize(lv.cols);
  grid.style.gridTemplateColumns = `repeat(${lv.cols}, ${cs}px)`;
  grid.style.gridTemplateRows    = `repeat(${lv.rows}, ${cs}px)`;

  for (let r = 0; r < lv.rows; r++) {
    for (let c = 0; c < lv.cols; c++) {
      const key = cellKey(r, c);
      const div = document.createElement('div');
      div.className = 'cell';
      div.dataset.key = key;
      div.style.width  = cs + 'px';
      div.style.height = cs + 'px';

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

function renderTray(lv) {
  const tray = document.getElementById('tray');
  tray.innerHTML = '';
  lv.tray.forEach(shape => {
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
    showToast('Pick a pipe piece from the tray first!', 'bad');
    return;
  }
  const required = div.dataset.required;
  if (state.selectedTrayShape === required) {
    div.innerHTML = SVG[required];
    div.classList.add('filled', 'correct');
    div.onclick = null;
    state.filledCount++;
    showToast('Nice connection! ✓', 'good');
    checkLevelComplete();
  } else {
    div.classList.add('wrong');
    state.score = Math.max(0, state.score - 5);
    updateScoreDisplays();
    showToast("Wrong pipe — doesn't fit! −5 points", 'bad');
    setTimeout(() => div.classList.remove('wrong'), 350);
  }
}

function showToast(msg, type) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = 'feedback-toast show ' + (type || '');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 1600);
}

/* ====================== TIMER ====================== */
function startTimer() {
  clearInterval(state.timer);
  updateTimerDisplay();
  state.timer = setInterval(() => {
    state.secondsElapsed++;
    updateTimerDisplay();
    if (state.secondsElapsed >= state.timeLimit) {
      clearInterval(state.timer);
      showToast("Time's up! Restarting…", 'bad');
      setTimeout(() => startLevel(state.currentLevel.id), 1400);
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
  showToast('Paused — resuming in 2s…', 'bad');
  setTimeout(() => startTimer(), 2000);
}

function resetLevel() {
  if (!state.currentLevel) return;
  showToast('Level reset ↺', 'good');
  startLevel(state.currentLevel.id);
}

/* ====================== LEVEL COMPLETE ====================== */
function checkLevelComplete() {
  const lv         = state.currentLevel;
  const totalSlots = Object.keys(lv.slots).length;
  if (state.filledCount < totalSlots) return;

  clearInterval(state.timer);
  const pct  = state.secondsElapsed / lv.timeLimit;
  const stars = pct < 0.45 ? 3 : pct < 0.75 ? 2 : 1;

  state.stars[lv.id]  = Math.max(state.stars[lv.id] || 0, stars);
  state.score        += lv.reward;
  updateScoreDisplays();
  if (lv.id < 10 && lv.id + 1 > state.unlocked) state.unlocked = lv.id + 1;
  saveState();
  showComplete(lv, stars);
}

function showComplete(lv, stars) {
  document.getElementById('complete-level-label').textContent = 'LEVEL ' + lv.id;
  document.getElementById('complete-points').textContent      = lv.reward;
  document.getElementById('complete-stars').innerHTML =
    [1,2,3].map(n => n <= stars ? '★' : '<span class="empty">★</span>').join('');
  goTo('screen-complete');
}

function goToFact() {
  document.getElementById('fact-text').textContent =
    FACTS[(state.currentLevel.id - 1) % FACTS.length];
  goTo('screen-fact');
}

function goToNextLevelOrDonate() {
  const lv = state.currentLevel;
  if (lv.id === 10) {
    // All levels complete — show donate, then final congrats
    goTo('screen-donate');
  } else {
    // Not done yet — go back to level select to pick the next level
    goTo('screen-levels');
    renderLevels();
  }
}

function resetGame() {
  state.score    = 0;
  state.unlocked = 1;
  state.stars    = {};
  saveState();
  goTo('screen-start');
}

/* ====================== INIT ====================== */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderLevels();
  updateScoreDisplays();
});