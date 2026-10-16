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
