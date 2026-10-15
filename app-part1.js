/* ========== STATE ========== */
const SECTIONS = [
  {id:'story',emoji:'📖',title:'کارخانه قصه‌های جادویی',c:'c1'},
  {id:'school',emoji:'🏫',title:'مدرسه رنگین‌کمانی',c:'c2'},
  {id:'art',emoji:'🎨',title:'استودیوی جادویی هنر',c:'c3'},
  {id:'animals',emoji:'🌲',title:'جنگل اسرارآمیز',c:'c4'},
  {id:'create',emoji:'💡',title:'کارگاه مخترع‌های کوچک',c:'c5'},
  {id:'homework',emoji:'📚',title:'دوست کوچولوی یادگیری',c:'c6'},
  {id:'poems',emoji:'🎵',title:'جعبه موسیقی قصه‌ها',c:'c7'},
  {id:'schedule',emoji:'📅',title:'تقویم رنگین‌کمانی من',c:'c8'},
  {id:'cook',emoji:'🍳',title:'آشپزخانه کوچولوی رنگی',c:'c9'},
  {id:'crafts',emoji:'✂️',title:'کارگاه دست‌های جادویی',c:'c10'},
  {id:'games',emoji:'🧩',title:'سرزمین معماهای رنگی',c:'c11'},
  {id:'dreams',emoji:'🌙',title:'باغ رؤیاهای محیا',c:'c12'},
];
const ANIMALS = [
  {e:'🐰',n:'خرگوش',h:'جنگل و دشت',f:'هویج و سبزی',fact:'گوش‌های بلند دارد و خیلی سریع می‌دود.'},
  {e:'🐱',n:'گربه',h:'خانه و باغ',f:'ماهی و شیر',fact:'می‌تواند در تاریکی خوب ببیند.'},
  {e:'🐶',n:'سگ',h:'خانه و پارک',f:'استخوان و غذای سگ',fact:'بهترین دوست انسان است.'},
  {e:'🦋',n:'پروانه',h:'باغ گل',f:'شهد گل',fact:'از کرم ابریشم تبدیل می‌شود.'},
  {e:'🐦',n:'گنجشک',h:'درخت و شهر',f:'دانه و حشره',fact:'آواز زیبایی می‌خواند.'},
  {e:'🐠',n:'ماهی',h:'دریا و رود',f:'جلبک و پلانکتون',fact:'با آبشش نفس می‌کشد.'},
  {e:'🐘',n:'فیل',h:'ساوانا',f:'برگ و علف',fact:'بزرگ‌ترین حیوان خشکی است.'},
  {e:'🦁',n:'شیر',h:'جنگل آفریقا',f:'گوشت',fact:'پادشاه جنگل نامیده می‌شود.'},
];
const RECIPES = [
  {n:'اسموتی موز و توت',e:'🍌',mat:['۱ موز','چند توت فرنگی','۱ لیوان شیر','عسل (اختیاری)'],steps:['موز را پوست بکن','همه مواد را در مخلوط‌کن بریز','هم بزن تا نرم شود','در لیوان بریز و نوش جان!'],warn:'مخلوط‌کن فقط با کمک بزرگسال'},
  {n:'ساندویچ رنگین‌کمان',e:'🥪',mat:['نان تست','خیار','گوجه','پنیر','کاهو'],steps:['نان را برش بده','سبزیجات را با کمک بزرگسال خرد کن','لایه‌لایه بچین','ساندویچ را ببند'],warn:'چاقو فقط با بزرگسال'},
  {n:'پاپ‌کورن خانگی',e:'🍿',mat:['ذرت پاپ‌کورن','کمی روغن','نمک'],steps:['روغن را در قابلمه گرم کن','ذرت را بریز و درب را بگذار','صبر کن تا بترکد','نمک بزن'],warn:'اجاق فقط با بزرگسال'},
];
const CRAFTS = [
  {n:'ماسک گربه کاغذی',e:'😺',mat:['کاغذ رنگی','کش یا نخ','ماژیک','قیچی'],steps:['صورت گربه را روی کاغذ بکش','چشم‌ها را ببر','گوش‌ها را بچسبان','کش را وصل کن'],warn:'قیچی با بزرگسال'},
  {n:'گل با رول دستمال',e:'🌸',mat:['رول دستمال کاغذی','رنگ','کاغذ سبز','چسب'],steps:['رول را رنگ کن','گلبرگ‌ها را بچسبان','ساقه سبز درست کن','گلدان کوچک بساز'],warn:''},
  {n:'کارت تبریک ستاره',e:'⭐',mat:['کاغذ رنگی','برچسب','ماژیک','چسب'],steps:['کاغذ را تا کن','ستاره بکش یا بچسبان','پیام بنویس','تزیین کن'],warn:''},
];
const STORY_WORDS = ['خرگوش','قلعه','ماه','بادکنک','گربه سخنگو','رنگین‌کمان','ستاره','ابر','گل','پروانه','رودخانه','جنگل'];
const IDEAS_DRAW = ['یک خانه روی ابرها','حیوانی با بال‌های رنگین‌کمانی','شهر زیر دریا','باغی که شب‌ها می‌درخشد','یک ربات مهربان','خانواده در سیاره‌ای دیگر'];
const IF_YOU = ['اگر می‌توانستی پرواز کنی، کجا می‌رفتی؟','اگر یک روز نامرئی بودی، چه کار خوبی انجام می‌دادی؟','اگر یک سیاره مخصوص خودت داشتی، چه شکلی بود؟','اگر حیوانات حرف می‌زدند، از کدام می‌پرسیدی؟'];
const DEFAULT_SCHED = [
  {t:'صبحانه و آماده‌شدن',done:false,icon:'🥣'},
  {t:'مدرسه / یادگیری',done:false,icon:'📚'},
  {t:'بازی آزاد',done:false,icon:'🎮'},
  {t:'نقاشی یا کاردستی',done:false,icon:'🎨'},
  {t:'کمک کوچک در خانه',done:false,icon:'🧹'},
  {t:'زمان خانواده',done:false,icon:'👨‍👩‍👧'},
  {t:'مطالعه یا قصه',done:false,icon:'📖'},
  {t:'آماده خواب',done:false,icon:'🌙'},
];

