/** همگام‌سازی مدل و کلید از پنل والد قبل از هر درخواست */
function syncApiFromUI() {
  const keyEl = document.getElementById('apiKey');
  const baseEl = document.getElementById('apiBase');
  const modelEl = document.getElementById('apiModel');
  const tokEl = document.getElementById('maxTokens');
  if (keyEl && keyEl.value.trim()) state.apiKey = keyEl.value.trim();
  if (baseEl && baseEl.value.trim()) state.apiBase = baseEl.value.trim().replace(/\/$/, '');
  if (modelEl && modelEl.value) state.apiModel = modelEl.value;
  let mt = tokEl ? parseInt(tokEl.value) : 0;
  if (!mt || mt < 2048) mt = 2048;
  state.maxTokens = mt;
}

function extractReply(data) {
  if (!data) return null;
  if (typeof data === 'string') return data;
  const c0 = data.choices && data.choices[0];
  if (c0) {
    if (c0.message) {
      const m = c0.message;
      if (typeof m.content === 'string' && m.content.trim()) return m.content;
      if (Array.isArray(m.content)) {
        const parts = m.content.map(p => {
          if (typeof p === 'string') return p;
          if (p && p.type === 'text' && p.text) return p.text;
          return (p && (p.text || p.content)) || '';
        }).join('');
        if (parts.trim()) return parts;
      }
      if (m.refusal) return '⚠️ مدل رد کرد: ' + m.refusal;
    }
    if (typeof c0.text === 'string' && c0.text.trim()) return c0.text;
    if (c0.delta && c0.delta.content) return c0.delta.content;
    if (c0.finish_reason === 'length') {
      return '⚠️ پاسخ قطع شد (max_tokens کم بود). در تنظیمات والد حداکثر توکن را روی 4096 بگذارید.';
    }
  }
  if (data.output_text && String(data.output_text).trim()) return data.output_text;
  if (data.content && typeof data.content === 'string' && data.content.trim()) return data.content;
  if (data.error) {
    const e = data.error;
    return '⚠️ خطا: ' + (e.message || e.code || JSON.stringify(e));
  }
  return null;
}

function apiBaseUrl() {
  return (state.apiBase || 'https://cleanapis.com/v1').replace(/\/$/, '').replace('www.cleanapis.com', 'cleanapis.com');
}

async function callAPIVision(userContent, systemExtra) {
  syncApiFromUI();
  if (!state.apiKey) {
    toast('کلید API را در تنظیمات والد وارد کن');
    showPage('parent');
    return null;
  }
  const modelUsed = state.apiModel || 'gpt-5.6-luna';
  const base = apiBaseUrl();
  const sys = 'تو یک دستیار مهربان، شاد و مناسب کودک ۷ ساله هستی. همیشه به فارسی ساده، کوتاه و کودکانه پاسخ بده. از محتوای نامناسب پرهیز کن. نام کودک محیا است.' + (systemExtra || '');
  const body = {
    model: modelUsed,
    messages: [
      { role: 'system', content: sys },
      { role: 'user', content: userContent }
    ],
    max_tokens: Math.max(state.maxTokens || 2048, 2048),
    temperature: 0.7
  };
  try {
    const res = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + state.apiKey
      },
      body: JSON.stringify(body)
    });
    const raw = await res.text();
    let data;
    try { data = JSON.parse(raw); } catch (_) { data = null; }
    if (!res.ok) {
      const errMsg = (data && data.error && (data.error.message || data.error.code)) || raw.slice(0, 300);
      throw new Error('HTTP ' + res.status + ' | مدل: ' + modelUsed + ' | ' + errMsg);
    }
    let text = extractReply(data);
    const usedModel = (data && (data.model || data.model_id)) || modelUsed;
    if (!text || !String(text).trim()) {
      return '⚠️ پاسخی دریافت نشد. مدل: ' + modelUsed;
    }
    if (typeof text === 'string' && !text.startsWith('⚠️')) {
      text = text + '\n\n— مدل: ' + usedModel;
    }
    return text;
  } catch (e) {
    console.error(e);
    toast('خطا در اتصال به API');
    return '⚠️ ' + (e.message || 'خطای شبکه یا CORS');
  }
}

