/* ========== ANIMALS ========== */
function showAnimals() {
  document.getElementById('animalsArea').innerHTML = ANIMALS.map(a =>
    `<div class="animal-card" onclick="showAnimalDetail('${a.n}')"><div class="em">${a.e}</div><div><strong>${a.n}</strong><br><small>${a.h}</small></div></div>`
  ).join('');
}
function showAnimalDetail(name) {
  const a = ANIMALS.find(x => x.n === name);
  if (!a) return;
  document.getElementById('animalsArea').innerHTML = `
    <div class="panel" style="text-align:center">
      <div style="font-size:4rem">${a.e}</div>
      <h2>${a.n}</h2>
      <p>خانه: ${a.h}</p><p>غذا: ${a.f}</p><p>${a.fact}</p>
      <button class="btn" onclick="animalStory('${a.n}')">📖 داستان بساز</button>
      <button class="btn secondary" onclick="showAnimals()">بازگشت</button>
    </div>`;
}
async function animalStory(name) {
  const box = document.getElementById('animalsArea');
  box.innerHTML = '<div class="msg ai">در حال ساخت داستان...</div>';
  let text = await callAPI([{role:'user', content:`یک داستان کوتاه کودکانه درباره ${name} برای کودک ۷ ساله بنویس (حدود ۱۰۰ کلمه).`}]);
  if (!text || text.startsWith('⚠️')) text = `یک روز ${name} کوچولو در جنگل بازی می‌کرد و با دوستانش ماجراجویی شادی داشت!`;
  box.innerHTML = `<div class="msg ai">${text}</div><button class="btn secondary" onclick="showAnimals()">بازگشت</button>`;
  addStars(1);
}
function guessAnimal() {
  const a = ANIMALS[Math.floor(Math.random()*ANIMALS.length)];
  const hints = [`غذایش ${a.f} است.`, `در ${a.h} زندگی می‌کند.`, a.fact];
  let hi = 0;
  const area = document.getElementById('animalsArea');
  function render() {
    area.innerHTML = `<div class="panel"><p class="msg ai">سرنخ ${hi+1}: ${hints[hi]}</p>
      <input class="input" id="guessInp" placeholder="حدس بزن...">
      <div class="btn-row"><button class="btn" onclick="checkGuess()">حدس بزن</button>
      <button class="btn secondary" onclick="nextHint()">سرنخ بعدی</button></div>
      <div id="guessRes"></div></div>`;
  }
  window.checkGuess = () => {
    const g = document.getElementById('guessInp').value.trim();
    if (g === a.n || g.includes(a.n)) {
      document.getElementById('guessRes').innerHTML = `<div class="success">آفرین! ${a.e} ${a.n} بود!</div>`;
      addStars(2);
    } else document.getElementById('guessRes').innerHTML = `<div class="error">نه، دوباره فکر کن 💭</div>`;
  };
  window.nextHint = () => { if (hi < hints.length-1) { hi++; render(); } else toast('سرنخ دیگری نیست'); };
  render();
}
function buildAnimal() {
  document.getElementById('animalsArea').innerHTML = `
    <div class="panel">
      <label class="label">بدن:</label><select class="select" id="bBody"><option>خرگوش</option><option>گربه</option><option>پرنده</option><option>ماهی</option></select>
      <label class="label">بال / ویژگی:</label><select class="select" id="bWing"><option>بال رنگین‌کمان</option><option>شاخ تک‌شاخ</option><option>دم ستاره‌ای</option><option>گوش‌های بلند</option></select>
      <label class="label">رنگ:</label><select class="select" id="bColor"><option>صورتی</option><option>آبی آسمانی</option><option>سبز نعنایی</option><option>بنفش</option></select>
      <button class="btn" onclick="finishAnimal()">✨ بساز</button>
      <div id="customAnimal"></div>
    </div>`;
}
function finishAnimal() {
  const body = document.getElementById('bBody').value;
  const wing = document.getElementById('bWing').value;
  const col = document.getElementById('bColor').value;
  document.getElementById('customAnimal').innerHTML = `<div class="msg ai" style="text-align:center;font-size:1.1rem">
    🦄 حیوان خیالی تو:<br><strong>${body} ${col} با ${wing}</strong><br>چه موجود قشنگی ساختی!</div>`;
  addStars(1);
}

