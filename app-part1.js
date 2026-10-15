/* ============================================================
   Mahya's Magical World — Core Application Part 1
   ============================================================ */

const SECTIONS = [
  { id: 'story', title: 'کارخانه قصه‌ها', emoji: '📖', color: 'pink' },
  { id: 'school', title: 'مدرسه رنگین‌کمانی', emoji: '🏫', color: 'purple' },
  { id: 'paint', title: 'استودیوی هنر', emoji: '🎨', color: 'mint' },
  { id: 'animals', title: 'جنگل اسرارآمیز', emoji: '🌲', color: 'yellow' },
  { id: 'creativity', title: 'مخترع‌های کوچک', emoji: '💡', color: 'turquoise' },
  { id: 'homework', title: 'دوست یادگیری', emoji: '📝', color: 'peach' },
  { id: 'poems', title: 'جعبه موسیقی', emoji: '🎵', color: 'pink' },
  { id: 'planner', title: 'تقویم من', emoji: '📅', color: 'purple' },
  { id: 'cooking', title: 'آشپزخانه رنگی', emoji: '🍳', color: 'mint' },
  { id: 'crafts', title: 'دست‌های جادویی', emoji: '✂️', color: 'yellow' },
  { id: 'games', title: 'معماهای رنگی', emoji: '🧩', color: 'turquoise' },
  { id: 'dreams', title: 'باغ رؤیاها', emoji: '🌙', color: 'peach' },
];

const ANIMALS = [
  { name: 'گربه', emoji: '🐱', type: 'pet', info: 'گربه‌ها حیوانات خانگی مهربانی هستند. غذای مورد علاقه‌شان ماهی و شیر است. آن‌ها خیلی نرم و بازیگوش‌اند!' },
  { name: 'سگ', emoji: '🐶', type: 'pet', info: 'سگ‌ها بهترین دوست انسان هستند. آن‌ها وفادار و بازیگوش‌اند و دوست دارند با تو بدوند!' },
  { name: 'خرگوش', emoji: '🐰', type: 'pet', info: 'خرگوش‌ها گوش‌های بلندی دارند و هویج دوست دارند. آن‌ها خیلی نرم و بامزه‌اند.' },
  { name: 'شیر', emoji: '🦁', type: 'forest', info: 'شیر پادشاه جنگل است. یال طلایی زیبایی دارد و در دشت‌های آفریقا زندگی می‌کند.' },
  { name: 'فیل', emoji: '🐘', type: 'forest', info: 'فیل‌ها بزرگ‌ترین حیوانات خشکی هستند. خرطوم قوی دارند و خیلی باهوش و مهربان‌اند.' },
  { name: 'روباه', emoji: '🦊', type: 'forest', info: 'روباه‌ها حیوانات باهوشی هستند. دم پشمالوی زیبایی دارند و در جنگل زندگی می‌کنند.' },
  { name: 'ماهی', emoji: '🐟', type: 'sea', info: 'ماهی‌ها در آب زندگی می‌کنند و با آبشش نفس می‌کشند. رنگ‌های زیبای زیادی دارند.' },
  { name: 'دلفین', emoji: '🐬', type: 'sea', info: 'دلفین‌ها حیوانات بسیار باهوش دریایی هستند. آن‌ها دوست دارند بازی کنند و می‌خندند!' },
  { name: 'لاک‌پشت', emoji: '🐢', type: 'sea', info: 'لاک‌پشت‌ها خانه‌شان را روی پشتشان حمل می‌کنند. خیلی آرام حرکت می‌کنند.' },
  { name: 'پرستو', emoji: '🐦', type: 'bird', info: 'پرستوها پرنده‌های زیبایی هستند که در بهار به ایران می‌آیند و لانه می‌سازند.' },
  { name: 'جغد', emoji: '🦉', type: 'bird', info: 'جغدها شب‌ها بیدارند و چشم‌های درشتی دارند. آن‌ها خیلی ساکت پرواز می‌کنند.' },
  { name: 'پروانه', emoji: '🦋', type: 'bird', info: 'پروانه از کرم ابریشم به وجود می‌آید و بال‌های رنگارنگ زیبایی دارد.' },
];