function canvasToDataURL(maxW) {
  if (!canvas) return null;
  const max = maxW || 640;
  const tmp = document.createElement('canvas');
  const scale = Math.min(1, max / canvas.width);
  tmp.width = Math.max(1, Math.floor(canvas.width * scale));
  tmp.height = Math.max(1, Math.floor(canvas.height * scale));
  const tctx = tmp.getContext('2d');
  tctx.fillStyle = '#fff';
  tctx.fillRect(0, 0, tmp.width, tmp.height);
  tctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tmp.width, tmp.height);
  return tmp.toDataURL('image/jpeg', 0.7);
}

function buildImageUrls(prompt) {
  const p = (prompt || 'cute magical children illustration, soft pastel, kawaii').slice(0, 300);
  const enc = encodeURIComponent(p);
  const seed = Date.now() % 1000000;
  return [
    'https://image.pollinations.ai/prompt/' + enc + '?width=768&height=768&nologo=true&seed=' + seed,
    'https://pollinations.ai/p/' + enc + '?width=768&height=768&nologo=true&seed=' + seed,
    'https://image.pollinations.ai/prompt/' + enc + '?model=flux&width=768&height=768&nologo=true&seed=' + seed
  ];
}

function extractEnglishPrompt(aiText) {
  if (!aiText) return null;
  const code = aiText.match(/```(?:\w*\n)?([\s\S]*?)```/);
  if (code && /[a-zA-Z]{4,}/.test(code[1])) return code[1].trim().replace(/\n/g, ', ');
  const lines = aiText.split(/\n/).map(l => l.trim()).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    const l = lines[i].replace(/^[-*•\d.)\s]+/, '').replace(/^["']|["']$/g, '');
    if (/^[a-zA-Z0-9 ,.'"\-!?:;()]+$/.test(l) && l.split(' ').length >= 5) return l;
  }
  return null;
}

function loadImageInto(wrap, urls, styleName) {
  if (!wrap) return;
  let i = 0;
  function tryNext() {
    if (i >= urls.length) {
      wrap.innerHTML = '<p class="error">ساخت تصویر ممکن نشد (شبکه یا فیلتر).</p>' +
        '<button class="btn secondary" type="button" id="btnRetryStyle">تلاش دوباره</button>';
      const b = document.getElementById('btnRetryStyle');
      if (b) b.onclick = function() { stylePainting(styleName); };
      return;
    }
    const url = urls[i++];
    wrap.innerHTML = '<p class="status">🎨 در حال بارگذاری عکس جادویی... (' + i + '/' + urls.length + ')</p>';
    fetch(url, { mode: 'cors', cache: 'no-store' })
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.blob();
      })
      .then(function(blob) {
        if (blob && blob.size < 800) throw new Error('empty');
        showImg(URL.createObjectURL(blob), url);
      })
      .catch(function() {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() { showImg(url, url); };
        img.onerror = function() { tryNext(); };
        img.src = url;
      });
  }
  function showImg(src, originalUrl) {
    wrap.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'نسخه جادویی';
    img.style.cssText = 'max-width:100%;border-radius:16px;box-shadow:0 8px 24px rgba(233,30,140,0.25);margin-top:8px';
    wrap.appendChild(img);
    const row = document.createElement('div');
    row.className = 'btn-row';
    row.style.marginTop = '10px';
    const btnSave = document.createElement('button');
    btnSave.className = 'btn';
    btnSave.textContent = '💾 ذخیره در گالری';
    btnSave.onclick = function() {
      try {
        state.paintings.push({ data: originalUrl, date: new Date().toLocaleDateString('fa-IR'), note: 'جادویی: ' + styleName });
        saveState();
        addStars(3);
        toast('در گالری ذخیره شد! ✨');
        if (typeof renderArtGallery === 'function') renderArtGallery();
      } catch (e) { toast('ذخیره نشد'); }
    };
    const btnDl = document.createElement('button');
    btnDl.className = 'btn secondary';
    btnDl.textContent = '⬇️ دانلود';
    btnDl.onclick = function() {
      const a = document.createElement('a');
      a.href = src;
      a.download = 'mahya-magic.png';
      a.target = '_blank';
      a.click();
    };
    row.appendChild(btnSave);
    row.appendChild(btnDl);
    wrap.appendChild(row);
    addStars(2);
    toast('عکس جادویی آماده شد! 🌟');
  }
  tryNext();
}

