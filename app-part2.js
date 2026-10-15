// ---------- Animals ----------
function renderAnimals(filter) {
  const list = filter === 'all' ? ANIMALS : ANIMALS.filter(function(a){ return a.type === filter; });
  const grid = document.getElementById('animalGrid');
  if (!grid) return;
  grid.innerHTML = list.map(function(a) {
    return '<div class="animal-card" onclick="showAnimal(\'' + a.name + '\')"><div class="a-emoji">' + a.emoji + '</div><div class="a-name">' + a.name + '</div></div>';
  }).join('');
}
function filterAnimals(f) { renderAnimals(f); }
function showAnimal(name) {
  const a = ANIMALS.find(function(x){ return x.name === name; });
  if (!a) return;
  document.getElementById('animalName').textContent = a.name;
  document.getElementById('animalEmoji').textContent = a.emoji;
  document.getElementById('animalInfo').textContent = a.info;
  document.getElementById('animalDetail').classList.remove('hidden');
  window._currentAnimal = a;
}
async function makeAnimalStory() {
  const a = window._currentAnimal;
  if (!a) return;
  if (state.apiKey && state.apiEnabled) {
    const res = await callAPI([
      { role: 'system', content: systemPrompt() },
      { role: 'user', content: 'یک داستان کوتاه کودکانه درباره ' + a.name + ' بنویس.' }
    ]);
    alert(res.content || res.error);
  } else {
    alert('روزی یک ' + a.name + ' ' + a.emoji + ' در جنگل جادویی زندگی می‌کرد و با همه دوست بود!');
  }
}

let currentGuessAnimal = null;
function startAnimalGuess() {
  currentGuessAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  document.getElementById('animalClue').textContent = 'من یک حیوان هستم. ' + currentGuessAnimal.info.split('.')[0] + '.';
  document.getElementById('animalGuessArea').classList.remove('hidden');
  document.getElementById('animalGuessInput').value = '';
  document.getElementById('animalGuessFb').textContent = '';
}
function checkAnimalGuess() {
  const g = document.getElementById('animalGuessInput').value.trim();
  if (g.includes(currentGuessAnimal.name) || currentGuessAnimal.name.includes(g)) {
    document.getElementById('animalGuessFb').innerHTML = '<span class="msg msg-success">آفرین! ' + currentGuessAnimal.emoji + ' ' + currentGuessAnimal.name + '</span>';
    addStars(2);
  } else {
    document.getElementById('animalGuessFb').innerHTML = '<span class="msg msg-info">نزدیک بود! دوباره فکر کن 💭</span>';
  }
}
function createFantasyAnimal() {
  const body = document.getElementById('bodyPart').value;
  const wing = document.getElementById('wingPart').value;
  const color = document.getElementById('colorPart').value;
  document.getElementById('fantasyResult').textContent = '🦄 حیوان خیالی تو: یک موجود ' + color + ' با ' + body + ' و ' + wing + '! اسمش را چه می‌گذاری؟';
  addStars(1);
}

// ---------- Creativity ----------
function newCreativityPrompt() {
  document.getElementById('creativityQ').textContent = CREATIVITY_PROMPTS[Math.floor(Math.random() * CREATIVITY_PROMPTS.length)];
  document.getElementById('creativityA').value = '';
}
function saveIdea() {
  const a = document.getElementById('creativityA').value.trim();
  const q = document.getElementById('creativityQ').textContent;
  if (!a) return;
  state.ideas.push({ type: 'idea', title: q.slice(0, 30), content: a, date: Date.now() });
  saveState(); renderIdeas(); updateTreasureSummary();
  document.getElementById('creativityA').value = '';
  addStars(1); alert('ایده ذخیره شد! 💡');
}
async function askAIExpand() {
  const a = document.getElementById('creativityA').value.trim() || document.getElementById('creativityQ').textContent;
  if (!state.apiKey || !state.apiEnabled) { alert('کلید API لازم است.'); return; }
  const res = await callAPI([
    { role: 'system', content: systemPrompt('ایده کودک را تشویق کن و با سؤال‌های جالب گسترش بده.') },
    { role: 'user', content: 'این ایده را گسترش بده: ' + a }
  ]);
  alert(res.content || res.error);
}
function renderIdeas() {
  const el = document.getElementById('ideasList'); if (!el) return;
  if (!state.ideas.length) { el.innerHTML = '<p style="color:#999">هنوز ایده‌ای نیست.</p>'; return; }
  el.innerHTML = state.ideas.slice().reverse().map(function(i) {
    return '<div style="background:#fdf8ff;padding:10px;border-radius:12px;margin:6px 0"><strong>' + escapeHtml(i.title) + '</strong><p>' + escapeHtml(i.content) + '</p></div>';
  }).join('');
}