const PAINT_IDEAS = [
  'یک خانه روی ابرها', 'حیوانی با بال‌های رنگین‌کمانی', 'شهر زیر دریا',
  'باغی که شب‌ها می‌درخشد', 'یک ربات مهربان', 'خانواده در سیاره‌ای دیگر',
  'قلعه جادویی با تک‌شاخ', 'درخت کریستالی', 'گربه فضانورد', 'رنگین‌کمان روی دریا'
];

const CREATIVITY_PROMPTS = [
  'اگر می‌توانستی پرواز کنی، کجا می‌رفتی؟',
  'اگر یک روز نامرئی بودی، چه کار خوبی انجام می‌دادی؟',
  'اگر یک سیاره مخصوص خودت داشتی، چه شکلی بود؟',
  'یک اختراع جدید فکر کن که به دوستانت کمک کند.',
  'اگر حیوانات حرف می‌زدند، اولین چیزی که به گربه‌ات می‌گفتی چه بود؟',
  'یک وسیله جادویی طراحی کن که مشق‌ها را سرگرم‌کننده کند.',
  'اگر می‌توانستی یک رنگ جدید بسازی، اسمش چه بود و چه شکلی بود؟',
  'یک داستان ناتمام: خرگوش کوچولو به جنگل رفت و ناگهان...'
];

const RECIPES = [
  {
    name: 'شیک موز و شیر',
    ingredients: ['۱ موز رسیده', '۱ لیوان شیر', 'کمی عسل (اختیاری)', 'چند تکه یخ'],
    steps: ['موز را با کمک بزرگسال پوست بکن و تکه‌تکه کن.', 'همه مواد را در مخلوط‌کن بریز.', 'مخلوط کن تا یکدست شود.', 'در لیوان بریز و لذت ببر!']
  },
  {
    name: 'ساندویچ رنگین‌کمانی',
    ingredients: ['نان تست', 'پنیر', 'خیار', 'گوجه', 'کاهو'],
    steps: ['نان را آماده کن.', 'لایه‌های سبزیجات رنگارنگ را بچین.', 'با کمک بزرگسال برش بزن.', 'تزیین کن و میل کن!']
  },
  {
    name: 'کلوچه بدون فر (ماهتابی)',
    ingredients: ['آرد', 'شکر', 'کره', 'پودر نارگیل'],
    steps: ['مواد را با کمک بزرگسال مخلوط کن.', 'به شکل دایره دربیاور.', 'در تابه با حرارت کم بپز (فقط بزرگسال!).', 'صبر کن خنک شود.']
  }
];

const CRAFTS = [
  {
    name: 'ماسک گربه کاغذی',
    materials: ['کاغذ رنگی', 'قیچی (با بزرگسال)', 'کش یا نخ', 'ماژیک'],
    steps: ['صورت گربه را روی کاغذ بکش.', 'با کمک بزرگسال چشم‌ها را ببر.', 'گوش‌ها را بچسبان.', 'کش را وصل کن و بپوش!']
  },
  {
    name: 'گل با رول دستمال',
    materials: ['رول دستمال کاغذی', 'رنگ', 'چوب بستنی', 'چسب'],
    steps: ['رول را رنگ کن.', 'به شکل گل ببر.', 'به چوب بچسبان.', 'در گلدان بگذار!']
  },
  {
    name: 'کارت تبریک رنگین‌کمان',
    materials: ['کاغذ رنگی', 'ماژیک', 'برچسب', 'چسب'],
    steps: ['کاغذ را تا کن.', 'رنگین‌کمان بکش.', 'پیام قشنگ بنویس.', 'تزیین کن و هدیه بده!']
  }
];