async function stylePainting(styleName) {
  syncApiFromUI();
  if (!state.apiKey) {
    toast('اول کلید API را در تنظیمات والد وارد کن');
    showPage('parent');
    return;
  }
  if (!confirm('والد عزیز: نقاشی محیا برای ساخت تصویر جادویی «' + styleName + '» ارسال شود؟')) return;
  const dataUrl = canvasToDataURL(640);
  if (!dataUrl) { toast('بوم آماده نیست'); return; }
  const box = document.getElementById('styleResult');
  box.style.display = 'block';
  box.innerHTML = 'در حال فهمیدن نقاشی... ✨';
  const content = [
    { type: 'text', text: 'این نقاشی کودک است. 1) یک جمله فارسی چه می‌بینی. 2) پرامپت انگلیسی یک‌خطی سبک «' + styleName + '». پرامپت را داخل ``` بگذار.' },
    { type: 'image_url', image_url: { url: dataUrl } }
  ];
  const text = await callAPIVision(content, ' کوتاه باش.');
  let prompt = extractEnglishPrompt(text);
  if (!prompt) prompt = 'cute ' + styleName + ' illustration, soft magical colors, kawaii, safe for kids';
  prompt = prompt.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
  box.innerHTML = '<div style="white-space:pre-wrap;margin-bottom:8px">' + (text && !String(text).startsWith('⚠️') ? text : '') + '</div><div id="genImgWrap" style="text-align:center;min-height:120px"></div>';
  loadImageInto(document.getElementById('genImgWrap'), buildImageUrls(prompt), styleName);
}

document.addEventListener('change', function(e) {
  if (e.target && e.target.id === 'bookPhoto') {
    const f = e.target.files && e.target.files[0];
    const prev = document.getElementById('bookPreview');
    if (!f || !prev) return;
    const reader = new FileReader();
    reader.onload = ev => {
      prev.innerHTML = '<img src="' + ev.target.result + '" style="max-width:100%;border-radius:12px;max-height:200px">';
      prev.dataset.dataurl = ev.target.result;
    };
    reader.readAsDataURL(f);
  }
});

async function analyzeBookPage() {
  syncApiFromUI();
  if (!state.apiKey) { toast('اول کلید API را وارد کن'); showPage('parent'); return; }
  const prev = document.getElementById('bookPreview');
  const dataUrl = prev && prev.dataset.dataurl;
  if (!dataUrl) { toast('اول عکس صفحه کتاب را انتخاب کن'); return; }
  if (!confirm('والد عزیز: عکس صفحه کتاب ارسال شود؟')) return;
  const area = document.getElementById('quizArea');
  area.innerHTML = '<div class="msg ai">در حال خواندن صفحه کتاب...</div>';
  const content = [
    { type: 'text', text: 'عکس صفحه کتاب کلاس اول. خلاصه کن و ۳ سؤال ساده با جواب بساز. فارسی ساده.' },
    { type: 'image_url', image_url: { url: dataUrl } }
  ];
  const text = await callAPIVision(content);
  area.innerHTML = '<div class="msg ai" style="white-space:pre-wrap">' + (text || 'نتیجه‌ای نیامد') + '</div>';
  if (text && !text.startsWith('⚠️')) addStars(2);
}

async function showRiddleMaker() {
  const area = document.getElementById('gameArea');
  area.innerHTML = `
    <div class="panel">
      <strong>🧩 معمای دلخواه محیا</strong>
      <p class="status">بگو درباره چی معما می‌خوای؟ (تایپ یا صدا)</p>
      <input class="input" id="riddleTopic" placeholder="مثلاً: حیوانات، فضا، رنگین‌کمان...">
      <div class="btn-row">
        <button class="btn secondary" type="button" onclick="startSpeech('riddleTopic')">🎤 بگو</button>
        <button class="btn" type="button" onclick="aiRiddleFromTopic()">✨ بساز معما</button>
      </div>
      <div class="btn-row" style="margin-top:8px">
        <button class="btn secondary" type="button" onclick="aiRiddleFromTopic('حیوانات')">🐰 حیوانات</button>
        <button class="btn secondary" type="button" onclick="aiRiddleFromTopic('طبیعت')">🌿 طبیعت</button>
        <button class="btn secondary" type="button" onclick="aiRiddleFromTopic('فضا و ستاره')">⭐ فضا</button>
        <button class="btn secondary" type="button" onclick="aiRiddleFromTopic('خانه و خانواده')">🏠 خانه</button>
      </div>
    </div>`;
}

