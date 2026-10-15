// ---------- Games ----------
function startMemoryGame() {
  document.getElementById('gameArea').classList.remove('hidden');
  document.getElementById('gameTitle').textContent = '🃏 حافظه';
  const emojis = ['🐱','🐰','🦋','🌟','🌸','🦄'];
  const cards = shuffle(emojis.concat(emojis));
  let flipped = [], matched = 0, score = 0, lock = false;
  const board = document.createElement('div');
  board.className = 'game-board'; board.style.gridTemplateColumns = 'repeat(4,1fr)';
  cards.forEach(function(e) {
    const card = document.createElement('div');
    card.className = 'memory-card'; card.dataset.val = e; card.textContent = '?';
    card.onclick = function() {
      if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
      card.classList.add('flipped'); card.textContent = e; flipped.push(card);
      if (flipped.length === 2) {
        lock = true;
        if (flipped[0].dataset.val === flipped[1].dataset.val) {
          flipped.forEach(function(c){ c.classList.add('matched'); });
          matched++; score += 10;
          document.getElementById('gameScore').textContent = 'امتیاز: ' + score;
          if (matched === emojis.length) { addStars(5); alert('آفرین! 🌟'); }
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
  document.getElementById('gameTitle').textContent = '🔢 الگو';
  const start = Math.floor(Math.random()*5)+1, step = Math.floor(Math.random()*3)+1;
  const seq = [start, start+step, start+2*step, start+3*step];
  const ans = start + 4*step;
  document.getElementById('gameContent').innerHTML = '<p style="font-size:1.3rem;text-align:center;margin:16px 0">' + seq.join(' ، ') + ' ، ؟</p><div id="patOpts"></div>';
  const opts = document.getElementById('patOpts');
  shuffle([ans, ans+step, ans-1, ans+2]).forEach(function(c) {
    const b = document.createElement('button'); b.className = 'choice-btn'; b.textContent = c;
    b.onclick = function() { if (c===ans) { addStars(2); alert('درست! 🌟'); } else alert('دوباره امتحان کن'); };
    opts.appendChild(b);
  });
}
async function aiNewRiddle() {
  if (!state.apiKey || !state.apiEnabled) { alert('کلید API لازم است.'); return; }
  const el = document.getElementById('riddleAIResult');
  el.classList.remove('hidden'); el.textContent = '...';
  const res = await callAPI([
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: 'معمای ساده بامزه برای کودک ۷ ساله. اول معما بعد جواب.' }
  ]);
  el.textContent = res.content || res.error;
}

function saveDream() {
  const t = document.getElementById('dreamInput').value.trim();
  if (!t) return;
  state.dreams.push({ type:'dream', title:'آرزو', content:t, date:Date.now() });
  saveState(); renderDreams(); updateTreasureSummary();
  document.getElementById('dreamInput').value = '';
  addStars(1); alert('ذخیره شد! 🌙');
}
async function makeDreamStory() {
  const t = document.getElementById('dreamInput').value.trim() || (state.dreams.slice(-1)[0]&&state.dreams.slice(-1)[0].content);
  if (!t) { alert('اول بنویس.'); return; }
  if (state.apiKey && state.apiEnabled) {
    const res = await callAPI([
      { role:'system', content:systemPrompt() },
      { role:'user', content:'داستان کوتاه درباره این آرزو: '+t }
    ]);
    alert(res.content || res.error);
  } else alert('روزی محیا آرزو کرد که '+t+' ✨');
}
function renderDreams() {
  const el = document.getElementById('dreamsList'); if (!el) return;
  if (!state.dreams.length) { el.innerHTML='<p style="color:#999">خالی</p>'; return; }
  el.innerHTML = state.dreams.slice().reverse().map(function(d){
    return '<div style="background:#fdf8ff;padding:10px;border-radius:12px;margin:6px 0">🌙 '+escapeHtml(d.content)+'</div>';
  }).join('');
}
function createPlanet() {
  const name = document.getElementById('planetName').value.trim() || 'محیا';
  const color = document.getElementById('planetColor').value;
  document.getElementById('planetResult').textContent = '🪐 سیاره «'+name+'» '+color;
  window._planetDesc = 'سیاره '+name+' رنگ '+color;
  addStars(1);
}
async function aiPlanetStory() {
  if (!state.apiKey || !state.apiEnabled) { alert('کلید API لازم است.'); return; }
  const res = await callAPI([
    { role:'system', content:systemPrompt() },
    { role:'user', content:'داستان کوتاه درباره زندگی روی: '+(window._planetDesc||'سیاره جادویی') }
  ]);
  alert(res.content || res.error);
}

function renderTreasure(filter) {
  var items = [];
  if (filter==='all'||filter==='story') items=items.concat(state.stories.map(function(s){return Object.assign({kind:'story'},s);}));
  if (filter==='all'||filter==='paint') items=items.concat(state.paintings.map(function(p){return Object.assign({kind:'paint'},p);}));
  if (filter==='all'||filter==='idea') items=items.concat((state.ideas||[]).map(function(i){return Object.assign({kind:'idea'},i);}));
  if (filter==='all'||filter==='dream') items=items.concat(state.dreams.map(function(d){return Object.assign({kind:'dream'},d);}));
  const el = document.getElementById('treasureList');
  if (!el) return;
  if (!items.length) { el.innerHTML = '<p style="color:#999">هنوز چیزی نیست</p>'; return; }
  el.innerHTML = items.slice().reverse().map(function(it){
    if (it.kind==='paint' && it.data) return '<div class="gallery-item"><img src="'+it.data+'"><div class="cap">'+escapeHtml(it.title||'نقاشی')+'</div></div>';
    return '<div style="background:#fdf8ff;padding:10px;border-radius:12px;margin:6px 0">'+(it.kind==='story'?'📖':it.kind==='idea'?'💡':'🌙')+' '+escapeHtml(it.title||it.content||'')+'</div>';
  }).join('');
}

// ---------- Parent / API ----------
function openParentSettings() {
  document.getElementById('parentLock').classList.remove('hidden');
  document.getElementById('parentPanel').classList.add('hidden');
  showScreen('parent');
}
function checkParentPin() {
  const pin = document.getElementById('parentPin').value;
  if (pin === '1234' || pin === state.parentPin) {
    document.getElementById('parentLock').classList.add('hidden');
    document.getElementById('parentPanel').classList.remove('hidden');
    document.getElementById('apiKey').value = state.apiKey || '';
    document.getElementById('apiBase').value = state.apiBase || 'https://www.cleanapis.com/v1';
    if (state.apiModel) document.getElementById('apiModel').value = state.apiModel;
  } else alert('کد اشتباه است');
}
function toggleKeyVisibility() {
  const i = document.getElementById('apiKey');
  i.type = i.type === 'password' ? 'text' : 'password';
}
async function fetchModels() {
  if (!state.apiKey) { alert('اول کلید را وارد کن'); return; }
  const base = (document.getElementById('apiBase').value || state.apiBase).replace(/\/$/, '');
  try {
    const res = await fetch(base + '/models', { headers: { 'Authorization': 'Bearer ' + state.apiKey } });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const sel = document.getElementById('apiModel');
    sel.innerHTML = '';
    (data.data || data || []).forEach(function(m) {
      const id = m.id || m;
      const opt = document.createElement('option');
      opt.value = id; opt.textContent = id;
      sel.appendChild(opt);
    });
    if (state.apiModel) sel.value = state.apiModel;
  } catch (e) { alert('خطا در گرفتن مدل‌ها: ' + e.message); }
}
async function testConnection() {
  const key = document.getElementById('apiKey').value.trim();
  const base = document.getElementById('apiBase').value.trim().replace(/\/$/, '');
  const model = document.getElementById('apiModel').value;
  if (!key) { alert('کلید خالی است'); return; }
  state.apiKey = key; state.apiBase = base; state.apiModel = model; state.apiEnabled = true;
  document.getElementById('apiStatus').textContent = 'در حال تست...';
  document.getElementById('apiStatus').className = 'msg msg-info';
  const res = await callAPI([
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: 'سلام، فقط بگو «اتصال موفق»' }
  ], { max_tokens: 50 });
  if (res.content) {
    document.getElementById('apiStatus').textContent = '✅ اتصال موفق — ' + (res.content || '').slice(0, 60);
    document.getElementById('apiStatus').className = 'msg msg-success';
  } else {
    document.getElementById('apiStatus').textContent = '❌ ' + (res.error || 'خطا');
    document.getElementById('apiStatus').className = 'msg msg-error';
  }
}
function disableAPI() {
  state.apiKey = ''; state.apiEnabled = false;
  document.getElementById('apiKey').value = '';
  document.getElementById('apiStatus').textContent = 'غیرفعال شد';
  document.getElementById('apiStatus').className = 'msg msg-warn';
}
function clearAllData() {
  if (!confirm('همه داده‌ها پاک شود؟')) return;
  localStorage.removeItem('mahyaState');
  state = { stars: 0, stories: [], paintings: [], ideas: [], dreams: [], planner: {}, apiKey: '', apiEnabled: false, apiBase: 'https://www.cleanapis.com/v1', apiModel: 'grok-4.5', parentPin: '1234' };
  saveState(); location.reload();
}
function resetStars() { state.stars = 0; saveState(); updateStars(); }

// ---------- Free AI Chat ----------
function sendAIChat() {
  const input = document.getElementById('aiChatInput');
  const q = input.value.trim();
  if (!q) return;
  const chat = document.getElementById('aiChatArea');
  chat.innerHTML += '<div class="bubble user">' + escapeHtml(q) + '</div>';
  chat.innerHTML += '<div class="bubble ai">...</div>';
  input.value = '';
  chat.scrollTop = chat.scrollHeight;
  doSendAIChat(q);
}
async function doSendAIChat(q) {
  const chat = document.getElementById('aiChatArea');
  if (!state.apiKey || !state.apiEnabled) {
    chat.lastChild.innerHTML = 'کلید API لازم است. از تنظیمات والد وارد کن.';
    return;
  }
  const res = await callAPI([
    {role:'system',content:systemPrompt('دوست شاد و کوتاه‌جواب محیا باش.')},
    {role:'user',content:q}
  ]);
  chat.lastChild.innerHTML = escapeHtml(res.content || res.error || 'خطا');
  chat.scrollTop = chat.scrollHeight;
  if (res.content) addStars(1);
}
function clearAIChat(){ document.getElementById('aiChatArea').innerHTML=''; }
function quickAI(text){ document.getElementById('aiChatInput').value=text; sendAIChat(); }

function getPaintBase64() {
  try {
    const canvas = document.getElementById('paintCanvas');
    if (!canvas) return null;
    return canvas.toDataURL('image/jpeg', 0.75);
  } catch (e) { return null; }
}

function buildVisionUserContent(text, imageDataUrl) {
  if (imageDataUrl) {
    return [
      { type: 'text', text: text },
      { type: 'image_url', image_url: { url: imageDataUrl } }
    ];
  }
  return text;
}

async function aiPaintStory() {
  const desc = document.getElementById('paintDescribe').value.trim();
  const el = document.getElementById('paintAIResult');
  el.classList.remove('hidden');
  el.className = 'msg msg-info';
  if (!state.apiKey || !state.apiEnabled) { el.textContent = 'کلید API لازم است. از تنظیمات والد وارد کن.'; return; }
  el.textContent = 'در حال دیدن نقاشی و ساخت داستان... ✨';
  const img = getPaintBase64();
  const promptText = (desc ? 'نقاشی درباره: ' + desc + '. ' : '') +
    'این نقاشی کودکانه را ببین. اول خیلی کوتاه بگو چه می‌بینی، بعد یک داستان کوتاه جادویی و شاد از روی آن بساز (حداکثر ۸ خط).';
  const userContent = buildVisionUserContent(promptText, img);
  const res = await callAPI([
    { role: 'system', content: systemPrompt('نقاشی کودک را با مهربانی توصیف کن و داستان بساز.') },
    { role: 'user', content: userContent }
  ]);
  el.textContent = res.content || res.error;
  if (res.content) addStars(2);
}

async function aiPaintIdeas() {
  const desc = document.getElementById('paintDescribe').value.trim();
  const el = document.getElementById('paintAIResult');
  el.classList.remove('hidden');
  el.className = 'msg msg-info';
  if (!state.apiKey || !state.apiEnabled) { el.textContent = 'کلید API لازم است.'; return; }
  el.textContent = 'در حال فکر کردن به ایده‌ها... 💡';
  const img = getPaintBase64();
  const promptText = (desc ? 'نقاشی درباره: ' + desc + '. ' : '') +
    'این نقاشی کودک را ببین و ۳ ایده کوتاه و عملی برای بهتر یا جادویی‌تر کردنش بده.';
  const userContent = buildVisionUserContent(promptText, img);
  const res = await callAPI([
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: userContent }
  ]);
  el.textContent = res.content || res.error;
  if (res.content) addStars(1);
}

async function aiPaintToReal() {
  const desc = document.getElementById('paintDescribe').value.trim();
  const el = document.getElementById('paintAIResult');
  el.classList.remove('hidden');
  el.className = 'msg msg-info';
  if (!state.apiKey || !state.apiEnabled) { el.textContent = 'کلید API لازم است.'; return; }
  el.textContent = 'در حال تبدیل نقاشی به توصیف واقعی... 🖼';
  const img = getPaintBase64();
  const promptText = (desc ? 'موضوع نقاشی: ' + desc + '. ' : '') +
    'این نقاشی کودکانه را ببین. حالا آن را طوری توصیف کن که انگار یک عکس واقعی و زیبا از همان صحنه است. ' +
    'جزئیات واقعی، رنگ‌ها، نور، فضا و حس آن را بنویس تا انگار داریم یک عکس واقعی می‌بینیم. ' +
    'در انتها یک جمله کوتاه بگو که محیا می‌تواند این توصیف را برای ساخت تصویر واقعی استفاده کند.';
  const userContent = buildVisionUserContent(promptText, img);
  const res = await callAPI([
    { role: 'system', content: systemPrompt('توصیف واقعی و شاعرانه از نقاشی کودک بساز.') },
    { role: 'user', content: userContent }
  ], { max_tokens: 1800 });
  el.textContent = res.content || res.error;
  if (res.content) addStars(2);
}

async function aiNewPaintIdea() {
  if (!state.apiKey || !state.apiEnabled) { alert('کلید API لازم است'); return; }
  const res = await callAPI([
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: 'یک موضوع نقاشی جادویی کوتاه برای کودک. فقط یک خط.' }
  ]);
  if (res.content) document.getElementById('paintIdea').textContent = res.content;
  else alert(res.error);
}

async function aiContinueStory() {
  const prev = document.getElementById('storyText').textContent;
  if (!state.apiKey || !state.apiEnabled) { alert('کلید API لازم است'); return; }
  const res = await callAPI([
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: 'ادامه کوتاه:\n' + prev.slice(0,500) }
  ]);
  if (res.content) document.getElementById('storyText').textContent = prev + '\n\n' + res.content;
  else alert(res.error);
}

loadState();
buildHomeCards();