let state = {
  stars: 0,
  avatar: '🐰',
  paintings: [],
  stories: [],
  poems: [],
  ideas: [],
  dreams: [],
  schedule: [],
  apiKey: null,
  apiBase: 'https://www.cleanapis.com/v1',
  apiModel: 'grok-4.5',
  maxTokens: 600,
  history: [],
};

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem('mahya_v1') || '{}');
    if (s.stars != null) state.stars = s.stars;
    if (s.avatar) state.avatar = s.avatar;
    if (s.paintings) state.paintings = s.paintings;
    if (s.stories) state.stories = s.stories;
    if (s.poems) state.poems = s.poems;
    if (s.ideas) state.ideas = s.ideas;
    if (s.dreams) state.dreams = s.dreams;
    if (s.schedule) state.schedule = s.schedule;
    else state.schedule = JSON.parse(JSON.stringify(DEFAULT_SCHED));
  } catch(e) { state.schedule = JSON.parse(JSON.stringify(DEFAULT_SCHED)); }
  document.getElementById('starsCount').textContent = state.stars;
  document.getElementById('avatarBtn').textContent = state.avatar;
}
function saveState() {
  const toSave = {
    stars: state.stars, avatar: state.avatar, paintings: state.paintings,
    stories: state.stories, poems: state.poems, ideas: state.ideas,
    dreams: state.dreams, schedule: state.schedule
  };
  try { localStorage.setItem('mahya_v1', JSON.stringify(toSave)); }
  catch(e) { toast('فضای ذخیره‌سازی پر است!'); }
}
function addStars(n) {
  state.stars += n;
  document.getElementById('starsCount').textContent = state.stars;
  saveState();
  toast('+' + n + ' ستاره! ⭐');
}
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (id === 'art') { initCanvas(); renderArtGallery(); }
  if (id === 'schedule') renderSchedule();
  if (id === 'animals') showAnimals();
  if (id === 'cook') renderRecipes();
  if (id === 'crafts') renderCrafts();
  if (id === 'treasure') renderTreasure();
  if (id === 'avatar') renderAvatarChoices();
  if (id === 'create') renderIdeas();
  if (id === 'dreams') renderDreams();
  window.scrollTo(0,0);
}