async function aiRiddle() { return showRiddleMaker(); }

async function aiRiddleFromTopic(preset) {
  const area = document.getElementById('gameArea');
  const inp = document.getElementById('riddleTopic');
  const topic = (preset || (inp && inp.value) || 'چیزهای شاد').trim();
  area.innerHTML = '<div class="msg ai">در حال ساخت معما درباره «' + topic + '»...</div>';
  const text = await callAPI([{role:'user', content:
'معمای کوتاه شاد برای کودک ۷ ساله درباره «' + topic + '». فقط JSON:\n{"riddle":"معما","answer":"جواب"}'}]);
  let riddle = 'چی در آسمان می‌درخشد؟', answer = 'ستاره';
  try {
    const m = (text || '').match(/\{[\s\S]*\}/);
    if (m) {
      const j = JSON.parse(m[0]);
      if (j.riddle) riddle = j.riddle;
      if (j.answer) answer = String(j.answer);
    }
  } catch(e) {}
  const ansSafe = answer.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  area.innerHTML = `
    <div class="msg ai"><strong>موضوع:</strong> ${topic}<br><br>${riddle}</div>
    <input class="input" id="ridG" placeholder="جوابت را بنویس...">
    <div class="btn-row">
      <button class="btn" type="button" onclick="checkCustomRiddle('${ansSafe}')">حدس بزن</button>
      <button class="btn secondary" type="button" onclick="showRiddleMaker()">معمای دیگر</button>
    </div>`;
}

function checkCustomRiddle(answer) {
  const g = (document.getElementById('ridG').value || '').trim();
  if (!g) { toast('اول جواب را بنویس'); return; }
  if (g === answer || answer.includes(g) || g.includes(answer)) {
    toast('آفرین! درست گفتی 🌟');
    addStars(2);
  } else {
    toast('نزدیک بود! جواب: ' + answer);
  }
}

async function aiPattern() { return aiPatternCustom(); }

async function aiPatternCustom() {
  const area = document.getElementById('gameArea');
  area.innerHTML = `
    <div class="panel">
      <strong>🔢 الگوی دلخواه</strong>
      <p class="status">چه جور الگویی می‌خوای؟</p>
      <input class="input" id="patTopic" placeholder="مثلاً: عدد، شکل، سخت‌تر...">
      <div class="btn-row">
        <button class="btn secondary" type="button" onclick="startSpeech('patTopic')">🎤 بگو</button>
        <button class="btn" type="button" onclick="runAiPattern()">✨ بساز الگو</button>
      </div>
    </div>`;
}