const WORD_CHIPS = ['خرگوش', 'قلعه', 'ماه', 'بادکنک', 'گربه سخنگو', 'رنگین‌کمان', 'ستاره', 'جنگل', 'دریا', 'روباه'];
const AVATARS = ['🦄', '🐱', '🐰', '🦋', '🌸', '🌈', '⭐', '🎀', '🧁', '🦊', '🐰', '👸'];

let state = {
  stars: 0, avatar: '🦄', apiKey: null,
  apiBase: 'https://www.cleanapis.com/v1', apiModel: 'grok-4.5', apiEnabled: false,
  stories: [], paintings: [], ideas: [], dreams: [], planner: [], history: []
};

let paintTool = 'pen', isDrawing = false, lastX = 0, lastY = 0, paintHistory = [], startX = 0, startY = 0, cookTimerInterval = null;

function loadState() {
  try {
    const s = localStorage.getItem('mahya_data');
    if (s) {
      const d = JSON.parse(s);
      state.stars = d.stars || 0; state.avatar = d.avatar || '🦄';
      state.stories = d.stories || []; state.paintings = d.paintings || [];
      state.ideas = d.ideas || []; state.dreams = d.dreams || []; state.planner = d.planner || [];
    }
  } catch (e) { console.warn('load error', e); }
  updateStarsUI();
  const av = document.getElementById('avatarDisplay');
  if (av) av.textContent = state.avatar;
}

function saveState() {
  try {
    localStorage.setItem('mahya_data', JSON.stringify({
      stars: state.stars, avatar: state.avatar,
      stories: state.stories, paintings: state.paintings.slice(-20),
      ideas: state.ideas.slice(-30), dreams: state.dreams.slice(-20), planner: state.planner
    }));
  } catch (e) { console.warn('save error', e); }
}

function addStars(n) { state.stars += n; updateStarsUI(); saveState(); }
function updateStarsUI() {
  const el = document.getElementById('starsCount');
  if (el) el.textContent = state.stars;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
  const back = document.getElementById('backBtn');
  if (id === 'home') {
    if (back) back.classList.add('hidden');
    document.getElementById('headerTitle').textContent = '✨ دنیای جادویی محیا';
  } else {
    if (back) back.classList.remove('hidden');
    const sec = SECTIONS.find(s => s.id === id);
    document.getElementById('headerTitle').textContent = sec ? sec.emoji + ' ' + sec.title : 'دنیای جادویی محیا';
  }
  if (id === 'paint') initPaint();
  if (id === 'animals') renderAnimals('all');
  if (id === 'planner') renderPlanner();
  if (id === 'cooking') renderRecipes();
  if (id === 'crafts') renderCrafts();
  if (id === 'creativity') { newCreativityPrompt(); renderIdeas(); }
  if (id === 'dreams') renderDreams();
  if (id === 'treasure') renderTreasure('all');
  if (id === 'story') renderWordChips();
  if (id === 'avatar') renderAvatars();
  window.scrollTo(0, 0);
}

function goHome() { showScreen('home'); }

function buildHomeCards() {
  const grid = document.getElementById('sectionGrid');
  if (!grid) return;
  grid.innerHTML = SECTIONS.map(s =>
    `<div class="card ${s.color}" onclick="showScreen('${s.id}')"><div class="emoji">${s.emoji}</div><div class="title">${s.title}</div></div>`
  ).join('');
  const ideas = ['یک داستان جادویی بساز!', 'نقاشی بکش و ذخیره کن!', 'بازی حافظه را امتحان کن!', 'آرزویت را بنویس!', 'حیوان خیالی بساز!'];
  const ds = document.getElementById('dailySuggestion');
  if (ds) ds.textContent = ideas[new Date().getDate() % ideas.length];
  updateTreasureSummary();
}

function doDailySuggestion() {
  const map = [0,2,10,11,3];
  showScreen(SECTIONS[map[new Date().getDate() % map.length]].id);
}

