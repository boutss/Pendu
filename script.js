'use strict';

// ── Supabase ──
const SUPABASE_URL = 'https://mzinoohhsqlvbuoygtua.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16aW5vb2hoc3FsdmJ1b3lndHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNTQ2MzMsImV4cCI6MjA5NjkzMDYzM30.0FlwdWZcfGLHj1jZh_Tm4vaJlyiIFoIhRTbJzCxwlSE';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Banque de mots ──
const WORDS = {
  animaux: [
    { mot: 'ELEPHANT', indice: 'Grand mammifère à trompe' },
    { mot: 'GIRAFE', indice: 'Long cou, taches brunes' },
    { mot: 'CROCODILE', indice: 'Reptile des marécages' },
    { mot: 'PAPILLON', indice: 'Insecte aux ailes colorées' },
    { mot: 'RHINOCEROS', indice: 'Mammifère à corne' },
    { mot: 'DAUPHIN', indice: 'Mammifère marin intelligent' },
    { mot: 'CHAUVESOURIS', indice: 'Mammifère volant nocturne' },
    { mot: 'FLAMANT', indice: 'Oiseau rose sur une patte' },
    { mot: 'CASTOR', indice: 'Bâtit des barrages' },
    { mot: 'LYNX', indice: 'Félin sauvage européen' },
  ],
  pays: [
    { mot: 'FRANCE', indice: 'Pays de la baguette et du vin' },
    { mot: 'ALLEMAGNE', indice: 'Pays de la bière et de BMW' },
    { mot: 'JAPON', indice: 'Pays du soleil levant' },
    { mot: 'BRESIL', indice: 'Plus grand pays d\'Amérique du Sud' },
    { mot: 'AUSTRALIE', indice: 'Continent et pays du Pacifique' },
    { mot: 'MAROC', indice: 'Pays du Maghreb, Marrakech' },
    { mot: 'PORTUGAL', indice: 'Pays d\'Europe, Lisbonne' },
    { mot: 'NIGERIA', indice: 'Pays le plus peuplé d\'Afrique' },
    { mot: 'ARGENTINE', indice: 'Terre du tango et du maté' },
    { mot: 'SUEDE', indice: 'Pays scandinave, IKEA' },
  ],
  sports: [
    { mot: 'FOOTBALL', indice: 'Sport le plus populaire au monde' },
    { mot: 'BASKETBALL', indice: 'Panier à 3,05 mètres de hauteur' },
    { mot: 'NATATION', indice: 'On nage en piscine ou en mer' },
    { mot: 'CYCLISME', indice: 'Tour de France' },
    { mot: 'ESCRIME', indice: 'Combat avec des lames' },
    { mot: 'JUDO', indice: 'Art martial japonais' },
    { mot: 'VOLLEYBALL', indice: 'Filet, 6 joueurs par équipe' },
    { mot: 'TENNIS', indice: 'Raquette et balles jaunes' },
    { mot: 'BOXE', indice: 'Gants et ring' },
    { mot: 'HANDBALL', indice: 'Sport collectif en salle' },
  ],
  films: [
    { mot: 'TITANIC', indice: 'Naufrage et histoire d\'amour' },
    { mot: 'AVATAR', indice: 'Planète Pandora, Na\'vi bleus' },
    { mot: 'INCEPTION', indice: 'Rêves dans les rêves' },
    { mot: 'GLADIATEUR', indice: 'Maximus dans les arènes de Rome' },
    { mot: 'INTERSTELLAR', indice: 'Voyage à travers les trous noirs' },
    { mot: 'PARASITE', indice: 'Film coréen, Palme d\'Or 2019' },
    { mot: 'CASABLANCA', indice: 'Classique du cinéma noir et blanc' },
    { mot: 'MATRIX', indice: 'Pilule rouge ou pilule bleue' },
    { mot: 'PSYCHOSE', indice: 'Hitchcock, la douche' },
    { mot: 'SHINING', indice: 'Kubrick, hôtel hanté' },
  ],
  aliments: [
    { mot: 'CROISSANT', indice: 'Viennoiserie en forme de lune' },
    { mot: 'CAMEMBERT', indice: 'Fromage normand' },
    { mot: 'COURGETTE', indice: 'Légume vert d\'été' },
    { mot: 'FRAMBOISE', indice: 'Petit fruit rouge des bois' },
    { mot: 'ARTICHAUT', indice: 'Légume aux feuilles à manger' },
    { mot: 'MERINGUE', indice: 'Dessert à base de blanc d\'œuf' },
    { mot: 'POIREAU', indice: 'Légume allongé blanc et vert' },
    { mot: 'ANANAS', indice: 'Fruit tropical épineux' },
    { mot: 'ENDIVE', indice: 'Légume pâle et amer' },
    { mot: 'MACARON', indice: 'Petit gâteau coloré de Paris' },
  ],
};