async function runAiPattern() {
  const area = document.getElementById('gameArea');
  const topic = ((document.getElementById('patTopic') || {}).value || 'اعداد ساده').trim();
  area.innerHTML = '<div class="msg ai">در حال ساخت الگو...</div>';
  const text = await callAPI([{role:'user', content:
'الگوی ساده برای کودک ۷ ساله موضوع «' + topic + '». فقط JSON:\n{"seq":["۲","۴","۶","۸"],"answer":"۱۰","explain":"هر بار ۲"}'}]);
  let seq = ['۲','۴','۶','۸'], ans = '۱۰', expl = 'هر بار ۲ تا اضافه می‌شود';
  try {
    const m = (text || '').match(/\{[\s\S]*\}/);
    if (m) {
      const j = JSON.parse(m[0]);
      if (Array.isArray(j.seq)) seq = j.seq.map(String);
      if (j.answer != null) ans = String(j.answer);
      if (j.explain) expl = j.explain;
    }
  } catch(e) {}
  const opts = shuffle([ans, '۱۲', '۷', '۹']).slice(0, 4);
  if (!opts.includes(ans)) opts[0] = ans;
  area.innerHTML = `
    <div class="msg ai">الگو: ${seq.join(' ، ')} ، ؟</div>
    <div class="btn-row">${opts.map(n =>
      `<button class="quiz-opt" type="button" onclick="checkPat(this,'${String(n).replace(/'/g,"\\'")}','${ans.replace(/'/g,"\\'")}')">${n}</button>`
    ).join('')}</div>
    <p class="status">${expl}</p>
    <button class="btn secondary" type="button" onclick="aiPatternCustom()">الگوی جدید</button>`;
}

async function aiWordGuess() {
  const area = document.getElementById('gameArea');
  area.innerHTML = '<div class="msg ai">در حال ساخت حدس کلمه...</div>';
  const text = await callAPI([{role:'user', content:'حدس کلمه کودکانه. فقط JSON: {"word":"کلمه","hint":"سرنخ"}'}]);
  let word = 'گل', hint = 'زیبا و خوشبو';
  try {
    const m = (text || '').match(/\{[\s\S]*\}/);
    if (m) {
      const j = JSON.parse(m[0]);
      if (j.word) word = j.word;
      if (j.hint) hint = j.hint;
    }
  } catch(e) {}
  area.innerHTML = `
    <div class="msg ai">سرنخ: ${hint}</div>
    <input class="input" id="wordG" placeholder="کلمه چیست؟">
    <button class="btn" onclick="(function(){const g=document.getElementById('wordG').value.trim();if(g==='${word}'||g.includes('${word}')){toast('درست!');addStars(2)}else toast('دوباره!')})()">حدس بزن</button>`;
}

function loadPhotoToCanvas(input) {
  const f = input.files && input.files[0];
  if (!f) return;
  if (!canvas || !ctx) initCanvas();
  if (!canvas || !ctx) { toast('بوم آماده نیست'); return; }
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new Image();
    img.onload = function() {
      const cw = typeof canvasCssW !== 'undefined' ? canvasCssW : (canvas.clientWidth || 300);
      const ch = typeof canvasCssH !== 'undefined' ? canvasCssH : (canvas.clientHeight || 320);
      const dpr = canvas.width / cw;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, cw, ch);
      const scale = Math.min(cw / img.width, ch / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      paths = [];
      toast('عکس روی بوم قرار گرفت 📷');
      input.value = '';
    };
    img.onerror = function() { toast('خطا در بارگذاری عکس'); };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(f);
}

async function callAPI(messages, systemExtra) {
  syncApiFromUI();
  if (!state.apiKey) {
    toast('کلید API را در تنظیمات والد وارد کن');
    showPage('parent');
    return null;
  }
  const modelUsed = state.apiModel || 'gpt-5.6-luna';
  const base = apiBaseUrl();
  const sys = 'تو یک دستیار مهربان، شاد و مناسب کودک ۷ ساله هستی. همیشه به فارسی ساده پاسخ بده. نام کودک محیا است.' + (systemExtra || '');
  const body = {
    model: modelUsed,
    messages: [{ role: 'system', content: sys }, ...messages],
    max_tokens: Math.max(state.maxTokens || 2048, 2048),
    temperature: 0.8
  };
  try {
    const res = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + state.apiKey
      },
      body: JSON.stringify(body)
    });
    const raw = await res.text();
    let data;
    try { data = JSON.parse(raw); } catch (_) { data = null; }
    if (!res.ok) {
      const errMsg = (data && data.error && (data.error.message || data.error.code)) || raw.slice(0, 300);
      throw new Error('HTTP ' + res.status + ' | ' + errMsg);
    }
    let text = extractReply(data);
    if (!text || !String(text).trim()) return '⚠️ پاسخی دریافت نشد. مدل: ' + modelUsed;
    return text;
  } catch (e) {
    console.error(e);
    toast('خطا در اتصال به API');
    return '⚠️ ' + (e.message || 'خطای شبکه');
  }
}

async function testApi() {
  syncApiFromUI();
  const status = document.getElementById('apiStatus');
  status.textContent = 'در حال تست با مدل ' + (state.apiModel || '?') + '...';
  if (!state.apiKey) {
    status.innerHTML = '<span class="error">کلید را وارد کن</span>';
    return;
  }
  const tokEl = document.getElementById('maxTokens');
  if (tokEl && parseInt(tokEl.value) < 2048) tokEl.value = '2048';
  const r = await callAPI([{ role: 'user', content: 'فقط بنویس: سلام محیا جان!' }]);
  status.innerHTML = r
    ? '<span class="success">✅ موفق — ' + (state.apiModel || '') + '</span><br>' + r
    : '<span class="error">❌ ناموفق</span>';
}
