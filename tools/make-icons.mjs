// Generates PWA icons (PNG) without dependencies: gradient rounded square + play button + star.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT = new URL('../assets/icons/', import.meta.url);
mkdirSync(OUT, { recursive: true });

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]);
}

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => c1.map((v, i) => lerp(v, c2[i], t));
const PURPLE = [124, 92, 255], CYAN = [34, 211, 238], PINK = [255, 77, 141], WHITE = [255, 255, 255], YELLOW = [250, 204, 21], NAVY = [11, 15, 30];

function insideRoundedRect(x, y, s, r) {
  const cx = Math.min(Math.max(x, r), s - r), cy = Math.min(Math.max(y, r), s - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}
function insideTriangle(px, py, [ax, ay], [bx, by], [cx, cy]) {
  const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
  const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
  const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}
function insideStar(px, py, cx, cy, R, r) {
  const a = Math.atan2(py - cy, px - cx), d = Math.hypot(px - cx, py - cy);
  const k = ((a + Math.PI / 2) % (Math.PI * 2 / 5) + Math.PI * 2 / 5) % (Math.PI * 2 / 5);
  const t = Math.abs(k - Math.PI / 5) / (Math.PI / 5);
  return d <= lerp(r, R, t);
}

function render(size, { maskable = false }) {
  const buf = Buffer.alloc(size * size * 4);
  const pad = maskable ? size * 0.1 : 0;
  const radius = maskable ? 0 : size * 0.22;
  const ss = 3; // supersampling
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let acc = [0, 0, 0, 0];
    for (let sy = 0; sy < ss; sy++) for (let sx = 0; sx < ss; sx++) {
      const px = x + (sx + 0.5) / ss, py = y + (sy + 0.5) / ss;
      let color = null;
      if (maskable || insideRoundedRect(px, py, size, radius)) {
        const t = (px + py) / (2 * size);
        color = mix(PURPLE, CYAN, t);
        // subtle pink glow top-right
        const g = Math.max(0, 1 - Math.hypot(px - size * 0.85, py - size * 0.15) / (size * 0.5));
        color = mix(color, PINK, g * 0.35);
        if (maskable) color = mix(color, NAVY, 0.0);
      }
      if (color) {
        const c = size / 2, R = size * 0.30 - pad * 0.5;
        const dist = Math.hypot(px - c, py - c);
        if (dist <= R) {
          color = WHITE;
          const tri = [[c - R * 0.32, c - R * 0.5], [c - R * 0.32, c + R * 0.5], [c + R * 0.5, c]];
          if (insideTriangle(px, py, ...tri)) color = mix(PURPLE, PINK, 0.4);
        }
        if (insideStar(px, py, size * 0.78 - pad * 0.6, size * 0.24 + pad * 0.6, size * 0.11, size * 0.05)) color = YELLOW;
        acc[0] += color[0]; acc[1] += color[1]; acc[2] += color[2]; acc[3] += 255;
      }
    }
    const i = (y * size + x) * 4, n = ss * ss;
    const a = acc[3] / n;
    buf[i] = a ? acc[0] / (acc[3] / 255) : 0;
    buf[i + 1] = a ? acc[1] / (acc[3] / 255) : 0;
    buf[i + 2] = a ? acc[2] / (acc[3] / 255) : 0;
    buf[i + 3] = a;
  }
  return png(size, size, buf);
}

writeFileSync(new URL('icon-192.png', OUT), render(192, {}));
writeFileSync(new URL('icon-512.png', OUT), render(512, {}));
writeFileSync(new URL('icon-maskable-512.png', OUT), render(512, { maskable: true }));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c5cff"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>
<rect width="100" height="100" rx="22" fill="url(#g)"/>
<circle cx="50" cy="50" r="30" fill="#fff"/>
<path d="M40 35 L40 65 L65 50 Z" fill="#a04ee0"/>
<path d="M78 14 l3.2 6.6 7.2 1-5.2 5.1 1.2 7.2-6.4-3.4-6.4 3.4 1.2-7.2-5.2-5.1 7.2-1z" fill="#facc15"/>
</svg>`;
writeFileSync(new URL('icon.svg', OUT), svg);
console.log('icons written to assets/icons/');
