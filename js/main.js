import { mountChat } from "./chat.js";
import { ALSO, NOTES, PROJECTS, SKILLS } from "./content.js";
import { flower } from "./flower.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const bySlug = new Map(PROJECTS.map((p) => [p.slug, p]));

/* ------------------------------------------------ hero bloom */
$("#bloom").innerHTML = flower({ petals: 13, layers: 4, hue: "rose" });
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("ready")));

/* ------------------------------------------------ project plates */
$("#plates").innerHTML = PROJECTS.map((p, i) => `
  <article class="plate${p.image ? "" : " no-shot"}" data-in data-slug="${p.slug}">
    <button type="button" class="plate-open" data-case="${p.slug}" aria-label="Open ${p.name}">
      <span class="plate-arch">
        ${flower({ ...p.flower, stem: !p.image })}
        ${p.image ? `<img src="${p.image}" alt="" loading="lazy" width="1100" height="688">` : ""}
      </span>
    </button>
    <div class="plate-text">
      <p class="plate-no">Plate ${ROMAN[i]} <i>${p.by}</i></p>
      <h3>${p.name}</h3>
      <p>${p.tagline}</p>
      <p class="plate-tech">${p.tech.slice(0, 4).join(" · ")}</p>
    </div>
  </article>`).join("");

const dialog = $("#case");
function openCase(slug) {
  const p = bySlug.get(slug);
  if (!p) return;
  dialog.innerHTML = `<div class="case-in">
    <button type="button" class="case-close" aria-label="Close">Close</button>
    <p class="plate-no">Plate ${ROMAN[PROJECTS.indexOf(p)]} <i>${p.by}</i></p>
    <h2 id="case-h">${p.name}</h2><p class="case-tag">${p.tagline}</p>
    <div class="case-art">${p.image ? `<img src="${p.image}" alt="Screenshot of ${p.name}" width="1100" height="688">` : flower({ ...p.flower, stem: false })}</div>
    <div class="case-cols">
      <section><h3>The seed</h3><p>${p.seed}</p></section>
      <section><h3>How it grew</h3><p>${p.grew}</p></section>
      <section class="wide"><h3>In bloom</h3><ul>${p.bloom.map((b) => `<li>${b}</li>`).join("")}</ul></section>
    </div>
    <p class="case-tech">${p.tech.map((t) => `<span>${t}</span>`).join("")}</p>
    <div class="row">${p.repo ? `<a class="btn btn-fill" href="${p.repo}" target="_blank" rel="noopener">See the code</a>` : ""}<button type="button" class="btn btn-line" data-ask="Tell me about ${p.name}">Ask Miu about it</button></div>
  </div>`;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}
dialog.addEventListener("click", (e) => { if (e.target === dialog || e.target.closest(".case-close")) dialog.close(); });

/* ------------------------------------------------ Miu */
const chat = mountChat($("#chat"), { onProject: openCase });
const goMiu = (question) => {
  if (dialog.open) dialog.close();
  $("#miu").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  setTimeout(() => { if (question) chat.send(question); else chat.focus(); }, reduce ? 0 : 750);
};
document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-case]"), m = e.target.closest("[data-miu]"), a = e.target.closest("[data-ask]");
  if (c) openCase(c.dataset.case);
  else if (m) goMiu();
  else if (a) goMiu(a.dataset.ask);
});
new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { chat.warm(); o.disconnect(); } }), { rootMargin: "600px" }).observe($("#miu"));
new IntersectionObserver(([e]) => document.body.classList.toggle("miu-seen", e.isIntersecting), { threshold: 0.15 }).observe($("#miu"));

/* ------------------------------------------------ skills */
$("#skill-grid").innerHTML = SKILLS.map(([g, list]) => `<div class="skill-col" data-in><h3>${g}</h3><ul>${list.map((s) => `<li><button type="button" class="skill" aria-pressed="false">${s}</button></li>`).join("")}</ul></div>`).join("");
const note = $("#skill-note");
function showSkill(btn) {
  const s = btn.textContent;
  $$(".skill").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
  const used = PROJECTS.filter((p) => p.tech.includes(s) || ALSO[s]?.includes(p.slug));
  note.textContent = "";
  if (!used.length) { note.textContent = `${s}: ${NOTES[s] || "part of my studies."}`; return; }
  note.append(`${s} grew in `);
  used.forEach((p, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "link"; b.dataset.case = p.slug; b.textContent = p.name;
    note.append(b, i < used.length - 2 ? ", " : i === used.length - 2 ? " and " : ".");
  });
}
$$(".skill").forEach((b) => { b.addEventListener("click", () => showSkill(b)); if (fine) b.addEventListener("pointerenter", () => showSkill(b)); });

