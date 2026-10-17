/* Persian TTS + microphone fixes for Mahya */
(function () {
  let currentAudio = null;
  let speakQueue = [];
  let speaking = false;
  let keepAliveTimer = null;
  let activeRec = null;

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
      .replace(/⚠️[^\n]*/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    return t;
  }

  function countPersian(s) {
    return (String(s).match(/[\u0600-\u06FF]/g) || []).length;
  }

  function splitChunks(text, maxLen) {
    maxLen = maxLen || 160;
    const parts = [];
    const sentences = String(text).split(/(?<=[.!?۔！？\n…])\s+/);
    let buf = '';
    for (let i = 0; i < sentences.length; i++) {
      const s = sentences[i].trim();
      if (!s) continue;
      if ((buf + ' ' + s).trim().length <= maxLen) {
        buf = (buf ? buf + ' ' : '') + s;
      } else {
        if (buf) parts.push(buf);
        if (s.length <= maxLen) {
          buf = s;
        } else {
          for (let j = 0; j < s.length; j += maxLen) {
            parts.push(s.slice(j, j + maxLen));
          }
          buf = '';
        }
      }
    }
    if (buf) parts.push(buf);
    return parts.filter(Boolean);
  }

  function pickPersianVoice() {
    try {
      const voices = window.speechSynthesis ? speechSynthesis.getVoices() || [] : [];
      const scored = voices.map(function (v) {
        let score = 0;
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        if (lang.indexOf('fa') === 0 || lang.indexOf('per') === 0) score += 100;
        if (/persian|farsi|iran/.test(name)) score += 80;
        if (lang.indexOf('ar') === 0) score += 30;
        return { v: v, score: score };
      }).filter(function (x) { return x.score > 0; })
        .sort(function (a, b) { return b.score - a.score; });
      return scored.length ? scored[0].v : null;
    } catch (e) {
      return null;
    }
  }

  function stopAllSpeech() {
    speaking = false;
    speakQueue = [];
    try {
      if (window.speechSynthesis) speechSynthesis.cancel();
    } catch (e) {}
    if (keepAliveTimer) {
      clearInterval(keepAliveTimer);
      keepAliveTimer = null;
    }
    if (currentAudio) {
      try {
        currentAudio.onended = null;
        currentAudio.onerror = null;
        currentAudio.pause();
        currentAudio.src = '';
      } catch (e) {}
      currentAudio = null;
    }
  }

  function startChromeKeepAlive() {
    if (keepAliveTimer) clearInterval(keepAliveTimer);
    keepAliveTimer = setInterval(function () {
      try {
        if (!speechSynthesis.speaking) {
          clearInterval(keepAliveTimer);
          keepAliveTimer = null;
          return;
        }
        speechSynthesis.pause();
        speechSynthesis.resume();
      } catch (e) {}
    }, 10000);
  }

  function speakNative(text, voice) {
    return new Promise(function (resolve) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = (voice && voice.lang) || 'fa-IR';
      u.rate = 0.92;
      u.pitch = 1;
      if (voice) u.voice = voice;
      u.onend = function () { resolve(true); };
      u.onerror = function () { resolve(false); };
      speechSynthesis.speak(u);
      startChromeKeepAlive();
    });
  }

  function speakGoogleChunk(text) {
    return new Promise(function (resolve) {
      const url =
        'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=fa&q=' +
        encodeURIComponent(text);
      const audio = new Audio(url);
      currentAudio = audio;
      audio.onended = function () {
        if (currentAudio === audio) currentAudio = null;
        resolve(true);
      };
      audio.onerror = function () {
        if (currentAudio === audio) currentAudio = null;
        resolve(false);
      };
      const p = audio.play();
      if (p && p.catch) {
        p.catch(function () {
          if (currentAudio === audio) currentAudio = null;
          resolve(false);
        });
      }
    });
  }

  async function playQueue(chunks, preferNative, voice) {
    speaking = true;
    for (let i = 0; i < chunks.length; i++) {
      if (!speaking) break;
      const chunk = chunks[i];
      let ok = false;
      if (preferNative && window.speechSynthesis) {
        ok = await speakNative(chunk, voice);
      }
      if (!ok && speaking) {
        ok = await speakGoogleChunk(chunk);
      }
      if (!ok && preferNative && window.speechSynthesis && speaking) {
        // last try native even without fa voice
        ok = await speakNative(chunk, null);
      }
    }
    speaking = false;
    if (keepAliveTimer) {
      clearInterval(keepAliveTimer);
      keepAliveTimer = null;
    }
  }

  window.stopSpeak = function () {
    stopAllSpeech();
  };

  window.speakText = function (text) {
    stopAllSpeech();
    const cleaned = cleanTextForSpeech(text);
    if (!cleaned || cleaned.length < 2) {
      toast('اول متن را بساز، بعد بخوان');
      return;
    }
    const fa = countPersian(cleaned);
    if (fa < 3) {
      toast('متن فارسی برای خواندن پیدا نشد');
      return;
    }
    if (window.speechSynthesis) {
      try { speechSynthesis.getVoices(); } catch (e) {}
    }
    const voice = pickPersianVoice();
    const preferNative = !!voice;
    const chunks = splitChunks(cleaned, preferNative ? 220 : 150);
    if (!preferNative) {
      toast('صدای فارسی دستگاه پیدا نشد — از خواندن آنلاین استفاده می‌شود');
    } else {
      toast('در حال خواندن... 🔊');
    }
    playQueue(chunks, preferNative, voice);
  };

  window.speakElement = function (id) {
    const el = document.getElementById(id);
    if (!el) {
      toast('متن پیدا نشد');
      return;
    }
    // Prefer textContent; strip nested noise
    let t = el.innerText || el.textContent || '';
    window.speakText(t);
  };

  /* ===== Microphone (speech recognition) ===== */
  window.startSpeech = function (inputId) {
    if (!window.isSecureContext) {
      toast('میکروفون فقط روی اتصال امن (https) کار می‌کند');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast('این مرورگر از میکروفون گفتاری پشتیبانی نمی‌کند. کروم را امتحان کن');
      return;
    }
    const input = document.getElementById(inputId);
    if (!input) {
      toast('فیلد ورودی پیدا نشد');
      return;
    }

    try {
      if (activeRec) {
        try { activeRec.stop(); } catch (e) {}
        activeRec = null;
      }
    } catch (e) {}

    const rec = new SR();
    activeRec = rec;
    rec.lang = 'fa-IR';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    let finalText = '';
    toast('دارم گوش می‌دهم... 🎤 صحبت کن');

    rec.onresult = function (e) {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      const shown = (finalText || interim).trim();
      if (shown) input.value = shown;
    };

    rec.onerror = function (e) {
      activeRec = null;
      const err = (e && e.error) || '';
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        toast('دسترسی میکروفون بسته است. از تنظیمات مرورگر اجازه بده');
      } else if (err === 'no-speech') {
        toast('صدایی نشنیدم. دوباره امتحان کن');
      } else if (err === 'network') {
        toast('برای میکروفون به اینترنت نیاز است');
      } else if (err === 'aborted') {
        /* ignore */
      } else {
        toast('خطای میکروفون: ' + (err || 'نامشخص'));
      }
    };

    rec.onend = function () {
      activeRec = null;
      if (finalText.trim()) {
        input.value = finalText.trim();
        toast('گفته‌ات نوشته شد ✅');
      }
    };

    try {
      rec.start();
    } catch (e) {
      activeRec = null;
      toast('نتوانستم میکروفون را شروع کنم');
    }
  };

  // Load voices (Chrome async)
  if (window.speechSynthesis) {
    try {
      speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function () {
        speechSynthesis.getVoices();
      };
    } catch (e) {}
  }

  // Strip model footer from API replies after ai.js defines callAPI
  function patchCallAPI() {
    if (typeof window.callAPI !== 'function') return;
    if (window.callAPI._mahyaPatched) return;
    const orig = window.callAPI;
    window.callAPI = async function () {
      const text = await orig.apply(this, arguments);
      if (typeof text === 'string') {
        return cleanTextForSpeech(text);
      }
      return text;
    };
    window.callAPI._mahyaPatched = true;
  }
  patchCallAPI();
  setTimeout(patchCallAPI, 0);
  setTimeout(patchCallAPI, 500);
})();
