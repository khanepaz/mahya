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
  console.log('[Mahya API]', base + '/chat/completions', 'model=', modelUsed, 'max_tokens=', body.max_tokens);
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
    const finish = data && data.choices && data.choices[0] && data.choices[0].finish_reason;
    if (!text || !String(text).trim()) {
      console.warn('[Mahya] empty reply, finish=', finish, 'raw=', raw.slice(0, 800));
      return '⚠️ پاسخی دریافت نشد.\nمدل: ' + modelUsed +
        '\nfinish_reason: ' + (finish || '?') +
        '\nاگر finish=length بود، max_tokens را روی 4096 بگذار.';
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
  const tmp = document.createElement('canvas');
  const scale = Math.min(1, (maxW || 512) / canvas.width);
  tmp.width = Math.max(1, Math.floor(canvas.width * scale / 2));
  tmp.height = Math.max(1, Math.floor(canvas.height * scale / 2));
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
      wrap.innerHTML = '<p class="error">ساخت تصویر ممکن نشد (شبکه یا فیلتر سرویس تصویر).</p>' +
        '<p class="status">اگر فیلتر اینترنت دارید، یک‌بار با اینترنت دیگر یا VPN امتحان کنید.</p>' +
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
        const obj = URL.createObjectURL(blob);
        showImg(obj, url);
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
        const c = document.createElement('canvas');
        c.width = img.naturalWidth || 512;
        c.height = img.naturalHeight || 512;
        const cx = c.getContext('2d');
        try {
          cx.drawImage(img, 0, 0);
          const data = c.toDataURL('image/png');
          state.paintings.push({ data: data, date: new Date().toLocaleDateString('fa-IR'), note: 'جادویی: ' + styleName });
        } catch (e) {
          state.paintings.push({ data: originalUrl, date: new Date().toLocaleDateString('fa-IR'), note: 'جادویی: ' + styleName });
        }
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
      a.rel = 'noopener';
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
  if (!confirm('والد عزیز: نقاشی محیا برای ساخت تصویر جادویی «' + styleName + '» ارسال شود؟')) {
    return;
  }
  const dataUrl = canvasToDataURL(640);
  if (!dataUrl) { toast('بوم آماده نیست'); return; }
  const box = document.getElementById('styleResult');
  box.style.display = 'block';
  box.innerHTML = 'در حال فهمیدن نقاشی... ✨';

  const content = [
    {
      type: 'text',
      text: 'این نقاشی یک کودک ۷ ساله است. فقط بنویس:\n1) یک جمله فارسی: چه می‌بینی.\n2) یک پرامپت انگلیسی یک‌خطی برای تصویر در سبک «' + styleName + '» مناسب کودک.\nپرامپت انگلیسی را داخل ``` بگذار.'
    },
    { type: 'image_url', image_url: { url: dataUrl } }
  ];

  const text = await callAPIVision(content, ' کوتاه باش.');
  let prompt = extractEnglishPrompt(text);
  if (!prompt) {
    prompt = 'cute ' + styleName + ' illustration of a child crayon drawing, soft magical colors, kawaii, safe for kids, studio ghibli style';
  }
  prompt = prompt.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();

  box.innerHTML =
    '<div style="white-space:pre-wrap;margin-bottom:8px">' +
    (text && !String(text).startsWith('⚠️') ? text : '') +
    '</div>' +
    '<div id="genImgWrap" style="text-align:center;min-height:120px"></div>';

  const wrap = document.getElementById('genImgWrap');
  const urls = buildImageUrls(prompt);
  loadImageInto(wrap, urls, styleName);
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
  if (!state.apiKey) {
    toast('اول کلید API را در تنظیمات والد وارد کن');
    showPage('parent');
    return;
  }
  const prev = document.getElementById('bookPreview');
  const dataUrl = prev && prev.dataset.dataurl;
  if (!dataUrl) {
    toast('اول عکس صفحه کتاب را انتخاب کن');
    return;
  }
  if (!confirm('والد عزیز: عکس صفحه کتاب برای ساخت سؤال آموزشی ارسال شود؟')) return;
  const area = document.getElementById('quizArea');
  area.innerHTML = '<div class="msg ai">در حال خواندن صفحه کتاب و ساخت سؤال... 📚</div>';
  const content = [
    {
      type: 'text',
      text: 'این عکس صفحه کتاب درسی یک کودک کلاس اول است.\n1) متن یا موضوع درس را تا حد ممکن بخوان و خلاصه کن.\n2) دقیقاً ۳ سؤال آموزشی ساده و مناسب کلاس اول بساز.\n3) برای هر سؤال پاسخ درست را هم مشخص کن.\nخروجی را به فارسی ساده بنویس.'
    },
    { type: 'image_url', image_url: { url: dataUrl } }
  ];
  const text = await callAPIVision(content);
  area.innerHTML = '<div class="msg ai" style="white-space:pre-wrap">' + (text || 'نتیجه‌ای نیامد') + '</div>' +
    '<button class="btn secondary" style="margin-top:8px" onclick="analyzeBookPage()">دوباره بساز</button>';
  if (text && !text.startsWith('⚠️')) addStars(2);
}

