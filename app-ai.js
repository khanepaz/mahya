/** همگام‌سازی مدل و کلید از پنل والد قبل از هر درخواست */
function syncApiFromUI() {
  const keyEl = document.getElementById('apiKey');
  const baseEl = document.getElementById('apiBase');
  const modelEl = document.getElementById('apiModel');
  const tokEl = document.getElementById('maxTokens');
  if (keyEl && keyEl.value.trim()) state.apiKey = keyEl.value.trim();
  if (baseEl && baseEl.value.trim()) state.apiBase = baseEl.value.trim().replace(/\/$/, '');
  if (modelEl && modelEl.value) state.apiModel = modelEl.value;
  if (tokEl) state.maxTokens = parseInt(tokEl.value) || 600;
}

/** استخراج متن از پاسخ‌های مختلف API */
function extractReply(data) {
  if (!data) return null;
  if (typeof data === 'string') return data;
  const c0 = data.choices && data.choices[0];
  if (c0) {
    if (c0.message) {
      const m = c0.message;
      if (typeof m.content === 'string' && m.content.trim()) return m.content;
      if (Array.isArray(m.content)) {
        const parts = m.content.map(p => (typeof p === 'string' ? p : (p.text || p.content || ''))).join('');
        if (parts.trim()) return parts;
      }
      if (m.refusal) return '⚠️ مدل رد کرد: ' + m.refusal;
    }
    if (typeof c0.text === 'string' && c0.text.trim()) return c0.text;
    if (c0.delta && c0.delta.content) return c0.delta.content;
  }
  if (data.output_text) return data.output_text;
  if (data.content && typeof data.content === 'string') return data.content;
  if (data.error) {
    const e = data.error;
    return '⚠️ خطا: ' + (e.message || e.code || JSON.stringify(e));
  }
  return null;
}

/** ارسال پیام متنی یا چندرسانه‌ای (متن + تصویر base64) */
async function callAPIVision(userContent, systemExtra) {
  syncApiFromUI();
  if (!state.apiKey) {
    toast('کلید API را در تنظیمات والد وارد کن');
    showPage('parent');
    return null;
  }
  const modelUsed = state.apiModel || 'grok-4.5';
  const base = (state.apiBase || 'https://cleanapis.com/v1').replace(/\/$/, '');
  const sys = 'تو یک دستیار مهربان، شاد و مناسب کودک ۷ ساله هستی. همیشه به فارسی ساده، کوتاه و کودکانه پاسخ بده. از محتوای نامناسب پرهیز کن. نام کودک محیا است.' + (systemExtra || '');
  const body = {
    model: modelUsed,
    messages: [
      { role: 'system', content: sys },
      { role: 'user', content: userContent }
    ],
    max_tokens: state.maxTokens || 800,
    temperature: 0.7
  };
  console.log('[Mahya API]', base + '/chat/completions', 'model=', modelUsed);
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
      const errMsg = (data && data.error && (data.error.message || data.error.code)) || raw.slice(0, 200);
      throw new Error('HTTP ' + res.status + ' | مدل: ' + modelUsed + ' | ' + errMsg);
    }
    let text = extractReply(data);
    const usedModel = (data && (data.model || data.model_id)) || modelUsed;
    if (!text || !String(text).trim()) {
      console.warn('[Mahya] empty reply, raw:', raw.slice(0, 500));
      return '⚠️ پاسخی دریافت نشد.\nمدل درخواست‌شده: ' + modelUsed + '\nمدل در پاسخ: ' + usedModel + '\n(جزئیات در Console — F12)';
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

async function stylePainting(styleName) {
  if (!state.apiKey) {
    toast('اول کلید API را در تنظیمات والد وارد کن');
    showPage('parent');
    return;
  }
  if (!confirm('والد عزیز: نقاشی محیا برای تحلیل سبک «' + styleName + '» به سرویس هوش مصنوعی ارسال شود؟')) {
    return;
  }
  const dataUrl = canvasToDataURL(640);
  if (!dataUrl) { toast('بوم آماده نیست'); return; }
  const box = document.getElementById('styleResult');
  box.style.display = 'block';
  box.textContent = 'در حال جادو کردن نقاشی با سبک ' + styleName + '... ✨';

  const content = [
    {
      type: 'text',
      text: `این نقاشی یک کودک ۷ ساله است. لطفاً:\n1) خیلی کوتاه بگو در تصویر چه چیزهایی می‌بینی.\n2) یک توصیف زیبا و کودکانه بنویس که اگر همین نقاشی با سبک «${styleName}» بازآفرینی شود چگونه به نظر می‌رسد.\n3) یک پرامپت انگلیسی کوتاه برای تولید تصویر در سبک ${styleName} پیشنهاد بده.\nپاسخ را به فارسی ساده بنویس، به‌جز پرامپت انگلیسی.`
    },
    {
      type: 'image_url',
      image_url: { url: dataUrl }
    }
  ];

  const text = await callAPIVision(content, ' اگر مدل vision نیست صادقانه بگو.');
  box.textContent = text || 'نتیجه‌ای نیامد. مدل Vision را در تنظیمات والد انتخاب کن.';
  if (text && !text.startsWith('⚠️')) addStars(2);
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
      text: `این عکس صفحه کتاب درسی یک کودک کلاس اول است.\n1) متن یا موضوع درس را تا حد ممکن بخوان و خلاصه کن.\n2) دقیقاً ۳ سؤال آموزشی ساده و مناسب کلاس اول بساز.\n3) برای هر سؤال پاسخ درست را هم مشخص کن.\nخروجی را به فارسی ساده بنویس.\nاگر تصویر خوانا نبود، بگو عکس واضح‌تری لازم است.`
    },
    { type: 'image_url', image_url: { url: dataUrl } }
  ];

  const text = await callAPIVision(content);
  area.innerHTML = '<div class="msg ai" style="white-space:pre-wrap">' + (text || 'نتیجه‌ای نیامد') + '</div>' +
    '<button class="btn secondary" style="margin-top:8px" onclick="analyzeBookPage()">دوباره بساز</button>';
  if (text && !text.startsWith('⚠️')) addStars(2);
}