function updateTreasureSummary() {
  const total = state.stories.length + state.paintings.length + state.ideas.length + state.dreams.length;
  const el = document.getElementById('treasureSummary');
  if (el) el.textContent = total ? `تو ${total} اثر داری! 🌟` : 'هنوز اثری ذخیره نکردی. بیا شروع کنیم!';
}

function openAvatarPicker() { showScreen('avatar'); }
function renderAvatars() {
  const el = document.getElementById('avatarOptions');
  if (!el) return;
  el.innerHTML = AVATARS.map(a =>
    `<div class="card" onclick="selectAvatar('${a}')" style="font-size:2.5rem;min-height:80px">${a}</div>`
  ).join('');
}
function selectAvatar(a) {
  state.avatar = a;
  document.getElementById('avatarDisplay').textContent = a;
  saveState(); goHome();
}

async function callAPI(messages, opts) {
  opts = opts || {};
  if (!state.apiKey || !state.apiEnabled) {
    return { error: 'کلید API تنظیم نشده یا غیرفعال است. از تنظیمات والد وارد کن.' };
  }
  const base = ((document.getElementById('apiBase') && document.getElementById('apiBase').value) || state.apiBase).replace(/\/$/, '');
  const model = (document.getElementById('apiModel') && document.getElementById('apiModel').value) || state.apiModel;
  const body = { model: model, messages: messages.slice(-6), max_tokens: opts.max_tokens || 800, temperature: 0.8 };
  try {
    const lr = document.getElementById('lastRequest');
    if (lr) lr.textContent = 'آخرین درخواست: ' + new Date().toLocaleTimeString('fa-IR');
    const res = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + state.apiKey },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      let msg = 'خطای ' + res.status;
      if (res.status === 401) msg = 'کلید API نامعتبر است.';
      else if (res.status === 429) msg = 'محدودیت مصرف. کمی صبر کن.';
      else if (res.status === 404) msg = 'آدرس یا مدل پیدا نشد.';
      return { error: msg };
    }
    const data = await res.json();
    const content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || data.content || JSON.stringify(data);
    return { content: content, usage: data.usage };
  } catch (e) {
    if (e.name === 'TypeError') return { error: 'خطای شبکه یا CORS. برای تست از localhost استفاده کن.' };
    return { error: 'خطا: ' + e.message };
  }
}

function systemPrompt(extra) {
  return 'تو یک دستیار مهربان و کودکانه برای دختر ۷ ساله به نام محیا هستی. همیشه به فارسی ساده، شاد و مناسب کودک پاسخ بده. از محتوای ترسناک، خشن یا نامناسب پرهیز کن. ' + (extra || '');
}

function renderWordChips() {
  const el = document.getElementById('wordChips');
  if (!el) return;
  el.innerHTML = WORD_CHIPS.map(w =>
    `<button class="btn btn-sm btn-secondary" onclick="addWord('${w}')">${w}</button>`
  ).join('');
}
function addWord(w) {
  const inp = document.getElementById('storyWords');
  inp.value = (inp.value ? inp.value + '، ' : '') + w;
}