/* ------------------------------------------------ reveal on scroll */
$$("[data-words]").forEach((q) => { q.innerHTML = q.textContent.split(" ").map((w, i) => `<span style="--i:${i}">${w}</span>`).join(" "); });
const seen = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  seen.unobserve(e.target);
  $$("[data-count]", e.target).forEach((n) => {
    if (reduce) return;
    const to = Number(n.dataset.count), t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 1100); n.textContent = Math.round(to * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}), { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
$$("[data-in], [data-words]").forEach((e) => seen.observe(e));

const links = $$(".nav nav a");
const spy = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => { const on = a.hash === `#${e.target.id}`; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); }); }), { rootMargin: "-45% 0px -50% 0px" });
$$("section[id]").forEach((s) => spy.observe(s));

/* ------------------------------------------------ the vine that grows with the scroll */
const vine = $(".vine"), bar = $(".progress i");
let stem = null, length = 0, leaves = [];
function growVine() {
  const h = innerHeight - 72;
  if (innerWidth < 1240 || reduce) { vine.innerHTML = ""; stem = null; return; }
  vine.setAttribute("viewBox", `0 0 84 ${h}`);
  let d = "M42 -10", y = -10, side = 1;
  const step = 92, pts = [];
  while (y < h - 40) { const ny = y + step; d += `C${42 + 18 * side} ${y + step * 0.34} ${42 + 18 * side} ${y + step * 0.66} 42 ${ny}`; pts.push([42 + 13 * side, y + step * 0.5, side]); y = ny; side *= -1; }
  vine.innerHTML = `<path class="vine-stem" d="${d}"/>` + pts.map(([x, ly, s], i) => `<g class="vine-leaf" transform="translate(${x} ${ly}) rotate(${s > 0 ? 58 : -58})"><path d="M0 0C-8 -8 -8 -22 0 -30C8 -22 8 -8 0 0Z"/></g>${i % 3 === 2 ? `<g class="vine-bud" transform="translate(42 ${ly + 46})">${[0, 72, 144, 216, 288].map((a) => `<ellipse rx="4.4" ry="7" cy="-6.5" transform="rotate(${a})"/>`).join("")}<circle r="2.6"/></g>` : ""}`).join("");
  stem = $(".vine-stem", vine);
  length = stem.getTotalLength();
  stem.style.strokeDasharray = length;
  leaves = $$(".vine-leaf, .vine-bud", vine).map((g) => ({ g, at: Number(/translate\(\S+ ([\d.]+)/.exec(g.getAttribute("transform"))[1]) / h }));
  onScroll();
}
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight, k = max > 0 ? Math.min(1, scrollY / max) : 0;
  bar.style.transform = `scaleX(${k})`;
  document.body.classList.toggle("scrolled", scrollY > 40);
  if (!stem) return;
  stem.style.strokeDashoffset = length * (1 - Math.max(0.06, k));
  for (const l of leaves) l.g.classList.toggle("open", l.at < Math.max(0.06, k));
}
addEventListener("scroll", onScroll, { passive: true });
let resizing; addEventListener("resize", () => { clearTimeout(resizing); resizing = setTimeout(growVine, 150); });
growVine();
onScroll();

/* ------------------------------------------------ falling petals behind the quote */
if (!reduce) $(".petals").innerHTML = Array.from({ length: 14 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${9 + (i % 5) * 2}s;--w:${-(i * 1.7).toFixed(1)}s;--s:${0.6 + (i % 4) * 0.22}"></i>`).join("");

/* ------------------------------------------------ pointer: soft cursor, flower parallax, tilt */
if (fine && !reduce) {
  const cursor = $(".cursor"), art = $(".hero-art");
  let x = 0, y = 0, cx = 0, cy = 0;
  addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; document.body.classList.add("has-pointer"); cursor.classList.toggle("big", !!e.target.closest?.("a, button, input")); }, { passive: true });
  const loop = () => {
    cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    if (scrollY < innerHeight) { art.style.setProperty("--px", ((cx / innerWidth - 0.5) * 2).toFixed(3)); art.style.setProperty("--py", ((cy / innerHeight - 0.5) * 2).toFixed(3)); }
    requestAnimationFrame(loop);
  };
  loop();
  $$(".plate-arch").forEach((p) => {
    p.addEventListener("pointermove", (e) => { const r = p.getBoundingClientRect(); p.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -6}deg`); p.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 6}deg`); });
    p.addEventListener("pointerleave", () => { p.style.removeProperty("--rx"); p.style.removeProperty("--ry"); });
  });
}

