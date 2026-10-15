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
    b.onclick = function() { if (c===ans) { addStars(2); alert('درست!'); startPatternGame(); } else alert('دوباره'); };
    opts.appendChild(b);
  });
}
function startOddOneOut() {
  document.getElementById('gameArea').classList.remove('hidden');
  document.getElementById('gameTitle').textContent = '🔍 متفاوت';
  const items = [{set:['🔴','🔴','🔵','🔴'],odd:2},{set:['🐱','🐱','🐶','🐱'],odd:2},{set:['⭐','🌟','⭐','⭐'],odd:1}];
  const g = items[Math.floor(Math.random()*items.length)];
  document.getElementById('gameContent').innerHTML = '<div style="display:flex;justify-content:center;gap:12px;font-size:2.5rem;margin:20px 0" id="oddItems"></div>';
  const box = document.getElementById('oddItems');
  g.set.forEach(function(e,i) {
    const s = document.createElement('span'); s.textContent = e; s.style.cursor = 'pointer'; s.style.padding = '8px';
    s.onclick = function() { if (i===g.odd) { addStars(2); alert('آفرین!'); startOddOneOut(); } else s.style.background='#fdeaea'; };
    box.appendChild(s);
  });
}
function startWordGuess() {
  document.getElementById('gameArea').classList.remove('hidden');
  document.getElementById('gameTitle').textContent = '🔤 کلمه';
  const words = [{w:'گربه',clue:'میو میو می‌کند'},{w:'ستاره',clue:'در آسمان می‌درخشد'},{w:'ماه',clue:'شب‌ها گرد است'}];
  const item = words[Math.floor(Math.random()*words.length)];
  document.getElementById('gameContent').innerHTML = '<p>سرنخ: '+item.clue+'</p><input type="text" id="wordGuessIn"><button class="btn btn-sm" onclick="checkWordGuess(\''+item.w+'\')">بررسی</button><p id="wordFb"></p>';
}
function checkWordGuess(ans) {
  const g = document.getElementById('wordGuessIn').value.trim();
  if (g===ans) { document.getElementById('wordFb').innerHTML='<span class="msg msg-success">آفرین!</span>'; addStars(2); }
  else document.getElementById('wordFb').innerHTML='<span class="msg msg-info">نزدیک بود</span>';
}
function startMathQuiz() {
  document.getElementById('gameArea').classList.remove('hidden');
  document.getElementById('gameTitle').textContent = '➕ جمع';
  const a = Math.floor(Math.random()*5)+1, b = Math.floor(Math.random()*5)+1;
  document.getElementById('gameContent').innerHTML = '<p style="font-size:1.5rem;text-align:center">'+'🍎'.repeat(a)+' + '+'🍎'.repeat(b)+' = ؟</p><div id="mathOpts"></div>';
  const ans = a+b;
  shuffle([ans,ans+1,ans-1,ans+2].filter(function(v){return v>0;})).forEach(function(c) {
    const btn = document.createElement('button'); btn.className='choice-btn'; btn.textContent=c;
    btn.onclick = function(){ if(c===ans){addStars(1);alert('درست!');startMathQuiz();}else alert('دوباره'); };
    document.getElementById('mathOpts').appendChild(btn);
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
  if (filter==='all'||filter==='story') items=items.concat(state.stories.map(function(s){return Object.assign({},s,{kind:'story'});}));
  if (filter==='all'||filter==='paint') items=items.concat(state.paintings.map(function(p){return Object.assign({},p,{kind:'paint'});}));
  if (filter==='all'||filter==='idea') items=items.concat(state.ideas.map(function(i){return Object.assign({},i,{kind:'idea'});}));
  if (filter==='all'||filter==='dream') items=items.concat(state.dreams.map(function(d){return Object.assign({},d,{kind:'dream'});}));
  items.sort(function(a,b){return b.date-a.date;});
  const el = document.getElementById('treasureList'); if (!el) return;
  if (!items.length) { el.innerHTML='<p style="color:#999">خالی</p>'; return; }
  el.innerHTML = items.map(function(it){
    if (it.kind==='paint') return '<div class="gallery-item" style="margin-bottom:10px"><img src="'+it.data+'"><div class="cap">'+it.title+'</div></div>';
    var icon = it.kind==='idea'?'💡':(it.kind==='dream'?'🌙':'📖');
    return '<div style="background:#fdf8ff;padding:12px;border-radius:12px;margin:8px 0"><strong>'+icon+' '+escapeHtml(it.title||'')+'</strong><p style="white-space:pre-wrap">'+escapeHtml((it.content||'').slice(0,200))+'</p></div>';
  }).join('');
}
function filterTreasure(f){ renderTreasure(f); }

function openParentSettings() {
  showScreen('parent');
  document.getElementById('parentLock').classList.remove('hidden');
  document.getElementById('parentPanel').classList.add('hidden');
  document.getElementById('parentPin').value = '';
}
function checkParentPin() {
  const pin = document.getElementById('parentPin').value;
  if (pin === (localStorage.getItem('mahya_pin')||'1234')) {
    document.getElementById('parentLock').classList.add('hidden');
    document.getElementById('parentPanel').classList.remove('hidden');
    document.getElementById('apiBase').value = state.apiBase;
    document.getElementById('apiModel').value = state.apiModel;
    if (state.apiKey) {
      document.getElementById('apiKey').value = state.apiKey;
      document.getElementById('apiStatus').className='msg msg-success';
      document.getElementById('apiStatus').textContent='کلید موجود '+(state.apiEnabled?'(فعال)':'(غیرفعال)');
    }
  } else alert('کد اشتباه');
}
function toggleKeyVisibility() {
  const inp = document.getElementById('apiKey');
  inp.type = inp.type==='password'?'text':'password';
}
async function fetchModels() {
  const key = document.getElementById('apiKey').value.trim();
  const base = document.getElementById('apiBase').value.replace(/\/$/,'');
  if (!key) { alert('کلید لازم'); return; }
  state.apiKey = key;
  try {
    const res = await fetch(base+'/models',{headers:{'Authorization':'Bearer '+key}});
    if (!res.ok) throw new Error('HTTP '+res.status);
    const data = await res.json();
    const models = data.data||data.models||data;
    const sel = document.getElementById('apiModel'); sel.innerHTML='';
    (Array.isArray(models)?models:[]).forEach(function(m){
      const id=m.id||m.name||m;
      const opt=document.createElement('option'); opt.value=id; opt.textContent=id; sel.appendChild(opt);
    });
    if (!sel.options.length) { const o=document.createElement('option'); o.value='grok-4.5'; o.textContent='grok-4.5'; sel.appendChild(o); }
    document.getElementById('apiStatus').className='msg msg-success';
    document.getElementById('apiStatus').textContent='مدل‌ها دریافت شد';
    state.apiEnabled = true;
  } catch(e) {
    document.getElementById('apiStatus').className='msg msg-error';
    document.getElementById('apiStatus').textContent='خطا: '+e.message;
  }
}
async function testConnection() {
  const key = document.getElementById('apiKey').value.trim();
  if (!key) { alert('کلید لازم'); return; }
  state.apiKey=key; state.apiBase=document.getElementById('apiBase').value.replace(/\/$/,'');
  state.apiModel=document.getElementById('apiModel').value; state.apiEnabled=true;
  document.getElementById('apiStatus').innerHTML='<span class="spinner"></span>';
  const res = await callAPI([{role:'user',content:'فقط بگو وصل شدم'}],{max_tokens:50});
  if (res.content) {
    document.getElementById('apiStatus').className='msg msg-success';
    document.getElementById('apiStatus').textContent='موفق! '+res.content.slice(0,40);
  } else {
    document.getElementById('apiStatus').className='msg msg-error';
    document.getElementById('apiStatus').textContent=res.error||'ناموفق';
    state.apiEnabled=false;
  }
}
function disableAPI() {
  state.apiEnabled=false; state.apiKey=null;
  document.getElementById('apiKey').value='';
  document.getElementById('apiStatus').className='msg msg-info';
  document.getElementById('apiStatus').textContent='API خاموش';
}
function clearAllData() {
  if (!confirm('حذف همه؟')) return;
  state.stories=[]; state.paintings=[]; state.ideas=[]; state.dreams=[]; state.planner=[];
  saveState(); updateTreasureSummary(); alert('پاک شد');
}
function resetStars(){ state.stars=0; updateStarsUI(); saveState(); }

function speakText(text) {
  if (!window.speechSynthesis) return;
  stopSpeak();
  const u=new SpeechSynthesisUtterance(text); u.lang='fa-IR'; u.rate=0.9;
  speechSynthesis.speak(u);
}
function stopSpeak(){ if(window.speechSynthesis) speechSynthesis.cancel(); }

function shuffle(arr) {
  const a=arr.slice();
  for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; }
  return a;
}
function escapeHtml(s) {
  return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
}
function showTempMsg(id,text,type) {
  const el=document.getElementById(id); if(!el) return;
  el.innerHTML='<div class="msg msg-'+type+'">'+text+'</div>';
  setTimeout(function(){el.innerHTML='';},5000);
}

async function sendAIChat() {
  const inp=document.getElementById('aiChatInput');
  const q=inp.value.trim(); if(!q) return;
  const chat=document.getElementById('aiChatArea');
  chat.innerHTML+='<div class="bubble bubble-user">'+escapeHtml(q)+'</div>';
  inp.value='';
  if (!state.apiKey||!state.apiEnabled) {
    chat.innerHTML+='<div class="bubble bubble-ai">اول کلید API را در تنظیمات والد وارد کن 🔑</div>'; return;
  }
  chat.innerHTML+='<div class="bubble bubble-ai"><span class="spinner"></span></div>';
  chat.scrollTop=chat.scrollHeight;
  const res=await callAPI([
    {role:'system',content:systemPrompt('دوست شاد و کوتاه‌جواب محیا باش.')},
    {role:'user',content:q}
  ]);
  chat.lastChild.innerHTML=escapeHtml(res.content||res.error||'خطا');
  chat.scrollTop=chat.scrollHeight;
  if (res.content) addStars(1);
}
function clearAIChat(){ document.getElementById('aiChatArea').innerHTML=''; }
function quickAI(text){ document.getElementById('aiChatInput').value=text; sendAIChat(); }

async function aiPaintStory() {
  const desc=document.getElementById('paintDescribe').value.trim()||'نقاشی جادویی';
  const el=document.getElementById('paintAIResult');
  el.classList.remove('hidden');
  if (!state.apiKey||!state.apiEnabled){ el.textContent='کلید API لازم است'; return; }
  el.textContent='...';
  const res=await callAPI([{role:'system',content:systemPrompt()},{role:'user',content:'داستان کوتاه درباره نقاشی: '+desc}]);
  el.textContent=res.content||res.error;
}
async function aiPaintIdeas() {
  const desc=document.getElementById('paintDescribe').value.trim()||'نقاشی';
  const el=document.getElementById('paintAIResult');
  el.classList.remove('hidden');
  if (!state.apiKey||!state.apiEnabled){ el.textContent='کلید API لازم است'; return; }
  el.textContent='...';
  const res=await callAPI([{role:'system',content:systemPrompt()},{role:'user',content:'۳ ایده کوتاه برای بهتر کردن این نقاشی: '+desc}]);
  el.textContent=res.content||res.error;
}
function aiPaintToReal() {
  const el=document.getElementById('paintAIResult');
  el.classList.remove('hidden'); el.className='msg msg-warn';
  el.textContent='تبدیل به تصویر واقعی نیاز به مدل Image Generation دارد. Clean API فعلی فقط متن می‌دهد. از «داستان از نقاشی» و «ایده» استفاده کن 🎨';
}
async function aiNewPaintIdea() {
  if (!state.apiKey||!state.apiEnabled){ alert('کلید API لازم است'); return; }
  const res=await callAPI([{role:'system',content:systemPrompt()},{role:'user',content:'یک موضوع نقاشی جادویی کوتاه برای کودک. فقط یک خط.'}]);
  if (res.content) document.getElementById('paintIdea').textContent=res.content;
  else alert(res.error);
}
async function aiContinueStory() {
  const prev=document.getElementById('storyText').textContent;
  if (!state.apiKey||!state.apiEnabled){ alert('کلید API لازم است'); return; }
  const res=await callAPI([{role:'system',content:systemPrompt()},{role:'user',content:'ادامه کوتاه:\n'+prev.slice(0,500)}]);
  if (res.content) document.getElementById('storyText').textContent=prev+'\n\n'+res.content;
  else alert(res.error);
}

loadState();
buildHomeCards();