async function makeStory() {
  const words = document.getElementById('storyWords').value.trim();
  const style = document.getElementById('storyStyle').value;
  const length = document.getElementById('storyLength').value;
  if (!words) { showTempMsg('storyStatus', 'حداقل یک کلمه بنویس!', 'warn'); return; }
  const localStory = 'روزی روزگاری یک ' + (words.split(/[،,]/)[0] || 'خرگوش') + ' در سرزمین جادویی زندگی می‌کرد. او عاشق ' + style + ' بودن بود و با دوستانش ماجراهای قشنگ داشت. در پایان همه خوشحال بودند و ستاره‌ها برایشان می‌درخشیدند. 🌟';
  const btn = document.getElementById('btnMakeStory');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> در حال ساخت...';
  let text = localStory;
  if (state.apiKey && state.apiEnabled) {
    const res = await callAPI([
      { role: 'system', content: systemPrompt('یک داستان کودکانه کوتاه و زیبا بنویس.') },
      { role: 'user', content: 'یک داستان ' + length + ' و ' + style + ' با این کلمات بساز: ' + words + '. مناسب کودک ۷ ساله.' }
    ]);
    if (res.content) text = res.content;
    else if (res.error) showTempMsg('storyStatus', res.error + ' — داستان محلی نمایش داده شد.', 'warn');
  }
  document.getElementById('storyText').textContent = text;
  document.getElementById('storyTitle').textContent = 'داستان جادویی تو ✨';
  document.getElementById('storyResult').classList.remove('hidden');
  document.getElementById('storyChoices').innerHTML =
    '<p style="margin-top:12px;font-weight:700">ادامه داستان را انتخاب کن:</p>' +
    '<button class="choice-btn" onclick="continueStory(\'غار\')">وارد غار جادویی شود</button>' +
    '<button class="choice-btn" onclick="continueStory(\'رنگین‌کمان\')">از پل رنگین‌کمان عبور کند</button>' +
    '<button class="choice-btn" onclick="continueStory(\'دوست\')">با یک دوست جدید آشنا شود</button>';
  btn.disabled = false; btn.innerHTML = '✨ ساخت داستان';
  addStars(1);
}

async function continueStory(choice) {
  const prev = document.getElementById('storyText').textContent;
  if (state.apiKey && state.apiEnabled) {
    const res = await callAPI([
      { role: 'system', content: systemPrompt() },
      { role: 'user', content: 'ادامه این داستان را بنویس که شخصیت ' + choice + ' را انتخاب کند:\n' + prev.slice(0, 400) }
    ]);
    if (res.content) { document.getElementById('storyText').textContent = prev + '\n\n' + res.content; return; }
  }
  const cont = {
    'غار': '\n\nاو وارد غار جادویی شد و آنجا ستاره‌های درخشان پیدا کرد که به او قدرت مهربانی دادند!',
    'رنگین‌کمان': '\n\nاز پل رنگین‌کمان عبور کرد و به سرزمین رنگ‌ها رسید که همه چیز آنجا شاد و رنگی بود!',
    'دوست': '\n\nبا یک پروانه سخنگو دوست شد و با هم آهنگ زیبایی خواندند!'
  };
  document.getElementById('storyText').textContent = prev + (cont[choice] || '');
}

function saveStory() {
  const text = document.getElementById('storyText').textContent;
  if (!text) return;
  state.stories.push({ type: 'story', title: 'داستان ' + new Date().toLocaleDateString('fa-IR'), content: text, date: Date.now() });
  saveState(); updateTreasureSummary();
  showTempMsg('storyStatus', 'داستان در گنجینه ذخیره شد! ⭐', 'success');
  addStars(2);
}

function startVoiceStory() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    showTempMsg('storyStatus', 'مرورگر تو از تشخیص گفتار پشتیبانی نمی‌کند. لطفاً تایپ کن.', 'warn'); return;
  }
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const r = new Rec(); r.lang = 'fa-IR';
  r.onresult = function(e) { document.getElementById('storyWords').value = e.results[0][0].transcript; };
  r.onerror = function() { showTempMsg('storyStatus', 'تشخیص صدا ممکن نشد. تایپ کن.', 'warn'); };
  r.start();
  showTempMsg('storyStatus', '🎤 گوش می‌دهم... صحبت کن!', 'info');
}

