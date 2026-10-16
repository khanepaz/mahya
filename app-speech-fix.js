/* Fix speech: speak Persian body text, not English model footers */
function cleanTextForSpeech(raw) {
  if (!raw) return '';
  let t = String(raw)
    .replace(/\r/g, '')
    .replace(/—\s*مدل\s*:.*/gi, '')
    .replace(/\n?\s*مدل\s*:\s*\S+/gi, '')
    .replace(/\n?\s*—\s*model\s*:.*/gi, '')
    .replace(/\n?\s*model\s*:\s*\S+/gi, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return t;
}

function pickPersianVoice() {
  try {
    const voices = window.speechSynthesis.getVoices() || [];
    const fa = voices.find(v => /^(fa|per)/i.test(v.lang) || /persian|farsi|iran/i.test(v.name));
    if (fa) return fa;
    const ar = voices.find(v => /^ar/i.test(v.lang));
    if (ar) return ar;
  } catch (e) {}
  return null;
}

function speakText(text) {
  if (!window.speechSynthesis) {
    toast('مرورگر از خواندن صدا پشتیبانی نمی‌کند');
    return;
  }
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned || cleaned.length < 2) {
    toast('اول متن را بساز، بعد بخوان');
    return;
  }
  // Skip if almost only Latin (wrong content)
  const persianChars = (cleaned.match(/[\u0600-\u06FF]/g) || []).length;
  if (persianChars < 3 && /[a-zA-Z]{4,}/.test(cleaned)) {
    toast('متن فارسی برای خواندن پیدا نشد');
    return;
  }
  try {
    speechSynthesis.cancel();
  } catch (e) {}

  const u = new SpeechSynthesisUtterance(cleaned);
  u.lang = 'fa-IR';
  u.rate = 0.9;
  u.pitch = 1;
  const voice = pickPersianVoice();
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang || 'fa-IR';
  }
  u.onerror = function () {
    toast('خواندن صدا ممکن نشد');
  };
  speechSynthesis.speak(u);
}

function speakElement(id) {
  const el = document.getElementById(id);
  if (!el) {
    toast('متن پیدا نشد');
    return;
  }
  speakText(el.innerText || el.textContent || '');
}

function stopSpeak() {
  try {
    speechSynthesis.cancel();
  } catch (e) {}
}

// Chrome loads voices async
if (window.speechSynthesis) {
  speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = function () {
    speechSynthesis.getVoices();
  };
}
