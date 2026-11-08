// Nav state + theme
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('solid', scrollY > innerHeight * 0.7);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

const root = document.documentElement;
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
document.getElementById('theme').addEventListener('click', () => {
  const dark = matchMedia('(prefers-color-scheme: dark)').matches;
  const cur = root.dataset.theme || (dark ? 'dark' : 'light');
  const next = cur === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});
document.getElementById('y').textContent = new Date().getFullYear();

// Hero: simulated AFM raster scan of a membrane-like surface (stacked line profiles)
(() => {
  const c = document.getElementById('afm'), g = c.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, dpr, t = 0;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = c.clientWidth; H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  addEventListener('resize', resize); resize();

  // height function: ring-like protein assemblies + soft background, drifting slowly
  const h = (x, y, t) => {
    const a = Math.sin(x * 0.011 + t * 0.4) * Math.cos(y * 0.014 - t * 0.3) * 6;
    let s = a;
    for (let i = 0; i < 5; i++) {
      const cx = (0.15 + 0.17 * i) * W + Math.sin(t * 0.2 + i) * 30;
      const cy = (0.35 + 0.12 * ((i * 3) % 5)) * H + Math.cos(t * 0.25 + i * 2) * 20;
      const r = Math.hypot(x - cx, y - cy);
      s += 26 * Math.exp(-Math.pow((r - 70) / 18, 2)) - 6 * Math.exp(-Math.pow(r / 40, 2));
    }
    return s;
  };

  const draw = () => {
    g.clearRect(0, 0, W, H);
    const rows = 46, step = 5, gap = H / rows * 1.15, top = H * 0.12;
    const scanRow = (t * 6) % (rows + 10);
    for (let r = 0; r < rows; r++) {
      const y0 = top + r * gap;
      g.beginPath();
      for (let x = 0; x <= W; x += step) {
        const y = y0 - h(x, y0, t);
        x ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      const hot = Math.abs(r - scanRow) < 1.2;
      g.strokeStyle = hot ? 'rgba(46,230,207,0.95)' : `rgba(120,170,255,${0.10 + 0.22 * (r / rows)})`;
      g.lineWidth = hot ? 1.8 : 1;
      g.stroke();
    }
  };
  const loop = () => { t += 0.012; draw(); if (!reduce) requestAnimationFrame(loop); };
  loop();
})();

// Mobile menu
(() => {
  const b = document.getElementById('menu'), n = document.getElementById('links');
  const set = o => { n.classList.toggle('open', o); b.setAttribute('aria-expanded', o); };
  b.addEventListener('click', () => set(!n.classList.contains('open')));
  n.addEventListener('click', e => { if (e.target.tagName === 'A') set(false); });
})();