const DIFFICULTY = {
  facile:    { vies: 8,  indice: true  },
  moyen:     { vies: 6,  indice: true  },
  difficile: { vies: 5,  indice: false },
};

const BODY_PARTS = ['head', 'body', 'arm-l', 'arm-r', 'leg-l', 'leg-r'];

const KEYBOARD_ROWS = [
  ['A','Z','E','R','T','Y','U','I','O','P'],
  ['Q','S','D','F','G','H','J','K','L','M'],
  ['W','X','C','V','B','N'],
];

// ── État du jeu ──
let state = {
  pseudo: '',
  categorie: 'all',
  difficulte: 'facile',
  mot: '',
  indice: '',
  lettresDevinees: new Set(),
  lettresEssayees: new Set(),
  viesRestantes: 6,
  viesMax: 6,
  score: 0,
  serie: 0,
  meilleur: 0,
  historique: [],
};

// ── Init ──
window.addEventListener('DOMContentLoaded', () => {
  loadPersisted();
  renderHighScores();
  buildKeyboard();
  bindSetup();
  bindResult();
  bindQuit();
  bindTabs();
  bindMusicBtn();
  updateScoreBoard();
});

// ── Musique d'ambiance (Web Audio) ──
let musicCtx   = null;
let musicNodes = [];
let musicOn    = false;
let musicMuted = false;

function musicPlay() {
  if (musicMuted || musicOn) return;
  if (!musicCtx) musicCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (musicCtx.state === 'suspended') musicCtx.resume();
  musicOn = true;

  const t = musicCtx.currentTime;

  // Mastervolume
  const master = musicCtx.createGain();
  master.gain.setValueAtTime(0, t);
  master.gain.linearRampToValueAtTime(0.35, t + 3);
  master.connect(musicCtx.destination);

  // Filtre passe-bas qui évolue lentement
  const filter = musicCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(300, t);
  filter.frequency.linearRampToValueAtTime(900, t + 20);
  filter.connect(master);

  // Drone grave (80 Hz)
  const drone1 = musicCtx.createOscillator();
  drone1.type = 'sawtooth';
  drone1.frequency.value = 80;
  drone1.connect(filter);
  drone1.start(t);
  musicNodes.push(drone1);

  // Drone légèrement désaccordé → battement inquiétant
  const drone2 = musicCtx.createOscillator();
  drone2.type = 'sawtooth';
  drone2.frequency.value = 82.5;
  const g2 = musicCtx.createGain();
  g2.gain.value = 0.5;
  drone2.connect(g2);
  g2.connect(filter);
  drone2.start(t);
  musicNodes.push(drone2);

  // Harmonique aiguë pulsante (160 Hz)
  const harm = musicCtx.createOscillator();
  harm.type = 'sine';
  harm.frequency.value = 160;
  const lfo = musicCtx.createOscillator();
  lfo.frequency.value = 0.18;
  const lfoGain = musicCtx.createGain();
  lfoGain.gain.value = 0.12;
  lfo.connect(lfoGain);
  const harmGain = musicCtx.createGain();
  harmGain.gain.value = 0.18;
  lfoGain.connect(harmGain.gain);
  harm.connect(harmGain);
  harmGain.connect(master);
  harm.start(t);
  lfo.start(t);
  musicNodes.push(harm, lfo);

  // Notes aléatoires graves toutes les ~4s
  const randomNote = () => {
    if (!musicOn) return;
    const freqs = [55, 65, 73, 87, 98, 110];
    const freq  = freqs[Math.floor(Math.random() * freqs.length)];
    const osc   = musicCtx.createOscillator();
    const gn    = musicCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const now = musicCtx.currentTime;
    gn.gain.setValueAtTime(0, now);
    gn.gain.linearRampToValueAtTime(0.25, now + 0.8);
    gn.gain.linearRampToValueAtTime(0, now + 3);
    osc.connect(gn);
    gn.connect(master);
    osc.start(now);
    osc.stop(now + 3.2);
    musicNodes.push(osc);
    const delay = 3000 + Math.random() * 4000;
    setTimeout(randomNote, delay);
  };
  setTimeout(randomNote, 2000);

  musicNodes.push(master, filter, g2, lfoGain, harmGain);
}