let schoolState = { type: null, score: 0, q: 0 };
function startMathGame() { schoolState = { type: 'math', score: 0, q: 0 }; document.getElementById('schoolGameArea').classList.remove('hidden'); nextSchoolQ(); }
function startLetterGame() { schoolState = { type: 'letter', score: 0, q: 0 }; document.getElementById('schoolGameArea').classList.remove('hidden'); nextSchoolQ(); }
function startCountGame() { schoolState = { type: 'count', score: 0, q: 0 }; document.getElementById('schoolGameArea').classList.remove('hidden'); nextSchoolQ(); }
function startShapeGame() { schoolState = { type: 'shape', score: 0, q: 0 }; document.getElementById('schoolGameArea').classList.remove('hidden'); nextSchoolQ(); }

function nextSchoolQ() {
  const fb = document.getElementById('schoolFeedback'); fb.style.display = 'none';
  document.getElementById('schoolNext').style.display = 'none';
  schoolState.q++;
  const opts = document.getElementById('schoolOptions'); opts.innerHTML = '';
  if (schoolState.type === 'math') {
    const a = Math.floor(Math.random() * 8) + 1, b = Math.floor(Math.random() * 8) + 1;
    const op = Math.random() > 0.5 ? '+' : '-';
    let ans, q;
    if (op === '+') { ans = a + b; q = a + ' + ' + b + ' = ؟'; }
    else { const x = Math.max(a,b), y = Math.min(a,b); ans = x - y; q = x + ' − ' + y + ' = ؟'; }
    document.getElementById('schoolQ').textContent = q;
    shuffle([ans, ans+1, ans-1, ans+2].filter(function(v,i,arr){ return arr.indexOf(v)===i && v>=0; }).slice(0,4)).forEach(function(c) {
      const b = document.createElement('button'); b.className = 'choice-btn'; b.textContent = c;
      b.onclick = function() { checkSchool(c === ans, ans); }; opts.appendChild(b);
    });
  } else if (schoolState.type === 'letter') {
    const letters = ['آ','ب','پ','ت','س','ش','م','ن','ی','ک'];
    const L = letters[Math.floor(Math.random()*letters.length)];
    document.getElementById('schoolQ').textContent = 'کدام حرف «' + L + '» است؟';
    shuffle([L].concat(letters.filter(function(x){return x!==L;}).slice(0,3))).forEach(function(c) {
      const b = document.createElement('button'); b.className = 'choice-btn'; b.style.fontSize = '1.5rem'; b.textContent = c;
      b.onclick = function() { checkSchool(c === L, L); }; opts.appendChild(b);
    });
  } else if (schoolState.type === 'count') {
    const n = Math.floor(Math.random()*6)+2;
    document.getElementById('schoolQ').textContent = 'چند ستاره می‌بینی؟ ' + '⭐'.repeat(n);
    shuffle([n, n+1, n-1, n+2].filter(function(v){return v>0;})).forEach(function(c) {
      const b = document.createElement('button'); b.className = 'choice-btn'; b.textContent = c;
      b.onclick = function() { checkSchool(c === n, n); }; opts.appendChild(b);
    });
  } else if (schoolState.type === 'shape') {
    const shapes = [{e:'🔴',n:'دایره'},{e:'🟦',n:'مربع'},{e:'🔺',n:'مثلث'},{e:'⭐',n:'ستاره'}];
    const s = shapes[Math.floor(Math.random()*shapes.length)];
    document.getElementById('schoolQ').textContent = 'این شکل چیست؟ ' + s.e;
    shuffle(shapes.map(function(x){return x.n;})).forEach(function(c) {
      const b = document.createElement('button'); b.className = 'choice-btn'; b.textContent = c;
      b.onclick = function() { checkSchool(c === s.n, s.n); }; opts.appendChild(b);
    });
  }
}

function checkSchool(ok, ans) {
  const fb = document.getElementById('schoolFeedback'); fb.style.display = 'block';
  if (ok) { fb.className = 'msg msg-success'; fb.textContent = 'آفرین! درست بودی 🌟'; schoolState.score++; addStars(1); }
  else { fb.className = 'msg msg-info'; fb.textContent = 'نزدیک بودی! جواب درست «' + ans + '» بود. دوباره تلاش کن 💪'; }
  document.getElementById('schoolNext').style.display = 'inline-flex';
  document.getElementById('schoolOptions').querySelectorAll('button').forEach(function(b){ b.disabled = true; });
}