/* ========== AI GAMES ========== */
async function aiWordGuess() {
  const area = document.getElementById('gameArea');
  area.innerHTML = '<div class="msg ai">در حال ساخت حدس کلمه جادویی...</div>';
  const text = await callAPI([{role:'user', content:
`یک بازی «حدس کلمه» برای کودک ۷ ساله بساز.\nفقط این فرمت JSON خالص را برگردان:\n{"word":"کلمه","hint":"سرنخ کوتاه فارسی"}\nکلمه باید یک اسم ساده فارسی باشد.`}]);
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
`یک الگوی عددی ساده برای کودک ۷ ساله بساز.\nفقط JSON خالص:\n{"seq":[2,4,6,8],"answer":10,"explain":"هر بار ۲ تا اضافه می‌شود"}\nاعداد کوچک و الگوی واضح باشد.`}]);
  let seq = [2,4,6,8], ans = 10, expl = 'هر بار ۲ تا اضافه می‌شود';
  try {
    const m = (text || '').match(/\{[\s\S]*\}/);
    if (m) {
      const j = JSON.parse(m[0]);
      if (Array.isArray(j.seq)) seq = j.seq;
      if (j.answer != null) ans = j.answer;
      if (j.explain) expl = j.explain;
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
`یک معمای کوتاه و شاد برای کودک ۷ ساله بساز.\nفقط JSON خالص:\n{"riddle":"متن معما","answer":"جواب کوتاه"}\nمعما ترسناک نباشد.`}]);
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

/** بارگذاری عکس روی بوم نقاشی */
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

/** بازنویسی callAPI تا همیشه مدل انتخاب‌شده را بفرستد */
async function callAPI(messages, systemExtra) {
  syncApiFromUI();
  if (!state.apiKey) {
    toast('کلید API را در تنظیمات والد وارد کن');
    showPage('parent');
    return null;
  }
  const modelUsed = state.apiModel || 'grok-4.5';
  const base = (state.apiBase || 'https://cleanapis.com/v1').replace(/\/$/, '');
  const sys = 'تو یک دستیار مهربان، شاد و مناسب کودک ۷ ساله هستی. همیشه به فارسی ساده، کوتاه و کودکانه پاسخ بده. از محتوای نامناسب، ترسناک یا پیچیده پرهیز کن. نام کودک محیا است.' + (systemExtra || '');
  const body = {
    model: modelUsed,
    messages: [{ role: 'system', content: sys }, ...messages],
    max_tokens: state.maxTokens || 600,
    temperature: 0.8
  };
  console.log('[Mahya API]', base + '/chat/completions', 'model=', modelUsed);
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
      const errMsg = (data && data.error && (data.error.message || data.error.code)) || raw.slice(0, 200);
      throw new Error('HTTP ' + res.status + ' | مدل: ' + modelUsed + ' | ' + errMsg);
    }
    let text = extractReply(data);
    const usedModel = (data && (data.model || data.model_id)) || modelUsed;
    if (!text || !String(text).trim()) {
      console.warn('[Mahya] empty reply, raw:', raw.slice(0, 500));
      return '⚠️ پاسخی دریافت نشد.\nمدل درخواست‌شده: ' + modelUsed + '\nمدل در پاسخ: ' + usedModel;
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
  document.getElementById('apiStatus').textContent = 'در حال تست با مدل ' + (state.apiModel || '?') + '...';
  if (!state.apiKey) {
    document.getElementById('apiStatus').innerHTML = '<span class="error">کلید را وارد کن</span>';
    return;
  }
  const r = await callAPI([{ role: 'user', content: 'فقط بنویس: سلام محیا جان! مدل تو چیست؟' }]);
  document.getElementById('apiStatus').innerHTML = r
    ? '<span class="success">✅ اتصال موفق — مدل انتخابی: ' + (state.apiModel || '') + '</span><br>' + r
    : '<span class="error">❌ ناموفق</span>';
}