function musicStop() {
  if (!musicOn) return;
  musicOn = false;
  if (!musicCtx) return;
  const t = musicCtx.currentTime;
  musicNodes.forEach(n => {
    try {
      if (n instanceof OscillatorNode) n.stop(t + 1.5);
      else if (n instanceof GainNode) n.gain.linearRampToValueAtTime(0, t + 1.5);
    } catch(e) {}
  });
  musicNodes = [];
}

function bindMusicBtn() {
  document.getElementById('music-btn').addEventListener('click', () => {
    musicMuted = !musicMuted;
    document.getElementById('music-btn').textContent = musicMuted ? '🔇' : '🔊';
    if (musicMuted) musicStop();
    else musicPlay();
  });
}

// ── Audio (initialisé sur geste utilisateur pour mobile) ──
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

// ── Screamer ──
function triggerScreamer() {
  const overlay = document.getElementById('screamer');
  overlay.classList.remove('hidden');
  overlay.classList.add('flashing');

  // Son strident
  try {
    initAudio();
    const makeScream = (freq, start, duration) => {
      const osc  = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
      osc.frequency.exponentialRampToValueAtTime(freq * 2.5, audioCtx.currentTime + start + duration);
      gain.gain.setValueAtTime(0.8, audioCtx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + duration);
      osc.start(audioCtx.currentTime + start);
      osc.stop(audioCtx.currentTime + start + duration);
    };
    makeScream(320, 0,    0.6);
    makeScream(640, 0.05, 0.6);
    makeScream(180, 0.1,  0.8);
    makeScream(900, 0,    0.4);
  } catch (e) { /* audio non dispo */ }

  // Clic ou touche pour fermer
  const close = () => {
    overlay.classList.add('hidden');
    overlay.classList.remove('flashing');
    overlay.removeEventListener('click', close);
    document.removeEventListener('keydown', close);
  };
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', close);

  setTimeout(close, 4000);
}

// ── Persistance locale ──
function loadPersisted() {
  state.meilleur  = Number(localStorage.getItem('pendu_best') || 0);
  state.historique = JSON.parse(localStorage.getItem('pendu_scores') || '[]');
  state.pseudo    = localStorage.getItem('pendu_pseudo') || '';
  if (state.pseudo) document.getElementById('pseudo-input').value = state.pseudo;
}

function savePersisted() {
  localStorage.setItem('pendu_best',   state.meilleur);
  localStorage.setItem('pendu_scores', JSON.stringify(state.historique));
  localStorage.setItem('pendu_pseudo', state.pseudo);
}

// ── Setup ──
function bindSetup() {
  bindChoiceGroup('category-group',   v => { state.categorie  = v; });
  bindChoiceGroup('difficulty-group', v => { state.difficulte = v; });
  document.getElementById('start-btn').addEventListener('click', () => { initAudio(); musicPlay(); startGame(); });
}

function bindChoiceGroup(id, cb) {
  document.getElementById(id).querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(id).querySelectorAll('.choice-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cb(btn.dataset.value);
    });
  });
}

// ── Onglets scores ──
function bindTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.dataset.tab;
      document.getElementById('tab-local').classList.toggle('hidden', tab !== 'local');
      document.getElementById('tab-global').classList.toggle('hidden', tab !== 'global');

      if (tab === 'global') loadGlobalScores();
    });
  });
}

// ── Classement mondial ──
async function loadGlobalScores() {
  const container = document.getElementById('global-scores-list');
  container.innerHTML = '<span class="loading">Chargement...</span>';

  const { data, error } = await db
    .from('scores')
    .select('pseudo, points, categorie, difficulte, created_at')
    .order('points', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Supabase SELECT error:', error);
    container.innerHTML = '<span class="loading">Erreur de chargement.</span>';
    return;
  }

  if (!data || !data.length) {
    container.innerHTML = '<span class="loading">Aucun score encore — sois le premier !</span>';
    return;
  }

  container.innerHTML = '';
  data.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'global-score-item';
    const date = new Date(s.created_at).toLocaleDateString('fr-FR');
    const pseudo = escapeHtml(s.pseudo || 'Anonyme');
    div.innerHTML = `
      <span class="score-rank">${i + 1}.</span>
      <span class="score-pseudo">${pseudo}</span>
      <span class="score-meta">${capFirst(s.difficulte)} · ${date}</span>
      <span class="score-val">${s.points} pts</span>`;
    container.appendChild(div);
  });
}

