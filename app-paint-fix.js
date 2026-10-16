/* Touch-friendly canvas with multi-step undo (overrides part1 paint functions) */
let canvas, ctx, painting = false, color = '#e91e8c', brush = 8;
let paths = [];          // history of strokes
let currentPath = [];
let canvasCssW = 300, canvasCssH = 320;
const MAX_UNDO = 25;

function initCanvas() {
  canvas = document.getElementById('paintCanvas');
  if (!canvas) return;
  const cssW = canvas.clientWidth || (canvas.parentElement && canvas.parentElement.clientWidth) || 300;
  const cssH = canvas.clientHeight || 320;
  // Re-init only when size changes
  if (ctx && canvasCssW === cssW && canvasCssH === cssH && canvas.width) return;
  canvasCssW = cssW;
  canvasCssH = cssH;
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, cssW, cssH);
  canvas.style.touchAction = 'none';
  canvas.onpointerdown = startPaint;
  canvas.onpointermove = movePaint;
  canvas.onpointerup = endPaint;
  canvas.onpointercancel = endPaint;
  canvas.onpointerleave = endPaint;
}

function setColor(el) {
  document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  color = el.dataset.c || '#e91e8c';
}

function startPaint(e) {
  e.preventDefault();
  try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
  painting = true;
  currentPath = [];
  const p = pos(e);
  brush = +(document.getElementById('brushSize') || {}).value || 8;
  currentPath.push({ x: p.x, y: p.y, c: color, s: brush });
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
}

function movePaint(e) {
  if (!painting) return;
  e.preventDefault();
  const p = pos(e);
  brush = +(document.getElementById('brushSize') || {}).value || 8;
  currentPath.push({ x: p.x, y: p.y, c: color, s: brush });
  ctx.strokeStyle = color;
  ctx.lineWidth = brush;
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
}

function endPaint(e) {
  if (painting && currentPath.length > 1) {
    paths.push(currentPath);
    if (paths.length > MAX_UNDO) paths.shift();
  }
  painting = false;
  currentPath = [];
  if (e && e.pointerId != null) {
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
  }
}

function pos(e) {
  const r = canvas.getBoundingClientRect();
  const scaleX = canvasCssW / (r.width || 1);
  const scaleY = canvasCssH / (r.height || 1);
  return {
    x: (e.clientX - r.left) * scaleX,
    y: (e.clientY - r.top) * scaleY
  };
}

function redrawAll() {
  if (!ctx) return;
  const dpr = canvas.width / canvasCssW;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvasCssW, canvasCssH);
  paths.forEach(path => {
    if (!path || path.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = path[0].c;
    ctx.lineWidth = path[0].s;
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
    ctx.stroke();
  });
}

function clearCanvas() {
  if (!confirm('بوم پاک شود؟')) return;
  paths = [];
  currentPath = [];
  redrawAll();
}

function undoPaint() {
  if (!paths.length) {
    if (typeof toast === 'function') toast('چیزی برای برگشت نیست');
    return;
  }
  paths.pop();
  redrawAll();
}