function ifYouWere() {
  const q = IF_YOU[Math.floor(Math.random()*IF_YOU.length)];
  document.getElementById('createArea').innerHTML = `<div class="msg ai">${q}</div>
    <textarea class="textarea" id="ifAns" placeholder="جوابت را بنویس..."></textarea>
    <button class="btn" onclick="saveIfAns()">💾 ذخیره</button>`;
}
function saveIfAns() {
  const t = document.getElementById('ifAns').value.trim();
  if (!t) return;
  state.ideas.push({text: t, date: new Date().toLocaleDateString('fa-IR')});
  saveState(); addStars(1); toast('ذخیره شد!'); renderIdeas();
}
function inventSomething() {
  document.getElementById('createArea').innerHTML = `
    <label class="label">چیزی اختراع کن:</label>
    <div class="chip" onclick="pickInv(this)">چتر پرنده</div>
    <div class="chip" onclick="pickInv(this)">کیف رباتیک</div>
    <div class="chip" onclick="pickInv(this)">دستگاه تبدیل زباله به گل</div>
    <div class="chip" onclick="pickInv(this)">ماشین نقاشی خودکار</div>
    <textarea class="textarea" id="invDesc" placeholder="توضیح بده چطور کار می‌کند..."></textarea>
    <button class="btn" onclick="saveInv()">💾 ذخیره اختراع</button>`;
}
function pickInv(el) { document.getElementById('invDesc').value = el.textContent + ': '; }
function saveInv() {
  const t = document.getElementById('invDesc').value.trim();
  if (!t) return;
  state.ideas.push({text: t, date: new Date().toLocaleDateString('fa-IR')});
  saveState(); addStars(1); toast('چه اختراع باحالی!'); renderIdeas();
}
async function unfinishedStory() {
  document.getElementById('createArea').innerHTML = '<div class="msg ai">در حال آماده‌سازی...</div>';
  let text = await callAPI([{role:'user', content:'یک داستان ناتمام کوتاه برای کودک ۷ ساله شروع کن و در نقطه هیجان‌انگیز قطع کن تا کودک ادامه دهد. حدود ۶۰ کلمه.'}]);
  if (!text || text.startsWith('⚠️')) text = 'خرگوش کوچولو به لبه جنگل رسید و ناگهان یک درِ درخشان دید که به...';
  document.getElementById('createArea').innerHTML = `<div class="msg ai">${text}</div>
    <textarea class="textarea" id="contStory" placeholder="ادامه داستان را بنویس..."></textarea>
    <button class="btn" onclick="saveCont()">💾 ذخیره ادامه</button>`;
}
function saveCont() {
  const t = document.getElementById('contStory').value.trim();
  if (!t) return;
  state.ideas.push({text: 'ادامه داستان: ' + t, date: new Date().toLocaleDateString('fa-IR')});
  saveState(); addStars(1); toast('ذخیره شد!');
}
function saveIdea() {
  const t = document.getElementById('ideaBox').value.trim();
  if (!t) return;
  state.ideas.push({text: t, date: new Date().toLocaleDateString('fa-IR')});
  document.getElementById('ideaBox').value = '';
  saveState(); addStars(1); renderIdeas();
}
function renderIdeas() {
  const el = document.getElementById('ideasList');
  if (!el) return;
  el.innerHTML = state.ideas.slice().reverse().map(i => `<div class="msg user">${i.text}<br><small>${i.date}</small></div>`).join('') || '<p class="status">هنوز ایده‌ای نیست</p>';
}

async function askHomework(extra) {
  const q = document.getElementById('hwQuestion').value.trim();
  if (!q && !extra) { toast('سؤال را بنویس'); return; }
  const chat = document.getElementById('hwChat');
  const userMsg = (extra ? extra + ' — ' : '') + q;
  chat.innerHTML += `<div class="msg user">${userMsg}</div><div class="msg ai" id="hwWait">در حال فکر کردن...</div>`;
  const prompt = extra
    ? `سؤال کودک: ${q}\nدرخواست: ${extra}. به زبان خیلی ساده برای کلاس اول توضیح بده.`
    : `سؤال کودک کلاس اول: ${q}\nابتدا یک راهنمایی کوتاه بده، بعد توضیح مرحله‌به‌مرحله. جواب نهایی را فوری نگو.`;
  const text = await callAPI([{role:'user', content: prompt}]);
  const wait = document.getElementById('hwWait');
  if (wait) wait.textContent = text || 'نتوانستم پاسخ بدهم. کلید API را بررسی کن.';
  addStars(1);
}