async function aiWordGuess() {
  const area = document.getElementById('gameArea');
  area.innerHTML = '<div class="msg ai">در حال ساخت حدس کلمه جادویی...</div>';
  const text = await callAPI([{role:'user', content:
'یک بازی «حدس کلمه» برای کودک ۷ ساله بساز.\nفقط این فرمت JSON خالص را برگردان:\n{"word":"کلمه","hint":"سرنخ کوتاه فارسی"}\nکلمه باید یک اسم ساده فارسی باشد.'}]);
  let word = 'گل', hint = 'زیبا و خوشبو در باغ';
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
    <button class="btn" onclick="(function(){const g=document.getElementById('wordG').value.trim();if(g==='${word}'||g.includes('${word}')){toast('درست!');addStars(2)}else toast('دوباره فکر کن 💭')})()">حدس بزن</button>
    <button class="btn secondary" onclick="aiWordGuess()">کلمه جدید</button>`;
}

async function aiPattern() {
  const area = document.getElementById('gameArea');
  area.innerHTML = '<div class="msg ai">در حال ساخت الگو...</div>';
  const text = await callAPI([{role:'user', content:
'یک الگوی عددی ساده برای کودک ۷ ساله بساز.\nفقط JSON خالص:\n{"seq":[2,4,6,8],"answer":10,"explain":"هر بار ۲ تا اضافه می‌شود"}\nاعداد کوچک و الگوی واضح باشد.'}]);
  let seq = [2,4,6,8], ans = 10;
  try {
    const m = (text || '').match(/\{[\s\S]*\}/);
    if (m) {
      const j = JSON.parse(m[0]);
      if (Array.isArray(j.seq)) seq = j.seq;
      if (j.answer != null) ans = j.answer;
    }
  } catch(e) {}
  const opts = shuffle([ans, ans+1, ans-1, ans+2].map(Number));
  area.innerHTML = `
    <div class="msg ai">الگو را کامل کن: ${seq.join(' ، ')} ، ؟</div>
    <div class="btn-row">${opts.map(n => `<button class="quiz-opt" onclick="checkPat(this,${n},${ans})">${n}</button>`).join('')}</div>
    <button class="btn secondary" onclick="aiPattern()">الگوی جدید</button>`;
}

async function aiRiddle() {
  const area = document.getElementById('gameArea');
  area.innerHTML = '<div class="msg ai">در حال ساخت معما...</div>';
  const text = await callAPI([{role:'user', content:
'یک معمای کوتاه و شاد برای کودک ۷ ساله بساز.\nفقط JSON خالص:\n{"riddle":"متن معما","answer":"جواب کوتاه"}\nمعما ترسناک نباشد.'}]);
  let riddle = 'چی همیشه می‌آد ولی هیچ‌وقت نمی‌مونه؟', answer = 'فردا';
  try {
    const m = (text || '').match(/\{[\s\S]*\}/);
    if (m) {
      const j = JSON.parse(m[0]);
      if (j.riddle) riddle = j.riddle;
      if (j.answer) answer = j.answer;
    }
  } catch(e) {}
  area.innerHTML = `
    <div class="msg ai">${riddle}</div>
    <input class="input" id="ridG" placeholder="جوابت را بنویس...">
    <button class="btn" onclick="(function(){const g=document.getElementById('ridG').value.trim();if(g && ('${answer}'.includes(g)||g.includes('${answer}'))){toast('آفرین!');addStars(2)}else{toast('نزدیک بود! جواب: ${answer}')}})()">حدس بزن</button>
    <button class="btn secondary" onclick="aiRiddle()">معمای جدید</button>`;
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
      const cw = canvas.width / 2;
      const ch = canvas.height / 2;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, cw, ch);
      const scale = Math.min(cw / img.width, ch / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (cw - w) / 2;
      const y = (ch - h) / 2;
      ctx.drawImage(img, x, y, w, h);
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
  const sys = 'تو یک دستیار مهربان، شاد و مناسب کودک ۷ ساله هستی. همیشه به فارسی ساده، کوتاه و کودکانه پاسخ بده. از محتوای نامناسب، ترسناک یا پیچیده پرهیز کن. نام کودک محیا است.' + (systemExtra || '');
  const body = {
    model: modelUsed,
    messages: [{ role: 'system', content: sys }, ...messages],
    max_tokens: Math.max(state.maxTokens || 2048, 2048),
    temperature: 0.8
  };
  console.log('[Mahya API]', base + '/chat/completions', 'model=', modelUsed, 'max_tokens=', body.max_tokens);
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
    const finish = data && data.choices && data.choices[0] && data.choices[0].finish_reason;
    if (!text || !String(text).trim()) {
      console.warn('[Mahya] empty reply, finish=', finish, 'raw=', raw.slice(0, 800));
      return '⚠️ پاسخی دریافت نشد.\nمدل: ' + modelUsed +
        '\nfinish_reason: ' + (finish || '?') +
        '\nاگر finish=length بود، max_tokens را روی 4096 بگذار.';
    }
    return text;
  } catch (e) {
    console.error(e);
    toast('خطا در اتصال به API');
    return '⚠️ ' + (e.message || 'خطای شبکه یا CORS');
  }
}

async function testApi() {
  syncApiFromUI();
  const status = document.getElementById('apiStatus');
  status.textContent = 'در حال تست با مدل ' + (state.apiModel || '?') + ' (max_tokens=' + state.maxTokens + ')...';
  if (!state.apiKey) {
    status.innerHTML = '<span class="error">کلید را وارد کن</span>';
    return;
  }
  const tokEl = document.getElementById('maxTokens');
  if (tokEl && parseInt(tokEl.value) < 2048) tokEl.value = '2048';
  const r = await callAPI([{ role: 'user', content: 'فقط بنویس: سلام محیا جان!' }]);
  status.innerHTML = r
    ? '<span class="success">✅ اتصال موفق — مدل: ' + (state.apiModel || '') + '</span><br><pre style="white-space:pre-wrap;font-size:0.85rem">' + r + '</pre>'
    : '<span class="error">❌ ناموفق</span>';
}