async function submitGlobalScore(points) {
  if (points <= 0) return;
  const { error } = await db.from('scores').insert({
    pseudo:     state.pseudo || 'Anonyme',
    points:     points,
    categorie:  state.categorie,
    difficulte: state.difficulte,
  });
  if (error) console.error('Supabase INSERT error:', error);
}

// ── Démarrage ──
function startGame() {
  const pseudoInput = document.getElementById('pseudo-input').value.trim();
  state.pseudo = pseudoInput || 'Anonyme';
  savePersisted();

  const pool = state.categorie === 'all'
    ? Object.values(WORDS).flat()
    : WORDS[state.categorie] || [];

  const item = pool[Math.floor(Math.random() * pool.length)];
  const diff = DIFFICULTY[state.difficulte];

  state.mot             = item.mot.toUpperCase();
  state.indice          = diff.indice ? item.indice : '';
  state.lettresDevinees = new Set();
  state.lettresEssayees = new Set();
  state.viesMax         = diff.vies;
  state.viesRestantes   = diff.vies;

  showScreen('game-screen');
  document.getElementById('category-badge').textContent  = formatCategorie(state.categorie);
  document.getElementById('difficulty-badge').textContent = capFirst(state.difficulte);
  document.getElementById('hint-text').textContent        = state.indice ? `Indice : ${state.indice}` : '';
  document.getElementById('tried-letters').textContent    = '';

  resetGallows();
  renderWord();
  renderLives();
  resetKeyboard();
}

function formatCategorie(c) {
  return c === 'all' ? 'Toutes catégories' : capFirst(c);
}

function capFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ── Saisie clavier physique ──
document.addEventListener('keydown', e => {
  if (!document.getElementById('game-screen').classList.contains('active')) return;
  const letter = e.key.toUpperCase();
  if (/^[A-Z]$/.test(letter)) handleGuess(letter);
});

// ── Clavier visuel ──
function buildKeyboard() {
  const kb = document.getElementById('keyboard');
  KEYBOARD_ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';
    row.forEach(letter => {
      const btn = document.createElement('button');
      btn.className    = 'kb-key';
      btn.textContent  = letter;
      btn.dataset.letter = letter;
      btn.addEventListener('click', () => handleGuess(letter));
      rowEl.appendChild(btn);
    });
    kb.appendChild(rowEl);
  });
}

function resetKeyboard() {
  document.querySelectorAll('.kb-key').forEach(btn => {
    btn.disabled = false;
    btn.className = 'kb-key';
  });
}

// ── Logique principale ──
function handleGuess(letter) {
  if (state.lettresEssayees.has(letter)) return;
  state.lettresEssayees.add(letter);

  const btn = document.querySelector(`.kb-key[data-letter="${letter}"]`);

  if (state.mot.includes(letter)) {
    state.lettresDevinees.add(letter);
    if (btn) btn.classList.add('correct');
  } else {
    state.viesRestantes--;
    if (btn) btn.classList.add('wrong');
    revealBodyPart();
  }

  if (btn) btn.disabled = true;

  updateTriedLetters();
  renderWord();
  renderLives();
  checkEndGame();
}

function updateTriedLetters() {
  const wrong = [...state.lettresEssayees].filter(l => !state.mot.includes(l));
  document.getElementById('tried-letters').textContent = wrong.join(' ');
}

function checkEndGame() {
  const motSansEspaces = state.mot.replace(/\s/g, '');
  const toutDeviné = [...motSansEspaces].every(l => state.lettresDevinees.has(l));

  if (toutDeviné) {
    endGame(true);
  } else if (state.viesRestantes <= 0) {
    endGame(false);
  }
}

// ── Gallows ──
function resetGallows() {
  BODY_PARTS.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
}

function revealBodyPart() {
  const erreurs = state.viesMax - state.viesRestantes;
  const partsToShow = Math.ceil(erreurs * BODY_PARTS.length / state.viesMax);
  BODY_PARTS.slice(0, partsToShow).forEach(id => {
    document.getElementById(id).classList.remove('hidden');
  });
}