function initHome() {
  const grid = document.getElementById('sectionsGrid');
  grid.innerHTML = SECTIONS.map(s =>
    `<div class="card ${s.c}" onclick="showPage('${s.id}')"><span class="emoji">${s.emoji}</span><div class="title">${s.title}</div></div>`
  ).join('');
  document.getElementById('suggestText').textContent = IDEAS_DRAW[Math.floor(Math.random()*IDEAS_DRAW.length)];
  document.getElementById('storyChips').innerHTML = STORY_WORDS.map(w =>
    `<span class="chip" onclick="this.classList.toggle('selected');addWord('${w}')">${w}</span>`
  ).join('');
}
function addWord(w) {
  const inp = document.getElementById('storyWords');
  if (!inp.value.includes(w)) inp.value = (inp.value ? inp.value + '، ' : '') + w;
}
function doSuggest() {
  showPage('art');
  document.getElementById('paintIdea').textContent = '💡 ایده: ' + document.getElementById('suggestText').textContent;
}

async function callAPI(messages, systemExtra) {
  if (!state.apiKey) {
    toast('کلید API را در تنظیمات والد وارد کن');
    showPage('parent');
    return null;
  }
  const sys = 'تو یک دستیار مهربان، شاد و مناسب کودک ۷ ساله هستی. همیشه به فارسی ساده، کوتاه و کودکانه پاسخ بده. از محتوای نامناسب، ترسناک یا پیچیده پرهیز کن. نام کودک محیا است.' + (systemExtra || '');
  const body = {
    model: state.apiModel || 'grok-4.5',
    messages: [{role:'system', content: sys}, ...messages],
    max_tokens: state.maxTokens || 600,
    temperature: 0.8
  };
  try {
    const res = await fetch((state.apiBase || 'https://www.cleanapis.com/v1') + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + state.apiKey
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const errText = await res.text().catch(()=>'');
      throw new Error('خطای HTTP ' + res.status + (errText ? ': ' + errText.slice(0,120) : ''));
    }
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || 'پاسخی دریافت نشد.';
    return text;
  } catch (e) {
    console.error(e);
    toast('خطا در اتصال به API');
    return '⚠️ ' + (e.message || 'خطای شبکه یا CORS. اگر CORS مانع شد، از سرور محلی یا پروکسی استفاده کنید.');
  }
}

