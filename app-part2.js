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
    alert('روزی یک ' + a.name + ' ' + a.emoji + ' در جنگل جادویی زندگی می‌کرد!');
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
    document.getElementById('animalGuessFb').innerHTML = '<span class="msg msg-info">نزدیک بود! 💭</span>';
  }
}
function createFantasyAnimal() {
  const body = document.getElementById('bodyPart').value;
  const wing = document.getElementById('wingPart').value;
  const color = document.getElementById('colorPart').value;
  document.getElementById('fantasyResult').textContent = '🦄 موجود ' + color + ' با ' + body + ' و ' + wing;
  window._fantasyDesc = 'موجود ' + color + ' با ' + body + ' و ' + wing;
  addStars(1);
}
async function aiFantasyStory() {
  const desc = window._fantasyDesc || 'یک حیوان خیالی';
  if (!state.apiKey || !state.apiEnabled) { alert('کلید API لازم است.'); return; }
  const res = await callAPI([
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: 'داستان کوتاه کودکانه درباره: ' + desc }
  ]);
  alert(res.content || res.error);
}

function newCreativityPrompt() {
  document.getElementById('creativityQ').textContent = CREATIVITY_PROMPTS[Math.floor(Math.random() * CREATIVITY_PROMPTS.length)];
  document.getElementById('creativityA').value = '';
}
async function aiCreativityPrompt() {
  if (!state.apiKey || !state.apiEnabled) { alert('کلید API لازم است.'); return; }
  const res = await callAPI([
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: 'یک سؤال خلاقانه کوتاه برای کودک ۷ ساله. فقط سؤال.' }
  ]);
  if (res.content) document.getElementById('creativityQ').textContent = res.content;
  else alert(res.error);
}
function saveIdea() {
  const a = document.getElementById('creativityA').value.trim();
  const q = document.getElementById('creativityQ').textContent;
  if (!a) return;
  state.ideas.push({ type: 'idea', title: q.slice(0, 30), content: a, date: Date.now() });
  saveState(); renderIdeas(); updateTreasureSummary();
  document.getElementById('creativityA').value = '';
  addStars(1); alert('ذخیره شد! 💡');
}
async function askAIExpand() {
  const a = document.getElementById('creativityA').value.trim() || document.getElementById('creativityQ').textContent;
  if (!state.apiKey || !state.apiEnabled) { alert('کلید API لازم است.'); return; }
  const res = await callAPI([
    { role: 'system', content: systemPrompt('ایده را تشویق و گسترش بده.') },
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

async function makePoem() {
  const topic = document.getElementById('poemTopic').value.trim() || 'دوستی';
  const type = document.getElementById('poemType').value;
  let text = type === 'شعر' ? 'ستاره‌ها برای ' + topic + ' می‌درخشند 🌟' : 'ماجرای ' + topic + ' شروع شد...';
  document.getElementById('poemStatus').innerHTML = '<span class="msg msg-info">...</span>';
  if (state.apiKey && state.apiEnabled) {
    const res = await callAPI([
      { role: 'system', content: systemPrompt() },
      { role: 'user', content: 'یک ' + type + ' کوتاه کودکانه درباره «' + topic + '». فقط متن.' }
    ]);
    if (res.content && !res.error) text = res.content;
    else document.getElementById('poemStatus').innerHTML = '<span class="msg msg-warn">' + (res.error||'') + '</span>';
  }
  document.getElementById('poemText').textContent = text;
  document.getElementById('poemResult').classList.remove('hidden');
  document.getElementById('poemStatus').innerHTML = '';
  addStars(1);
}
function savePoem() {
  const t = document.getElementById('poemText').textContent;
  if (!t) return;
  state.stories.push({ type: 'poem', title: 'شعر ' + new Date().toLocaleDateString('fa-IR'), content: t, date: Date.now() });
  saveState(); updateTreasureSummary(); addStars(1); alert('ذخیره شد!');
}

const DEFAULT_PLAN = [
  { id: 1, text: 'صبحانه', done: false, icon: '🌅' },
  { id: 2, text: 'یادگیری', done: false, icon: '📚' },
  { id: 3, text: 'بازی', done: false, icon: '🎮' },
  { id: 4, text: 'نقاشی', done: false, icon: '🎨' },
  { id: 5, text: 'کمک در خانه', done: false, icon: '🏠' },
  { id: 6, text: 'خانواده', done: false, icon: '👨‍👩‍👧' },
  { id: 7, text: 'قصه', done: false, icon: '📖' },
  { id: 8, text: 'خواب', done: false, icon: '🌙' }
];
function renderPlanner() {
  if (!state.planner.length) state.planner = JSON.parse(JSON.stringify(DEFAULT_PLAN));
  const el = document.getElementById('plannerList'); if (!el) return;
  el.innerHTML = state.planner.map(function(p) {
    return '<label style="display:flex;align-items:center;gap:10px;padding:10px;background:' + (p.done?'#e8f8f0':'#fdf8ff') + ';border-radius:12px;margin:6px 0;cursor:pointer">' +
      '<input type="checkbox" ' + (p.done?'checked':'') + ' onchange="togglePlan(' + p.id + ')">' +
      '<span style="font-size:1.3rem">' + p.icon + '</span>' +
      '<span style="' + (p.done?'text-decoration:line-through;color:#888':'') + '">' + p.text + '</span></label>';
  }).join('');
  const done = state.planner.filter(function(p){return p.done;}).length;
  const pct = Math.round(done / state.planner.length * 100);
  document.getElementById('plannerProgress').style.width = pct + '%';
  document.getElementById('plannerMsg').textContent = pct===100 ? 'آفرین! 🌟' : done + ' از ' + state.planner.length;
}
function togglePlan(id) {
  const p = state.planner.find(function(x){return x.id===id;});
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
  if (!confirm('بازنشانی؟')) return;
  state.planner = JSON.parse(JSON.stringify(DEFAULT_PLAN));
  saveState(); renderPlanner();
}
async function aiSuggestPlan() {
  if (!state.apiKey || !state.apiEnabled) { alert('کلید API لازم است.'); return; }
  const el = document.getElementById('planAIResult');
  el.classList.remove('hidden'); el.textContent = '...';
  const res = await callAPI([
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: '۵ فعالیت شاد ساده برای دختر ۷ ساله امروز. لیست کوتاه.' }
  ]);
  el.textContent = res.content || res.error;
}

function renderRecipes() {
  const el = document.getElementById('recipeList'); if (!el) return;
  el.innerHTML = RECIPES.map(function(r,i){
    return '<button class="choice-btn" onclick="showRecipe(' + i + ')">' + r.name + '</button>';
  }).join('');
}
function showRecipe(i) {
  const r = RECIPES[i];
  document.getElementById('recipeName').textContent = r.name;
  document.getElementById('recipeIngredients').innerHTML = r.ingredients.map(function(x){return '<li>'+x+'</li>';}).join('');
  document.getElementById('recipeSteps').innerHTML = r.steps.map(function(x){return '<li>'+x+'</li>';}).join('');
  document.getElementById('recipeDetail').classList.remove('hidden');
}
let cookSecs = 0;
function startCookTimer(min) {
  stopCookTimer(); cookSecs = min*60; updateCookDisplay();
  cookTimerInterval = setInterval(function(){
    cookSecs--; updateCookDisplay();
    if (cookSecs<=0) { stopCookTimer(); alert('⏰ تمام!'); }
  }, 1000);
}
function stopCookTimer() { clearInterval(cookTimerInterval); }
function updateCookDisplay() {
  const m = Math.floor(cookSecs/60), s = cookSecs%60;
  document.getElementById('cookTimer').textContent = String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}
async function aiNewRecipe() {
  if (!state.apiKey || !state.apiEnabled) { alert('کلید API لازم است.'); return; }
  const el = document.getElementById('cookAIResult');
  el.classList.remove('hidden'); el.textContent = '...';
  const res = await callAPI([
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: 'دستور پخت خیلی ساده امن برای کودک با بزرگسال. مواد و مراحل کوتاه.' }
  ]);
  el.textContent = res.content || res.error;
}

function renderCrafts() {
  const el = document.getElementById('craftList'); if (!el) return;
  el.innerHTML = CRAFTS.map(function(c,i){
    return '<button class="choice-btn" onclick="showCraft(' + i + ')">' + c.name + '</button>';
  }).join('');
}
function showCraft(i) {
  const c = CRAFTS[i];
  document.getElementById('craftName').textContent = c.name;
  document.getElementById('craftMaterials').innerHTML = c.materials.map(function(x){return '<li>'+x+'</li>';}).join('');
  document.getElementById('craftSteps').innerHTML = c.steps.map(function(x){return '<li>'+x+'</li>';}).join('');
  document.getElementById('craftDetail').classList.remove('hidden');
}
async function aiNewCraft() {
  if (!state.apiKey || !state.apiEnabled) { alert('کلید API لازم است.'); return; }
  const el = document.getElementById('craftAIResult');
  el.classList.remove('hidden'); el.textContent = '...';
  const res = await callAPI([
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: 'کاردستی کاغذی خیلی ساده برای کودک ۷ ساله. وسایل و مراحل کوتاه.' }
  ]);
  el.textContent = res.content || res.error;
}