// ---------- Poems ----------
async function makePoem() {
  const topic = document.getElementById('poemTopic').value.trim() || 'دوستی';
  const type = document.getElementById('poemType').value;
  const local = type === 'شعر'
    ? 'در آسمان ستاره‌ها\nبرای ' + topic + ' می‌درخشند\nمحیا جان بخند و بازی کن\nدنیا را رنگی‌تر کن! 🌟'
    : 'یکی بود یکی نبود. در سرزمین جادویی، ماجرای ' + topic + ' شروع شد و همه با هم شاد بودند...';
  document.getElementById('poemStatus').innerHTML = '<span class="msg msg-info">در حال ساخت...</span>';
  let text = local;
  if (state.apiKey && state.apiEnabled) {
    const res = await callAPI([
      { role: 'system', content: systemPrompt() },
      { role: 'user', content: 'یک ' + type + ' کوتاه و کودکانه درباره «' + topic + '» بنویس.' }
    ]);
    if (res.content) text = res.content;
    else document.getElementById('poemStatus').innerHTML = '<span class="msg msg-warn">' + res.error + '</span>';
  }
  document.getElementById('poemText').textContent = text;
  document.getElementById('poemResult').classList.remove('hidden');
  document.getElementById('poemStatus').innerHTML = '';
  addStars(1);
}
function savePoem() {
  const t = document.getElementById('poemText').textContent;
  if (!t) return;
  state.stories.push({ type: 'poem', title: 'شعر/قصه ' + new Date().toLocaleDateString('fa-IR'), content: t, date: Date.now() });
  saveState(); updateTreasureSummary(); addStars(1); alert('ذخیره شد!');
}

// ---------- Planner ----------
const DEFAULT_PLAN = [
  { id: 1, text: 'صبحانه و آماده‌شدن', done: false, icon: '🌅' },
  { id: 2, text: 'مدرسه / یادگیری', done: false, icon: '📚' },
  { id: 3, text: 'بازی و تفریح', done: false, icon: '🎮' },
  { id: 4, text: 'نقاشی یا کاردستی', done: false, icon: '🎨' },
  { id: 5, text: 'کمک کوچک در خانه', done: false, icon: '🏠' },
  { id: 6, text: 'زمان خانواده', done: false, icon: '👨‍👩‍👧' },
  { id: 7, text: 'مطالعه یا قصه', done: false, icon: '📖' },
  { id: 8, text: 'آماده‌شدن برای خواب', done: false, icon: '🌙' }
];

function renderPlanner() {
  if (!state.planner.length) state.planner = JSON.parse(JSON.stringify(DEFAULT_PLAN));
  const el = document.getElementById('plannerList'); if (!el) return;
  el.innerHTML = state.planner.map(function(p) {
    return '<label style="display:flex;align-items:center;gap:10px;padding:10px;background:' + (p.done ? '#e8f8f0' : '#fdf8ff') + ';border-radius:12px;margin:6px 0;cursor:pointer">' +
      '<input type="checkbox" ' + (p.done ? 'checked' : '') + ' onchange="togglePlan(' + p.id + ')">' +
      '<span style="font-size:1.3rem">' + p.icon + '</span>' +
      '<span style="' + (p.done ? 'text-decoration:line-through;color:#888' : '') + '">' + p.text + '</span></label>';
  }).join('');
  const done = state.planner.filter(function(p){ return p.done; }).length;
  const pct = Math.round(done / state.planner.length * 100);
  document.getElementById('plannerProgress').style.width = pct + '%';
  document.getElementById('plannerMsg').textContent = pct === 100 ? 'آفرین! امروز عالی بودی 🌟' : done + ' از ' + state.planner.length + ' انجام شد';
}
function togglePlan(id) {
  const p = state.planner.find(function(x){ return x.id === id; });
  if (p) { p.done = !p.done; if (p.done) addStars(1); }
  saveState(); renderPlanner();
}
function addPlannerItem() {
  const text = prompt('فعالیت جدید:');
  if (!text) return;
  state.planner.push({ id: Date.now(), text: text, done: false, icon: '✨' });
  saveState(); renderPlanner();
}
function resetPlanner() {
  if (!confirm('برنامه امروز بازنشانی شود؟')) return;
  state.planner = JSON.parse(JSON.stringify(DEFAULT_PLAN));
  saveState(); renderPlanner();
}