async function makePoem() {
  const topic = document.getElementById('poemTopic').value;
  const type = document.getElementById('poemType').value;
  const box = document.getElementById('poemResult');
  box.style.display = 'block';
  box.textContent = 'در حال ساخت... ✨';
  let text = await callAPI([{role:'user', content:`یک ${type} کودکانه درباره «${topic}» برای کودک ۷ ساله بنویس. شاد، ساده و کوتاه.`}]);
  if (!text || text.startsWith('⚠️')) {
    text = type.includes('شعر')
      ? `ستاره‌ها تو آسمون\nمثل الماس می‌درخشن\nمحیا جون با رؤیاشون\nمی‌خواد دنیا رو رنگین کنه 🌟`
      : `یکی بود یکی نبود، در یک جنگل رنگی، دوستان کوچولو دور هم جمع شدند و قصه گفتند تا خوابشان برد... شب بخیر محیا جان 🌙`;
  }
  box.textContent = text;
  addStars(1);
}

function renderSchedule() {
  const list = document.getElementById('schedList');
  const done = state.schedule.filter(s => s.done).length;
  const total = state.schedule.length;
  document.getElementById('schedProgress').style.width = (total ? (done/total*100) : 0) + '%';
  document.getElementById('schedStatus').textContent = `${done} از ${total} انجام شده`;
  list.innerHTML = state.schedule.map((s,i) =>
    `<div class="sched-item ${s.done?'done':''}">
      <input type="checkbox" ${s.done?'checked':''} onchange="toggleSched(${i})">
      <span>${s.icon || '📌'} ${s.t}</span>
    </div>`
  ).join('');
}
function toggleSched(i) {
  state.schedule[i].done = !state.schedule[i].done;
  if (state.schedule[i].done) addStars(1);
  saveState();
  renderSchedule();
}
function addActivity() {
  const t = document.getElementById('newActivity').value.trim();
  if (!t) return;
  state.schedule.push({t, done:false, icon:'✨'});
  document.getElementById('newActivity').value = '';
  saveState();
  renderSchedule();
}
function resetSchedule() {
  state.schedule = JSON.parse(JSON.stringify(DEFAULT_SCHED));
  saveState();
  renderSchedule();
  toast('برنامه بازنشانی شد');
}

function renderRecipes() {
  document.getElementById('recipeDetail').classList.add('hidden');
  document.getElementById('recipesList').innerHTML = RECIPES.map((r,i) =>
    `<div class="animal-card" onclick="showRecipe(${i})"><div class="em">${r.e}</div><div><strong>${r.n}</strong></div></div>`
  ).join('');
}
function showRecipe(i) {
  const r = RECIPES[i];
  document.getElementById('recipesList').innerHTML = '';
  const d = document.getElementById('recipeDetail');
  d.classList.remove('hidden');
  d.innerHTML = `<h3>${r.e} ${r.n}</h3>
    ${r.warn ? `<p class="error">${r.warn}</p>` : ''}
    <strong>مواد:</strong><ul>${r.mat.map(m=>'<li>'+m+'</li>').join('')}</ul>
    <strong>مراحل:</strong><ol>${r.steps.map(s=>'<li>'+s+'</li>').join('')}</ol>
    <div class="btn-row"><button class="btn" onclick="startTimer(60)">⏱️ تایمر ۱ دقیقه</button>
    <button class="btn secondary" onclick="renderRecipes()">بازگشت</button></div>
    <div id="timerDisp"></div>`;
}
let timerId = null;
function startTimer(sec) {
  clearInterval(timerId);
  let s = sec;
  const el = document.getElementById('timerDisp');
  timerId = setInterval(() => {
    el.textContent = '⏳ ' + s + ' ثانیه';
    if (s-- <= 0) { clearInterval(timerId); el.textContent = '✅ تمام شد!'; toast('تایمر تمام شد!'); }
  }, 1000);
}
function renderCrafts() {
  document.getElementById('craftDetail').classList.add('hidden');
  document.getElementById('craftsList').innerHTML = CRAFTS.map((c,i) =>
    `<div class="animal-card" onclick="showCraft(${i})"><div class="em">${c.e}</div><div><strong>${c.n}</strong></div></div>`
  ).join('');
}
function showCraft(i) {
  const c = CRAFTS[i];
  document.getElementById('craftsList').innerHTML = '';
  const d = document.getElementById('craftDetail');
  d.classList.remove('hidden');
  d.innerHTML = `<h3>${c.e} ${c.n}</h3>
    ${c.warn ? `<p class="error">${c.warn}</p>` : ''}
    <strong>وسایل:</strong><ul>${c.mat.map(m=>'<li>'+m+'</li>').join('')}</ul>
    <strong>مراحل:</strong><ol>${c.steps.map(s=>'<li>'+s+'</li>').join('')}</ol>
    <button class="btn secondary" onclick="renderCrafts()">بازگشت</button>`;
}

