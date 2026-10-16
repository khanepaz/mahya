/* Backup helpers for parent panel */
function exportBackup() {
  try {
    const payload = {
      app: 'mahya',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        stars: state.stars,
        avatar: state.avatar,
        paintings: state.paintings,
        stories: state.stories,
        poems: state.poems,
        ideas: state.ideas,
        dreams: state.dreams,
        schedule: state.schedule
      }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mahya-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    toast('فایل پشتیبان آماده شد');
  } catch (e) {
    console.error(e);
    toast('خروجی پشتیبان ممکن نشد');
  }
}

function importBackup(input) {
  const file = input && input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    try {
      const parsed = JSON.parse(ev.target.result);
      const data = parsed.data || parsed;
      if (!confirm('داده‌های فعلی با پشتیبان جایگزین شود؟')) {
        input.value = '';
        return;
      }
      if (data.stars != null) state.stars = data.stars;
      if (data.avatar) state.avatar = data.avatar;
      if (Array.isArray(data.paintings)) state.paintings = data.paintings;
      if (Array.isArray(data.stories)) state.stories = data.stories;
      if (Array.isArray(data.poems)) state.poems = data.poems;
      if (Array.isArray(data.ideas)) state.ideas = data.ideas;
      if (Array.isArray(data.dreams)) state.dreams = data.dreams;
      if (Array.isArray(data.schedule)) state.schedule = data.schedule;
      saveState();
      document.getElementById('starsCount').textContent = state.stars;
      document.getElementById('avatarBtn').textContent = state.avatar;
      toast('پشتیبان بازیابی شد');
      if (typeof renderArtGallery === 'function') renderArtGallery();
      if (typeof renderTreasure === 'function') renderTreasure();
    } catch (e) {
      console.error(e);
      toast('فایل پشتیبان نامعتبر است');
    }
    input.value = '';
  };
  reader.readAsText(file);
}