/* ------------------------------------------------ the dancing ribbon */
const canvas = $("#ribbon"), stage = $(".dance"), ctx = canvas.getContext("2d");
let W = 0, H = 0, dpr = 1, on = false, target = null, t = 0, raf = 0;
const N = 64, SEG = 13;
let pts = [];
function size() {
  dpr = Math.min(2, devicePixelRatio || 1);
  W = stage.clientWidth; H = stage.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  if (!pts.length) pts = Array.from({ length: N }, (_, i) => ({ x: W * 0.5 - i * 6, y: H * 0.5 }));
}
function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  t += 0.016;
  // With nobody leading, the ribbon dances a figure of eight on its own
  const lead = target || { x: W * (0.5 + 0.36 * Math.sin(t * 1.1)), y: H * (0.5 + 0.28 * Math.sin(t * 2.2)) };
  pts[0].x += (lead.x - pts[0].x) * 0.14;
  pts[0].y += (lead.y - pts[0].y) * 0.14;
  const seg = Math.min(SEG, W / 46);
  for (let i = 1; i < N; i++) { // every piece keeps its distance, like silk on a stick
    const p = pts[i], q = pts[i - 1];
    p.y += Math.sin(t * 3 + i * 0.22) * 0.5;
    const dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy) || 1;
    if (d > seg) { p.x = q.x + (dx / d) * seg; p.y = q.y + (dy / d) * seg; }
  }
  ribbon();
  if (on) raf = requestAnimationFrame(draw);
}
// A ribbon that twists: each piece is a small band, rose on one side and blush on the other
function ribbon() {
  const edge = pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N - 1, i + 1)], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
    const twist = Math.cos(i * 0.2 - t * 1.6), w = (6 + 24 * Math.sin((Math.PI * (i + 3)) / (N + 4))) * twist;
    return { ax: p.x - (dy / d) * w, ay: p.y + (dx / d) * w, bx: p.x + (dy / d) * w, by: p.y - (dx / d) * w, twist };
  });
  for (let i = N - 1; i > 0; i--) {
    const p = edge[i - 1], q = edge[i], k = (p.twist + 1) / 2;
    const mix = (a, b) => Math.round(a + (b - a) * k);
    ctx.fillStyle = ctx.strokeStyle = `rgb(${mix(243, 190)},${mix(206, 92)},${mix(206, 110)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.ax, p.ay); ctx.lineTo(q.ax, q.ay); ctx.lineTo(q.bx, q.by); ctx.lineTo(p.bx, p.by);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
}
size();
addEventListener("resize", size);
if (reduce) { pts = pts.map((_, i) => ({ x: W * (0.15 + (0.7 * i) / N), y: H * (0.5 + 0.22 * Math.sin(i * 0.28)) })); t = 1; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ribbon(); } else {
  stage.addEventListener("pointermove", (e) => { const r = stage.getBoundingClientRect(); target = { x: e.clientX - r.left, y: e.clientY - r.top }; }, { passive: true });
  stage.addEventListener("pointerleave", () => { target = null; });
  stage.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") target = null; });
  stage.addEventListener("pointercancel", () => { target = null; });
  new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); on = e.isIntersecting; if (on) draw(); }).observe(stage);
}

/* ------------------------------------------------ contact */
const toast = $(".toast");
let hide;
$("#copy").addEventListener("click", async () => {
  let text = "Email copied";
  try { await navigator.clipboard.writeText("megharaykar04@gmail.com"); } catch { text = "Couldn't copy. The address is megharaykar04@gmail.com"; }
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(hide);
  hide = setTimeout(() => toast.classList.remove("show"), 2200);
});
$("#year").textContent = new Date().getFullYear();