function startMemory() {
  const emojis = ['🐰','🐱','🦋','🌟','🌸','🎈','🦄','🌈'];
  const cards = shuffle([...emojis, ...emojis]);
  let flipped = [], lock = false, matched = 0;
  const area = document.getElementById('gameArea');
  area.innerHTML = `<p class="status">جفت‌ها را پیدا کن!</p><div class="game-board memory-grid" id="memBoard"></div>`;
  const board = document.getElementById('memBoard');
  cards.forEach((e,i) => {
    const div = document.createElement('div');
    div.className = 'mem-card';
    div.dataset.e = e;
    div.dataset.i = i;
    div.onclick = () => {
      if (lock || div.classList.contains('flipped') || div.classList.contains('matched')) return;
      div.classList.add('flipped');
      div.textContent = e;
      flipped.push(div);
      if (flipped.length === 2) {
        lock = true;
        if (flipped[0].dataset.e === flipped[1].dataset.e) {
          flipped.forEach(c => c.classList.add('matched'));
          matched++;
          addStars(1);
          if (matched === emojis.length) toast('آفرین! همه را پیدا کردی 🎉');
          flipped = []; lock = false;
        } else {
          setTimeout(() => {
            flipped.forEach(c => { c.classList.remove('flipped'); c.textContent = ''; });
            flipped = []; lock = false;
          }, 700);
        }
      }
    };
    board.appendChild(div);
  });
}
function startPattern() {
  const seq = [2,4,6,8];
  const ans = 10;
  document.getElementById('gameArea').innerHTML = `
    <div class="msg ai">الگو را کامل کن: ${seq.join(' ، ')} ، ؟</div>
    <div class="btn-row">${[10,9,12,7].map(n=>`<button class="quiz-opt" onclick="checkPat(this,${n},${ans})">${n}</button>`).join('')}</div>`;
}
function checkPat(el, n, ans) {
  document.querySelectorAll('.quiz-opt').forEach(b=>b.disabled=true);
  if (n === ans) { el.classList.add('correct'); addStars(1); toast('درست!'); }
  else { el.classList.add('wrong'); toast('دوباره فکر کن'); }
}
function startOddOne() {
  const items = ['⭐','⭐','⭐','🌸'];
  document.getElementById('gameArea').innerHTML = `
    <div class="msg ai">کدام یکی فرق دارد؟</div>
    <div class="btn-row" style="justify-content:center;font-size:2rem">
      ${items.map((e,i)=>`<button class="quiz-opt" style="width:auto;font-size:2rem;padding:16px" onclick="checkOdd(this,${i})">${e}</button>`).join('')}
    </div>`;
}
function checkOdd(el, i) {
  document.querySelectorAll('.quiz-opt').forEach(b=>b.disabled=true);
  if (i === 3) { el.classList.add('correct'); addStars(1); toast('آفرین!'); }
  else { el.classList.add('wrong'); toast('نه، اون یکی!'); }
}
function startWordGuess() {
  const words = [{w:'گل',h:'زیبا و خوشبو در باغ'},{w:'ماه',h:'شب در آسمان می‌درخشد'},{w:'کتاب',h:'باهاش درس می‌خوانیم'}];
  const item = words[Math.floor(Math.random()*words.length)];
  document.getElementById('gameArea').innerHTML = `
    <div class="msg ai">سرنخ: ${item.h}</div>
    <input class="input" id="wordG" placeholder="کلمه چیست؟">
    <button class="btn" onclick="(function(){if(document.getElementById('wordG').value.trim()==='${item.w}'){toast('درست!');addStars(1)}else toast('دوباره!')})()">حدس بزن</button>`;
}