async function askHomework() {
  const q = document.getElementById('homeworkQ').value.trim();
  if (!q) return;
  const chat = document.getElementById('homeworkChat');
  chat.innerHTML += '<div class="bubble bubble-user">' + escapeHtml(q) + '</div>';
  document.getElementById('homeworkQ').value = '';
  if (!state.apiKey || !state.apiEnabled) {
    chat.innerHTML += '<div class="bubble bubble-ai">برای پاسخ هوشمندانه، والد باید کلید API را در تنظیمات وارد کند. فعلاً از بازی‌های ریاضی و حروف همین بخش استفاده کن! 🌈</div>';
    return;
  }
  chat.innerHTML += '<div class="bubble bubble-ai"><span class="spinner"></span> فکر می‌کنم...</div>';
  const res = await callAPI([
    { role: 'system', content: systemPrompt('مثل یک معلم مهربان کلاس اول رفتار کن. اول راهنمایی کن، جواب نهایی را فوری نگو.') },
    { role: 'user', content: q }
  ]);
  chat.lastChild.innerHTML = res.content || res.error || 'خطا در پاسخ';
  chat.scrollTop = chat.scrollHeight;
}

async function askTutor(mode) {
  const q = document.getElementById('hwInput').value.trim();
  if (!q && !mode) return;
  const chat = document.getElementById('tutorChat');
  const prompt = mode === 'ساده' ? 'ساده‌تر توضیح بده: ' + (state.history.slice(-1)[0] || q)
    : mode === 'مثال' ? 'یک مثال ساده بزن برای: ' + (state.history.slice(-1)[0] || q) : q;
  if (q) {
    chat.innerHTML += '<div class="bubble bubble-user">' + escapeHtml(q) + '</div>';
    state.history.push(q); document.getElementById('hwInput').value = '';
  }
  if (!state.apiKey || !state.apiEnabled) {
    chat.innerHTML += '<div class="bubble bubble-ai">کلید API تنظیم نشده. از بازی‌های محلی بخش مدرسه استفاده کن! 📚</div>'; return;
  }
  chat.innerHTML += '<div class="bubble bubble-ai"><span class="spinner"></span></div>';
  const res = await callAPI([
    { role: 'system', content: systemPrompt('دستیار یادگیری کلاس اول. مرحله‌به‌مرحله راهنمایی کن.') },
    { role: 'user', content: prompt }
  ]);
  chat.lastChild.innerHTML = res.content || res.error;
  chat.scrollTop = chat.scrollHeight;
}

function initPaint() {
  const canvas = document.getElementById('paintCanvas');
  if (!canvas) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = Math.min(600, rect.width - 20);
  canvas.width = w; canvas.height = Math.round(w * 0.66);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  paintHistory = [canvas.toDataURL()];
  setupPaintEvents(); renderPaintGallery();
  document.getElementById('paintIdea').textContent = PAINT_IDEAS[Math.floor(Math.random() * PAINT_IDEAS.length)];
}

