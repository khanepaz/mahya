
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
