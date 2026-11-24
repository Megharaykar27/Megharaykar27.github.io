// Draws flowers as SVG: no images, every plate gets its own
const HUES = {
  rose: ["#B9576A", "#D98C99", "#EFC3C6", "#F8E1DF"],
  blush: ["#D9929C", "#E9B7BB", "#F3D3D2", "#FBECE8"],
  gold: ["#C79A5B", "#DDBB85", "#EBD5AE", "#F7EBD3"],
  sage: ["#6F8E76", "#93AD97", "#B9CBB7", "#DDE6D8"],
};

// One petal pointing up from the centre (0,0)
const petal = (len, w) => `M0 0C${-w} ${-len * 0.28} ${-w * 0.95} ${-len * 0.82} 0 ${-len}C${w * 0.95} ${-len * 0.82} ${w} ${-len * 0.28} 0 0Z`;
const vein = (len) => `M0 ${-len * 0.12}L0 ${-len * 0.82}`;

export function flower({ petals = 8, layers = 3, hue = "rose", stem = true } = {}) {
  const c = HUES[hue] || HUES.rose;
  let out = "";
  for (let l = 0; l < layers; l++) {
    const k = layers === 1 ? 1 : 1 - (l / layers) * 0.62;
    const len = 92 * k, n = Math.max(4, petals - l), w = Math.min(40, (Math.PI * len) / n) * 0.82 + 5;
    const fill = c[Math.max(0, c.length - 1 - l - (4 - Math.max(layers, 2)) )] || c[0];
    let ring = "";
    for (let i = 0; i < n; i++) ring += `<g class="petal" style="--a:${((360 / n) * i + l * (180 / n)).toFixed(1)}deg;--i:${l * 3 + i}"><path d="${petal(len, w)}" fill="${fill}" stroke="${c[0]}" stroke-opacity=".34" stroke-width=".7"/><path d="${vein(len)}" fill="none" stroke="${c[0]}" stroke-opacity=".28" stroke-width=".6"/></g>`;
    out += `<g class="layer" style="--l:${l}">${ring}</g>`;
  }
  let seeds = "";
  for (let i = 0; i < 18; i++) { const a = i * 2.4, r = 2.1 * Math.sqrt(i); seeds += `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="1.35" fill="${i % 3 ? "#C6A15F" : "#8C6A34"}"/>`; }
  const green = stem ? `<g class="stem" fill="none" stroke="#4B6B55" stroke-width="2.4" stroke-linecap="round"><path pathLength="1" d="M0 20C6 90 -10 150 4 250"/></g>
    <g class="leaf" style="--a:-62deg;--x:-1px;--y:128px"><path d="${petal(74, 19)}" fill="#7E9A80"/><path d="${vein(74)}" stroke="#3C5C46" stroke-width=".8"/></g>
    <g class="leaf" style="--a:58deg;--x:-2px;--y:172px"><path d="${petal(64, 17)}" fill="#8FA890"/><path d="${vein(64)}" stroke="#3C5C46" stroke-width=".8"/></g>` : "";
  return `<svg class="flower" viewBox="${stem ? "-110 -110 220 370" : "-104 -104 208 208"}" aria-hidden="true">${green}<g class="head">${out}<g class="seeds">${seeds}</g></g></svg>`;
}