function setupPaintEvents() {
  const canvas = document.getElementById('paintCanvas');
  const ctx = canvas.getContext('2d');
  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const scaleX = canvas.width / r.width, scaleY = canvas.height / r.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - r.left) * scaleX, y: (clientY - r.top) * scaleY };
  }
  function start(e) { e.preventDefault(); isDrawing = true; const p = getPos(e); lastX = startX = p.x; lastY = startY = p.y; }
  function move(e) {
    if (!isDrawing) return; e.preventDefault();
    const p = getPos(e);
    const color = document.getElementById('paintColor').value;
    const size = +document.getElementById('paintSize').value;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (paintTool === 'pen') {
      ctx.strokeStyle = color; ctx.lineWidth = size;
      ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(p.x, p.y); ctx.stroke();
      lastX = p.x; lastY = p.y;
    } else if (paintTool === 'eraser') {
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = size * 2;
      ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(p.x, p.y); ctx.stroke();
      lastX = p.x; lastY = p.y;
    }
  }
  function end(e) {
    if (!isDrawing) return; isDrawing = false;
    const p = e.touches && e.changedTouches ? { x: lastX, y: lastY } : getPos(e);
    const color = document.getElementById('paintColor').value;
    const size = +document.getElementById('paintSize').value;
    ctx.strokeStyle = color; ctx.lineWidth = size;
    if (paintTool === 'line') { ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(p.x, p.y); ctx.stroke(); }
    else if (paintTool === 'rect') { ctx.strokeRect(startX, startY, p.x - startX, p.y - startY); }
    else if (paintTool === 'circle') {
      const r = Math.sqrt(Math.pow(p.x - startX, 2) + Math.pow(p.y - startY, 2));
      ctx.beginPath(); ctx.arc(startX, startY, r, 0, Math.PI * 2); ctx.stroke();
    }
    paintHistory.push(canvas.toDataURL());
    if (paintHistory.length > 20) paintHistory.shift();
  }
  canvas.onmousedown = start; canvas.onmousemove = move; canvas.onmouseup = end; canvas.onmouseleave = end;
  canvas.ontouchstart = start; canvas.ontouchmove = move; canvas.ontouchend = end;
}

function setPaintTool(t) { paintTool = t; }
function undoPaint() {
  if (paintHistory.length < 2) return;
  paintHistory.pop();
  const canvas = document.getElementById('paintCanvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = function() { ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(img,0,0); };
  img.src = paintHistory[paintHistory.length - 1];
}
function clearPaint() {
  if (!confirm('بوم پاک شود؟')) return;
  const canvas = document.getElementById('paintCanvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
  paintHistory = [canvas.toDataURL()];
}
function savePainting() {
  const data = document.getElementById('paintCanvas').toDataURL('image/png');
  state.paintings.push({ type: 'paint', title: 'نقاشی ' + new Date().toLocaleDateString('fa-IR'), data: data, date: Date.now() });
  saveState(); renderPaintGallery(); updateTreasureSummary(); addStars(2);
  alert('نقاشی ذخیره شد! 🎨⭐');
}
function downloadPainting() {
  const a = document.createElement('a');
  a.href = document.getElementById('paintCanvas').toDataURL('image/png');
  a.download = 'mahya-painting.png'; a.click();
}
function loadPaintFromFile() { document.getElementById('paintFileInput').click(); }
function handlePaintFile(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.getElementById('paintCanvas');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
      const scale = Math.min(canvas.width/img.width, canvas.height/img.height);
      const w = img.width*scale, h = img.height*scale;
      ctx.drawImage(img, (canvas.width-w)/2, (canvas.height-h)/2, w, h);
      paintHistory.push(canvas.toDataURL());
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}
function renderPaintGallery() {
  const g = document.getElementById('paintGallery'); if (!g) return;
  if (!state.paintings.length) { g.innerHTML = '<p style="color:#999">هنوز نقاشی ذخیره نشده.</p>'; return; }
  g.innerHTML = state.paintings.slice().reverse().map(function(p) {
    return '<div class="gallery-item" onclick="loadPaintingToCanvas(\'' + p.data.replace(/'/g, '') + '\')"><img src="' + p.data + '" alt=""><div class="cap">' + p.title + '</div></div>';
  }).join('');
}
function loadPaintingToCanvas(data) {
  const img = new Image();
  img.onload = function() {
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    paintHistory.push(canvas.toDataURL());
  };
  img.src = data;
}
function newPaintIdea() {
  document.getElementById('paintIdea').textContent = PAINT_IDEAS[Math.floor(Math.random() * PAINT_IDEAS.length)];
}