async function testApi() {
  const key = document.getElementById('apiKey').value.trim();
  const base = document.getElementById('apiBase').value.trim();
  const model = document.getElementById('apiModel').value;
  state.apiKey = key || null;
  state.apiBase = base;
  state.apiModel = model;
  state.maxTokens = parseInt(document.getElementById('maxTokens').value) || 600;
  document.getElementById('apiStatus').textContent = 'در حال تست...';
  const r = await callAPI([{role:'user', content:'سلام، فقط بگو «سلام محیا جان!»'}]);
  document.getElementById('apiStatus').innerHTML = r ? '<span class="success">✅ اتصال موفق</span><br>' + r : '<span class="error">❌ ناموفق</span>';
}
async function fetchModels() {
  if (!state.apiKey) { state.apiKey = document.getElementById('apiKey').value.trim() || null; }
  if (!state.apiKey) { toast('کلید را وارد کن'); return; }
  state.apiBase = document.getElementById('apiBase').value.trim();
  try {
    const res = await fetch(state.apiBase + '/models', {
      headers: { 'Authorization': 'Bearer ' + state.apiKey }
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const list = data.data || data.models || [];
    const sel = document.getElementById('apiModel');
    if (list.length) {
      sel.innerHTML = list.map(m => {
        const id = m.id || m.name || m;
        return `<option value="${id}">${id}</option>`;
      }).join('');
      document.getElementById('apiStatus').innerHTML = '<span class="success">✅ ' + list.length + ' مدل دریافت شد</span>';
    } else {
      document.getElementById('apiStatus').textContent = 'لیست مدل خالی بود.';
    }
  } catch(e) {
    document.getElementById('apiStatus').innerHTML = '<span class="error">❌ ' + e.message + '</span>';
  }
}
function unlockParent() {
  if (document.getElementById('parentPin').value === '1234') {
    document.getElementById('parentLock').classList.add('hidden');
    document.getElementById('parentPanel').classList.remove('hidden');
  } else toast('کد اشتباه است');
}
function clearAllData() {
  if (confirm('همه داده‌های محلی محیا پاک شود؟')) {
    localStorage.removeItem('mahya_v1');
    state.stars = 0; state.paintings = []; state.stories = []; state.poems = [];
    state.ideas = []; state.dreams = []; state.schedule = JSON.parse(JSON.stringify(DEFAULT_SCHED));
    document.getElementById('starsCount').textContent = 0;
    toast('پاک شد');
  }
}

async function makeStory() {
  const words = document.getElementById('storyWords').value || 'خرگوش و رنگین‌کمان';
  const hero = document.getElementById('storyHero').value;
  const style = document.getElementById('storyStyle').value;
  const box = document.getElementById('storyResult');
  box.style.display = 'block';
  box.textContent = 'در حال ساخت قصه جادویی... ✨';
  const prompt = `یک داستان کوتاه کودکانه (${style}) برای کودک ۷ ساله بنویس. شخصیت اصلی: ${hero}. از این کلمات استفاده کن: ${words}. داستان شاد، ساده و با پایان خوش باشد. حدود ۱۵۰ کلمه.`;
  let text = await callAPI([{role:'user', content: prompt}]);
  if (!text || text.startsWith('⚠️')) {
    text = `یکی بود یکی نبود، ${hero} کوچولویی در جنگل زندگی می‌کرد. یک روز ${words.split('،')[0] || 'یک بادکنک'} پیدا کرد و با دوستانش به ماجراجویی رفت. آن‌ها با هم خندیدند، کمک کردند و در پایان به خانه برگشتند و خواب شیرینی کردند. پایان! 🌈`;
  }
  box.textContent = text;
  document.getElementById('storyChoices').style.display = 'flex';
  document.getElementById('storyChoices').innerHTML = `
    <button class="btn secondary" onclick="continueStory('غار')">وارد غار شود</button>
    <button class="btn secondary" onclick="continueStory('پل رنگین‌کمان')">از پل رنگین‌کمان عبور کند</button>`;
  addStars(1);
}
async function continueStory(choice) {
  const box = document.getElementById('storyResult');
  const prev = box.textContent;
  box.textContent = prev + '\n\nدر حال ادامه...';
  const text = await callAPI([
    {role:'user', content: 'داستان قبلی:\n' + prev + '\n\nکودک انتخاب کرد: ' + choice + '. ادامه کوتاه و شاد داستان را بنویس (حدود ۸۰ کلمه).'}
  ]);
  box.textContent = prev + '\n\n' + (text || 'و آن‌ها با خوشحالی به ماجرا ادامه دادند!');
}
function saveToTreasure(type) {
  const text = type === 'story' ? document.getElementById('storyResult').innerText : document.getElementById('poemResult').innerText;
  if (!text || text.includes('در حال')) { toast('اول محتوا بساز'); return; }
  if (type === 'story') { state.stories.push({text, date: new Date().toLocaleDateString('fa-IR')}); }
  else { state.poems.push({text, date: new Date().toLocaleDateString('fa-IR')}); }
  saveState();
  addStars(1);
  toast('در گنجینه ذخیره شد!');
}

function startMathQuiz() {
  const a = Math.floor(Math.random()*9)+1, b = Math.floor(Math.random()*9)+1;
  const op = Math.random() > 0.5 ? '+' : '-';
  let ans, q;
  if (op === '+') { ans = a+b; q = `${a} + ${b} = ؟`; }
  else { const x = Math.max(a,b), y = Math.min(a,b); ans = x-y; q = `${x} − ${y} = ؟`; }
  const opts = shuffle([ans, ans+1, Math.max(0,ans-1), ans+2]).slice(0,4);
  renderQuiz(q, opts, ans, 'آفرین! درست گفتی 🌟');
}
function startLetterQuiz() {
  const letters = ['آ','ب','پ','ت','ث','ج','چ','ح','خ','د','ر','ز','س','ش','ع','ف','ق','ک','گ','ل','م','ن','و','ه','ی'];
  const L = letters[Math.floor(Math.random()*letters.length)];
  const opts = shuffle([L, ...shuffle(letters.filter(x=>x!==L)).slice(0,3)]);
  renderQuiz('کدام حرف «' + L + '» است؟', opts, L, 'عالی!');
}
function startCountQuiz() {
  const n = Math.floor(Math.random()*8)+3;
  const em = '⭐'.repeat(n);
  const opts = shuffle([n, n+1, n-1, n+2]).map(String);
  renderQuiz('چند ستاره می‌بینی؟\n' + em, opts, String(n), 'درست شمردی!');
}
function startShapeQuiz() {
  const shapes = [{n:'دایره',e:'⚪'},{n:'مربع',e:'⬛'},{n:'مثلث',e:'🔺'},{n:'ستاره',e:'⭐'}];
  const s = shapes[Math.floor(Math.random()*shapes.length)];
  const opts = shuffle(shapes.map(x=>x.n));
  renderQuiz(s.e + '\nاین چه شکلی است؟', opts, s.n, 'آفرین!');
}
function renderQuiz(q, opts, ans, okMsg) {
  const area = document.getElementById('quizArea');
  area.innerHTML = `<div class="msg ai" style="font-size:1.2rem;text-align:center;white-space:pre-line">${q}</div>` +
    opts.map(o => `<button class="quiz-opt" onclick="checkQuiz(this,'${o}','${ans}','${okMsg}')">${o}</button>`).join('');
}
function checkQuiz(el, chosen, ans, okMsg) {
  document.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
  if (String(chosen) === String(ans)) {
    el.classList.add('correct');
    toast(okMsg);
    addStars(1);
  } else {
    el.classList.add('wrong');
    toast('اشکالی نداره! دوباره تلاش کن 💪');
    document.querySelectorAll('.quiz-opt').forEach(b => { if (b.textContent === String(ans)) b.classList.add('correct'); });
  }
}
function shuffle(a) { return a.sort(() => Math.random()-0.5); }

let canvas, ctx, painting = false, color = '#e91e8c', brush = 8, paths = [], currentPath = [];
function initCanvas() {
  canvas = document.getElementById('paintCanvas');
  if (!canvas) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = 320 * 2;
  ctx = canvas.getContext('2d');
  ctx.scale(2,2);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  canvas.onpointerdown = startPaint;
  canvas.onpointermove = movePaint;
  canvas.onpointerup = endPaint;
  canvas.onpointerleave = endPaint;
}
function setColor(el) {
  document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  color = el.dataset.c;
}
function startPaint(e) {
  painting = true;
  currentPath = [];
  const p = pos(e);
  currentPath.push({x:p.x,y:p.y,c:color,s:+document.getElementById('brushSize').value});
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
}
function movePaint(e) {
  if (!painting) return;
  const p = pos(e);
  brush = +document.getElementById('brushSize').value;
  currentPath.push({x:p.x,y:p.y,c:color,s:brush});
  ctx.strokeStyle = color;
  ctx.lineWidth = brush;
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
}
function endPaint() {
  if (painting && currentPath.length) paths.push(currentPath);
  painting = false;
}
function pos(e) {
  const r = canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left), y: (e.clientY - r.top) };
}
function clearCanvas() {
  if (!confirm('بوم پاک شود؟')) return;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  paths = [];
}
function undoPaint() {
  paths.pop();
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  paths.forEach(path => {
    if (!path.length) return;
    ctx.beginPath();
    ctx.strokeStyle = path[0].c;
    ctx.lineWidth = path[0].s;
    ctx.moveTo(path[0].x, path[0].y);
    path.forEach(p => { ctx.lineTo(p.x, p.y); });
    ctx.stroke();
  });
}
function savePainting() {
  const data = canvas.toDataURL('image/png');
  state.paintings.unshift({data, date: new Date().toLocaleDateString('fa-IR'), title: 'نقاشی ' + (state.paintings.length+1)});
  if (state.paintings.length > 20) state.paintings.pop();
  saveState();
  renderArtGallery();
  addStars(2);
  toast('نقاشی ذخیره شد!');
}
function downloadPainting() {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'mahya-art.png';
  a.click();
}
function loadIdea() {
  const idea = IDEAS_DRAW[Math.floor(Math.random()*IDEAS_DRAW.length)];
  document.getElementById('paintIdea').textContent = '💡 ایده: ' + idea;
}
function renderArtGallery() {
  const g = document.getElementById('artGallery');
  if (!state.paintings.length) { g.innerHTML = '<p class="status">هنوز نقاشی نداری</p>'; return; }
  g.innerHTML = state.paintings.map((p,i) =>
    `<div class="gallery-item"><img src="${p.data}" alt=""><div class="cap">${p.title}<br><button class="btn secondary" style="padding:2px 8px;font-size:0.75rem" onclick="delPaint(${i})">حذف</button></div></div>`
  ).join('');
}
function delPaint(i) { state.paintings.splice(i,1); saveState(); renderArtGallery(); }