// ── Rendu mot ──
function renderWord() {
  const display = document.getElementById('word-display');
  display.innerHTML = '';

  [...state.mot].forEach(letter => {
    const slot = document.createElement('div');
    if (letter === ' ') {
      slot.className = 'letter-slot separator';
    } else {
      slot.className = 'letter-slot' + (state.lettresDevinees.has(letter) ? ' revealed' : '');
      slot.textContent = state.lettresDevinees.has(letter) ? letter : '';
    }
    display.appendChild(slot);
  });
}

// ── Vies ──
function renderLives() {
  const hearts = '❤️'.repeat(state.viesRestantes) + '🖤'.repeat(state.viesMax - state.viesRestantes);
  document.getElementById('lives-count').textContent = `${hearts} (${state.viesRestantes}/${state.viesMax})`;
}

// ── Fin de partie ──
async function endGame(victoire) {
  disableKeyboard();
  musicStop();

  let points = 0;
  if (victoire) {
    points = state.viesRestantes * 10;
    if (state.difficulte === 'moyen')     points = Math.round(points * 1.5);
    if (state.difficulte === 'difficile') points = Math.round(points * 2.5);
    state.serie++;
    if (state.serie > 1) points += state.serie * 5;
    state.score += points;

    await submitGlobalScore(points);
  } else {
    state.serie = 0;
    BODY_PARTS.forEach(id => document.getElementById(id).classList.remove('hidden'));
    [...state.mot].forEach(l => state.lettresDevinees.add(l));
    renderWord();
    triggerScreamer();
  }

  if (state.score > state.meilleur) state.meilleur = state.score;
  updateScoreBoard();
  recordScore(points);
  savePersisted();

  setTimeout(() => showResult(victoire, points), victoire ? 600 : 1200);
}

function disableKeyboard() {
  document.querySelectorAll('.kb-key').forEach(btn => { btn.disabled = true; });
}

// ── Écran résultat ──
function showResult(victoire, points) {
  const card = document.getElementById('result-card');
  card.className = 'result-card ' + (victoire ? 'win' : 'lose');

  document.getElementById('result-icon').textContent    = victoire ? '🎉' : '💀';
  document.getElementById('result-title').textContent   = victoire ? 'Bravo !' : 'Perdu !';
  document.getElementById('result-message').textContent = victoire
    ? `Tu as trouvé le mot en ${state.viesMax - state.viesRestantes} erreur(s).`
    : `Le mot était : ${state.mot}`;

  document.getElementById('stat-word').textContent   = state.mot;
  document.getElementById('stat-points').textContent = `+${points}`;
  document.getElementById('stat-streak').textContent = `×${state.serie}`;

  showScreen('result-screen');
}

function bindResult() {
  document.getElementById('next-btn').addEventListener('click', () => startGame());
  document.getElementById('menu-btn').addEventListener('click', () => {
    renderHighScores();
    showScreen('setup-screen');
  });
}

// ── Scores locaux ──
function recordScore(points) {
  if (points <= 0) return;
  state.historique.push({ pts: points, date: new Date().toLocaleDateString('fr-FR') });
  state.historique.sort((a, b) => b.pts - a.pts);
  state.historique = state.historique.slice(0, 5);
}

function renderHighScores() {
  const list = document.getElementById('high-scores-list');
  list.innerHTML = '';
  if (!state.historique.length) {
    list.innerHTML = '<li style="color:var(--muted);justify-content:center;list-style:none;padding:8px">Aucun score enregistré</li>';
    return;
  }
  state.historique.forEach((s, i) => {
    const li = document.createElement('li');
    li.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--surface);border-radius:8px;font-size:.9rem;list-style:none';
    li.innerHTML = `<span class="score-rank">${i + 1}.</span><span class="score-name" style="flex:1;padding:0 8px">${s.date}</span><span class="score-val">${s.pts} pts</span>`;
    list.appendChild(li);
  });
}

function updateScoreBoard() {
  document.getElementById('score').textContent  = state.score;
  document.getElementById('streak').textContent = state.serie;
  document.getElementById('best').textContent   = state.meilleur;
}

// ── Quitter ──
function bindQuit() {
  document.getElementById('quit-btn').addEventListener('click', () => {
    musicStop();
    state.serie = 0;
    renderHighScores();
    showScreen('setup-screen');
    updateScoreBoard();
  });
}

// ── Navigation ──
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