function saveDream() {
  const t = document.getElementById('dreamText').value.trim();
  if (!t) return;
  state.dreams.push({text: t, date: new Date().toLocaleDateString('fa-IR')});
  document.getElementById('dreamText').value = '';
  saveState(); addStars(1); renderDreams(); toast('آرزو ذخیره شد 💫');
}
function renderDreams() {
  const el = document.getElementById('dreamsList');
  el.innerHTML = state.dreams.slice().reverse().map(d => `<div class="msg user">💭 ${d.text}<br><small>${d.date}</small></div>`).join('') || '<p class="status">هنوز آرزویی نوشته نشده</p>';
}
async function dreamStory() {
  const t = document.getElementById('dreamText').value.trim() || (state.dreams[0] && state.dreams[0].text);
  if (!t) { toast('اول آرزو بنویس'); return; }
  const box = document.getElementById('planetResult');
  box.style.display = 'block';
  box.textContent = 'در حال ساخت داستان...';
  let text = await callAPI([{role:'user', content:`یک داستان کوتاه خیالی و شاد درباره این آرزوی کودک بنویس: «${t}». حدود ۱۰۰ کلمه.`}]);
  box.textContent = text || 'محیا با آرزویش به سرزمین رؤیاها سفر کرد و ماجراهای قشنگی ساخت!';
  addStars(1);
}
async function describePlanet() {
  const col = document.getElementById('planetColor').value;
  const thing = document.getElementById('planetThing').value;
  const box = document.getElementById('planetResult');
  box.style.display = 'block';
  box.textContent = 'در حال توصیف سیاره...';
  let text = await callAPI([{role:'user', content:`سیاره شخصی یک کودک را توصیف کن: رنگ ${col}، ویژگی اصلی: ${thing}. شاد، خیالی و کوتاه (۸۰ کلمه).`}]);
  box.textContent = text || `سیاره ${col} محیا پر از ${thing} است و ستاره‌ها برایش آواز می‌خوانند! 🪐`;
  addStars(1);
}

function renderTreasure() {
  let html = '';
  if (state.paintings.length) {
    html += '<h3>🎨 نقاشی‌ها</h3><div class="gallery-grid">' + state.paintings.map(p =>
      `<div class="gallery-item"><img src="${p.data}"><div class="cap">${p.date}</div></div>`).join('') + '</div>';
  }
  if (state.stories.length) {
    html += '<h3>📖 داستان‌ها</h3>' + state.stories.map(s => `<div class="msg ai">${s.text.slice(0,120)}...<br><small>${s.date}</small></div>`).join('');
  }
  if (state.poems.length) {
    html += '<h3>🎵 شعر و قصه</h3>' + state.poems.map(s => `<div class="msg ai">${s.text.slice(0,120)}...<br><small>${s.date}</small></div>`).join('');
  }
  if (state.ideas.length) {
    html += '<h3>💡 ایده‌ها</h3>' + state.ideas.map(s => `<div class="msg user">${s.text}<br><small>${s.date}</small></div>`).join('');
  }
  if (state.dreams.length) {
    html += '<h3>🌙 آرزوها</h3>' + state.dreams.map(s => `<div class="msg user">💭 ${s.text}<br><small>${s.date}</small></div>`).join('');
  }
  document.getElementById('treasureArea').innerHTML = html || '<p class="status">گنجینه‌ات هنوز خالی است. نقاشی بکش یا قصه بساز!</p>';
}
function renderAvatarChoices() {
  const opts = ['🐰','🐱','🦄','🧚','👧','🌟','🌸','🦋','🐶','🐯'];
  document.getElementById('avatarChoices').innerHTML = opts.map(e =>
    `<span class="chip" style="font-size:1.8rem;padding:8px 12px" onclick="document.getElementById('avatarPreview').textContent='${e}'">${e}</span>`
  ).join('');
  document.getElementById('avatarPreview').textContent = state.avatar;
}
function saveAvatar() {
  state.avatar = document.getElementById('avatarPreview').textContent;
  document.getElementById('avatarBtn').textContent = state.avatar;
  saveState();
  toast('آواتار ذخیره شد!');
}

function startSpeech(inputId) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { toast('مرورگر از تشخیص گفتار پشتیبانی نمی‌کند'); return; }
  const rec = new SR();
  rec.lang = 'fa-IR';
  rec.onresult = e => {
    document.getElementById(inputId).value = e.results[0][0].transcript;
  };
  rec.onerror = () => toast('خطا در تشخیص گفتار');
  rec.start();
  toast('گوش می‌دهم... 🎤');
}
function speakText(text) {
  if (!text || !window.speechSynthesis) { toast('متن یا پشتیبانی صدا موجود نیست'); return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fa-IR';
  u.rate = 0.9;
  speechSynthesis.speak(u);
}
function stopSpeak() { speechSynthesis.cancel(); }

/* ========== BOOT ========== */
loadState();
initHome();
initCanvas();
