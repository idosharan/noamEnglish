// Lightweight confetti on a fixed canvas (#confetti)
const COLORS = ['#ff4d8d', '#7c5cff', '#22d3ee', '#facc15', '#4ade80', '#fb923c'];
let particles = [];
let raf = 0;

function canvas() {
  const c = document.getElementById('confetti');
  if (!c) return null;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if (c.width !== innerWidth * dpr || c.height !== innerHeight * dpr) {
    c.width = innerWidth * dpr;
    c.height = innerHeight * dpr;
    c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  return c;
}

export function burst({ count = 80, x = innerWidth / 2, y = innerHeight / 3 } = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = canvas();
  if (!c) return;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = 4 + Math.random() * 7;
    particles.push({
      x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4,
      size: 5 + Math.random() * 6, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      color: COLORS[i % COLORS.length], life: 90 + Math.random() * 40,
    });
  }
  if (!raf) raf = requestAnimationFrame(step);
}

function step() {
  const c = canvas();
  const g = c.getContext('2d');
  g.clearRect(0, 0, innerWidth, innerHeight);
  particles = particles.filter((p) => p.life > 0 && p.y < innerHeight + 20);
  for (const p of particles) {
    p.vy += 0.22; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
    g.save();
    g.translate(p.x, p.y);
    g.rotate(p.rot);
    g.globalAlpha = Math.min(1, p.life / 30);
    g.fillStyle = p.color;
    g.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    g.restore();
  }
  raf = particles.length ? requestAnimationFrame(step) : 0;
}