// ---------- Cooking ----------
function renderRecipes() {
  const el = document.getElementById('recipeList'); if (!el) return;
  el.innerHTML = RECIPES.map(function(r, i) {
    return '<button class="choice-btn" onclick="showRecipe(' + i + ')">' + r.name + '</button>';
  }).join('');
}
function showRecipe(i) {
  const r = RECIPES[i];
  document.getElementById('recipeName').textContent = r.name;
  document.getElementById('recipeIngredients').innerHTML = r.ingredients.map(function(x){ return '<li>' + x + '</li>'; }).join('');
  document.getElementById('recipeSteps').innerHTML = r.steps.map(function(x){ return '<li>' + x + '</li>'; }).join('');
  document.getElementById('recipeDetail').classList.remove('hidden');
}
let cookSecs = 0;
function startCookTimer(min) {
  stopCookTimer(); cookSecs = min * 60; updateCookDisplay();
  cookTimerInterval = setInterval(function() {
    cookSecs--; updateCookDisplay();
    if (cookSecs <= 0) { stopCookTimer(); alert('⏰ زمان تمام شد!'); }
  }, 1000);
}
function stopCookTimer() { clearInterval(cookTimerInterval); }
function updateCookDisplay() {
  const m = Math.floor(cookSecs / 60), s = cookSecs % 60;
  document.getElementById('cookTimer').textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

// ---------- Crafts ----------
function renderCrafts() {
  const el = document.getElementById('craftList'); if (!el) return;
  el.innerHTML = CRAFTS.map(function(c, i) {
    return '<button class="choice-btn" onclick="showCraft(' + i + ')">' + c.name + '</button>';
  }).join('');
}
function showCraft(i) {
  const c = CRAFTS[i];
  document.getElementById('craftName').textContent = c.name;
  document.getElementById('craftMaterials').innerHTML = c.materials.map(function(x){ return '<li>' + x + '</li>'; }).join('');
  document.getElementById('craftSteps').innerHTML = c.steps.map(function(x){ return '<li>' + x + '</li>'; }).join('');
  document.getElementById('craftDetail').classList.remove('hidden');
}

// ---------- Games ----------
function startMemoryGame() {
  document.getElementById('gameArea').classList.remove('hidden');
  document.getElementById('gameTitle').textContent = '🃏 بازی حافظه';
  const emojis = ['🐱', '🐰', '🦋', '🌟', '🌸', '🦄'];
  const cards = shuffle(emojis.concat(emojis));
  let flipped = [], matched = 0, score = 0, lock = false;
  const board = document.createElement('div');
  board.className = 'game-board'; board.style.gridTemplateColumns = 'repeat(4, 1fr)';
  cards.forEach(function(e, i) {
    const card = document.createElement('div');
    card.className = 'memory-card'; card.dataset.val = e; card.dataset.idx = i; card.textContent = '?';
    card.onclick = function() {
      if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
      card.classList.add('flipped'); card.textContent = e; flipped.push(card);
      if (flipped.length === 2) {
        lock = true;
        if (flipped[0].dataset.val === flipped[1].dataset.val) {
          flipped.forEach(function(c){ c.classList.add('matched'); });
          matched++; score += 10;
          document.getElementById('gameScore').textContent = 'امتیاز: ' + score;
          if (matched === emojis.length) { addStars(5); alert('آفرین! همه را پیدا کردی 🌟'); }
          flipped = []; lock = false;
        } else {
          setTimeout(function() {
            flipped.forEach(function(c){ c.classList.remove('flipped'); c.textContent = '?'; });
            flipped = []; lock = false;
          }, 700);
        }
      }
    };
    board.appendChild(card);
  });
  document.getElementById('gameContent').innerHTML = '';
  document.getElementById('gameContent').appendChild(board);
  document.getElementById('gameScore').textContent = 'امتیاز: 0';
}

function startPatternGame() {
  document.getElementById('gameArea').classList.remove('hidden');
  document.getElementById('gameTitle').textContent = '🔢 حدس ادامه الگو';
  const start = Math.floor(Math.random()*5)+1, step = Math.floor(Math.random()*3)+1;
  const seq = [start, start+step, start+2*step, start+3*step];
  const ans = start + 4*step;
  document.getElementById('gameContent').innerHTML = '<p style="font-size:1.3rem;text-align:center;margin:16px 0">' + seq.join(' ، ') + ' ، ؟</p><div id="patOpts"></div>';
  const opts = document.getElementById('patOpts');
  shuffle([ans, ans+step, ans-1, ans+2]).forEach(function(c) {
    const b = document.createElement('button'); b.className = 'choice-btn'; b.textContent = c;
    b.onclick = function() { if (c === ans) { addStars(2); alert('درست! 🌟'); startPatternGame(); } else alert('دوباره فکر کن 💭'); };
    opts.appendChild(b);
  });
  document.getElementById('gameScore').textContent = '';
}

function startOddOneOut() {
  document.getElementById('gameArea').classList.remove('hidden');
  document.getElementById('gameTitle').textContent = '🔍 شکل متفاوت را پیدا کن';
  const items = [
    { set: ['🔴','🔴','🔵','🔴'], odd: 2 },
    { set: ['🐱','🐱','🐶','🐱'], odd: 2 },
    { set: ['⭐','🌟','⭐','⭐'], odd: 1 },
    { set: ['🟦','🟦','🟦','🔺'], odd: 3 }
  ];
  const g = items[Math.floor(Math.random()*items.length)];
  document.getElementById('gameContent').innerHTML = '<div style="display:flex;justify-content:center;gap:12px;font-size:2.5rem;margin:20px 0" id="oddItems"></div>';
  const box = document.getElementById('oddItems');
  g.set.forEach(function(e, i) {
    const s = document.createElement('span'); s.textContent = e; s.style.cursor = 'pointer'; s.style.padding = '8px'; s.style.borderRadius = '12px';
    s.onclick = function() {
      if (i === g.odd) { addStars(2); alert('آفرین! 🌟'); startOddOneOut(); }
      else { s.style.background = '#fdeaea'; }
    };
    box.appendChild(s);
  });
  document.getElementById('gameScore').textContent = '';
}

function startWordGuess() {
  document.getElementById('gameArea').classList.remove('hidden');
  document.getElementById('gameTitle').textContent = '🔤 حدس کلمه';
  const words = [
    { w: 'گربه', clue: 'حیوان خانگی که میو میو می‌کند' },
    { w: 'ستاره', clue: 'در آسمان شب می‌درخشد' },
    { w: 'گل', clue: 'زیبا و خوشبو در باغ' },
    { w: 'ماه', clue: 'شب‌ها در آسمان گرد است' }
  ];
  const item = words[Math.floor(Math.random()*words.length)];
  document.getElementById('gameContent').innerHTML =
    '<p>سرنخ: ' + item.clue + '</p>' +
    '<p style="letter-spacing:8px;font-size:1.5rem;text-align:center">' + '_ '.repeat(item.w.length) + '</p>' +
    '<input type="text" id="wordGuessIn" placeholder="حدس بزن">' +
    '<button class="btn btn-sm" onclick="checkWordGuess(\'' + item.w + '\')">بررسی</button><p id="wordFb"></p>';
  document.getElementById('gameScore').textContent = '';
}
function checkWordGuess(ans) {
  const g = document.getElementById('wordGuessIn').value.trim();
  if (g === ans) {
    document.getElementById('wordFb').innerHTML = '<span class="msg msg-success">آفرین! 🌟</span>';
    addStars(2);
  } else {
    document.getElementById('wordFb').innerHTML = '<span class="msg msg-info">نزدیک بود! دوباره تلاش کن</span>';
  }
}

function startMathQuiz() {
  document.getElementById('gameArea').classList.remove('hidden');
  document.getElementById('gameTitle').textContent = '➕ جمع تصویری';
  const a = Math.floor(Math.random()*5)+1, b = Math.floor(Math.random()*5)+1;
  document.getElementById('gameContent').innerHTML =
    '<p style="font-size:1.5rem;text-align:center">' + '🍎'.repeat(a) + ' + ' + '🍎'.repeat(b) + ' = ؟</p><div id="mathOpts"></div>';
  const ans = a + b;
  const opts = document.getElementById('mathOpts');
  shuffle([ans, ans+1, ans-1, ans+2].filter(function(v){ return v>0; })).forEach(function(c) {
    const btn = document.createElement('button'); btn.className = 'choice-btn'; btn.textContent = c;
    btn.onclick = function() { if (c === ans) { addStars(1); alert('درست! 🌟'); startMathQuiz(); } else alert('دوباره بشمار 🔢'); };
    opts.appendChild(btn);
  });
  document.getElementById('gameScore').textContent = '';
}

// ---------- Dreams ----------
function saveDream() {
  const t = document.getElementById('dreamInput').value.trim();
  if (!t) return;
  state.dreams.push({ type: 'dream', title: 'آرزو', content: t, date: Date.now() });
  saveState(); renderDreams(); updateTreasureSummary();
  document.getElementById('dreamInput').value = '';
  addStars(1); alert('آرزویت ذخیره شد! 🌙');
}
async function makeDreamStory() {
  const t = document.getElementById('dreamInput').value.trim() || (state.dreams.slice(-1)[0] && state.dreams.slice(-1)[0].content);
  if (!t) { alert('اول آرزویت را بنویس.'); return; }
  if (state.apiKey && state.apiEnabled) {
    const res = await callAPI([
      { role: 'system', content: systemPrompt() },
      { role: 'user', content: 'یک داستان کوتاه و زیبا درباره این آرزو بنویس: ' + t }
    ]);
    alert(res.content || res.error);
  } else {
    alert('روزی محیا آرزو کرد که ' + t + ' و با جادوی مهربانی آرزویش رنگ واقعیت گرفت! ✨');
  }
}
function renderDreams() {
  const el = document.getElementById('dreamsList'); if (!el) return;
  if (!state.dreams.length) { el.innerHTML = '<p style="color:#999">هنوز آرزویی نوشته نشده.</p>'; return; }
  el.innerHTML = state.dreams.slice().reverse().map(function(d) {
    return '<div style="background:#fdf8ff;padding:10px;border-radius:12px;margin:6px 0">🌙 ' + escapeHtml(d.content) + '</div>';
  }).join('');
}
function createPlanet() {
  const name = document.getElementById('planetName').value.trim() || 'محیا';
  const color = document.getElementById('planetColor').value;
  document.getElementById('planetResult').textContent = '🪐 سیاره «' + name + '» با رنگ ' + color + ' ساخته شد! روی آن گل‌های شکلاتی و رودخانه‌های آب‌میوه وجود دارد!';
  addStars(1);
}

// ---------- Treasure ----------
function renderTreasure(filter) {
  var items = [];
  if (filter === 'all' || filter === 'story') items = items.concat(state.stories.map(function(s){ return Object.assign({}, s, {kind:'story'}); }));
  if (filter === 'all' || filter === 'paint') items = items.concat(state.paintings.map(function(p){ return Object.assign({}, p, {kind:'paint'}); }));
  if (filter === 'all' || filter === 'idea') items = items.concat(state.ideas.map(function(i){ return Object.assign({}, i, {kind:'idea'}); }));
  if (filter === 'all' || filter === 'dream') items = items.concat(state.dreams.map(function(d){ return Object.assign({}, d, {kind:'dream'}); }));
  items.sort(function(a,b){ return b.date - a.date; });
  const el = document.getElementById('treasureList'); if (!el) return;
  if (!items.length) { el.innerHTML = '<p style="color:#999">گنجینه خالی است.</p>'; return; }
  el.innerHTML = items.map(function(it) {
    if (it.kind === 'paint') {
      return '<div class="gallery-item" style="margin-bottom:10px"><img src="' + it.data + '" alt=""><div class="cap">' + it.title + '</div></div>';
    }
    var icon = (it.kind === 'story' || it.kind === 'poem') ? '📖' : (it.kind === 'idea' ? '💡' : '🌙');
    var content = (it.content || '').slice(0, 200);
    if ((it.content || '').length > 200) content += '...';
    return '<div style="background:#fdf8ff;padding:12px;border-radius:12px;margin:8px 0"><strong>' + icon + ' ' + escapeHtml(it.title || '') + '</strong><p style="margin-top:6px;white-space:pre-wrap">' + escapeHtml(content) + '</p></div>';
  }).join('');
}
function filterTreasure(f) { renderTreasure(f); }

// ---------- Parent ----------
function openParentSettings() {
  showScreen('parent');
  document.getElementById('parentLock').classList.remove('hidden');
  document.getElementById('parentPanel').classList.add('hidden');
  document.getElementById('parentPin').value = '';
}
function checkParentPin() {
  const pin = document.getElementById('parentPin').value;
  const stored = localStorage.getItem('mahya_pin') || '1234';
  if (pin === stored) {
    document.getElementById('parentLock').classList.add('hidden');
    document.getElementById('parentPanel').classList.remove('hidden');
    document.getElementById('apiBase').value = state.apiBase;
    document.getElementById('apiModel').value = state.apiModel;
    if (state.apiKey) {
      document.getElementById('apiKey').value = state.apiKey;
      document.getElementById('apiStatus').className = 'msg msg-success';
      document.getElementById('apiStatus').textContent = 'وضعیت: کلید در حافظه نشست موجود است' + (state.apiEnabled ? ' (فعال)' : ' (غیرفعال)');
    }
  } else { alert('کد اشتباه است.'); }
}
function toggleKeyVisibility() {
  const inp = document.getElementById('apiKey');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}
async function fetchModels() {
  const key = document.getElementById('apiKey').value.trim();
  const base = document.getElementById('apiBase').value.replace(/\/$/, '');
  if (!key) { alert('کلید را وارد کن.'); return; }
  state.apiKey = key;
  try {
    const res = await fetch(base + '/models', { headers: { 'Authorization': 'Bearer ' + key } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const models = data.data || data.models || data;
    const sel = document.getElementById('apiModel'); sel.innerHTML = '';
    (Array.isArray(models) ? models : []).forEach(function(m) {
      const id = m.id || m.name || m;
      const opt = document.createElement('option'); opt.value = id; opt.textContent = id; sel.appendChild(opt);
    });
    if (!sel.options.length) {
      const opt = document.createElement('option'); opt.value = 'grok-4.5'; opt.textContent = 'grok-4.5'; sel.appendChild(opt);
    }
    document.getElementById('apiStatus').className = 'msg msg-success';
    document.getElementById('apiStatus').textContent = 'مدل‌ها دریافت شد.';
    state.apiEnabled = true;
  } catch (e) {
    document.getElementById('apiStatus').className = 'msg msg-error';
    document.getElementById('apiStatus').textContent = 'خطا در دریافت مدل‌ها: ' + e.message;
  }
}
async function testConnection() {
  const key = document.getElementById('apiKey').value.trim();
  if (!key) { alert('کلید را وارد کن.'); return; }
  state.apiKey = key;
  state.apiBase = document.getElementById('apiBase').value.replace(/\/$/, '');
  state.apiModel = document.getElementById('apiModel').value;
  state.apiEnabled = true;
  document.getElementById('apiStatus').innerHTML = '<span class="spinner"></span> در حال تست...';
  const res = await callAPI([{ role: 'user', content: 'سلام، فقط بگو «وصل شدم» و هیچ چیز دیگر.' }], { max_tokens: 20 });
  if (res.content) {
    document.getElementById('apiStatus').className = 'msg msg-success';
    document.getElementById('apiStatus').textContent = 'اتصال موفق! پاسخ: ' + res.content.slice(0, 50);
  } else {
    document.getElementById('apiStatus').className = 'msg msg-error';
    document.getElementById('apiStatus').textContent = res.error || 'اتصال ناموفق';
    state.apiEnabled = false;
  }
}
function disableAPI() {
  state.apiEnabled = false; state.apiKey = null;
  document.getElementById('apiKey').value = '';
  document.getElementById('apiStatus').className = 'msg msg-info';
  document.getElementById('apiStatus').textContent = 'API غیرفعال شد. امکانات محلی همچنان کار می‌کنند.';
}
function clearAllData() {
  if (!confirm('همه داستان‌ها، نقاشی‌ها، ایده‌ها و برنامه روزانه حذف شوند؟')) return;
  state.stories = []; state.paintings = []; state.ideas = []; state.dreams = []; state.planner = [];
  saveState(); updateTreasureSummary(); alert('داده‌ها پاک شدند.');
}
function resetStars() { state.stars = 0; updateStarsUI(); saveState(); }

// ---------- TTS ----------
function speakText(text) {
  if (!window.speechSynthesis) { alert('مرورگر از خواندن متن پشتیبانی نمی‌کند.'); return; }
  stopSpeak();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'fa-IR'; u.rate = 0.9;
  speechSynthesis.speak(u);
}
function stopSpeak() { if (window.speechSynthesis) speechSynthesis.cancel(); }

// ---------- Utils ----------
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function escapeHtml(s) {
  return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
}
function showTempMsg(id, text, type) {
  const el = document.getElementById(id); if (!el) return;
  el.innerHTML = '<div class="msg msg-' + type + '">' + text + '</div>';
  setTimeout(function(){ el.innerHTML = ''; }, 5000);
}

// ---------- Init ----------
loadState();
buildHomeCards();
