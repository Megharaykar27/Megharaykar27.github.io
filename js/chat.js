// The chat with Miu. The engine is loaded only when someone needs it.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((ok) => setTimeout(ok, reduce ? 0 : ms));
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };
const MAIL = "megharaykar04@gmail.com";
const SUGGESTED = ["Tell me about Megha", "What projects has she built?", "What is her tech stack?", "Tell me about her internship", "Why should we hire Megha?", "What does she do for fun?"];

let engine;
const load = () => (engine ||= import("./miu/index.js").catch((e) => { engine = null; throw e; }));

// **bold**, links and [n] source numbers, built as safe text nodes
function inline(parent, text, onSource, sources) {
  for (const part of text.split(/(\*\*[^*]+\*\*|\[\d+\]|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]*\w)/g)) {
    if (!part) continue;
    const src = /^\[(\d+)\]$/.exec(part);
    if (part.startsWith("**")) parent.append(el("strong", "", part.slice(2, -2)));
    else if (src) {
      const s = sources.find((x) => x.n === Number(src[1]));
      if (!s) continue;
      const b = el("button", "cite", src[1]);
      b.type = "button";
      b.setAttribute("aria-label", `Source: ${s.title}, ${s.heading}`);
      b.addEventListener("click", () => onSource(s));
      parent.append(b);
    } else if (/^https?:/.test(part)) { const a = el("a", "", part.replace(/^https?:\/\/(www\.)?/, "")); a.href = part; a.target = "_blank"; a.rel = "noopener"; parent.append(a); }
    else if (/^[\w.+-]+@/.test(part)) { const a = el("a", "", part); a.href = `mailto:${part}`; parent.append(a); }
    else parent.append(part);
  }
}

function render(box, text, sources, onSource) {
  box.textContent = "";
  let list = null;
  for (const line of text.split("\n")) {
    if (!line.trim()) { list = null; continue; }
    const li = /^\s*-\s+(.*)/.exec(line);
    if (li) { if (!list) { list = el("ul"); box.append(list); } const item = el("li"); inline(item, li[1], onSource, sources); list.append(item); }
    else { list = null; const p = el("p"); inline(p, line, onSource, sources); box.append(p); }
  }
}

// Leftovers of README tables don't read well in a chat
const tidy = (t) => t.split("\n").filter((l) => (l.match(/ · /g) || []).length < 3 || l.startsWith("-")).map((l) => l.replace(/\s{2,}/g, " ")).join("\n").trim() || t;

export function mountChat(root, { onProject } = {}) {
  root.innerHTML = `<header><span class="miu-face" aria-hidden="true"></span><div><b>Miu</b><small>Megha's twin AI</small></div><button type="button" class="reset" aria-label="Start a new chat">New chat</button></header>
    <div class="log" tabindex="0" role="log" aria-label="Chat with Miu" aria-live="polite"></div>
    <div class="ideas"></div>
    <form><input type="text" maxlength="300" autocomplete="off" aria-label="Ask Miu a question" placeholder="Ask Miu about Megha..."><button type="submit" aria-label="Send">Send</button></form>`;
  const log = root.querySelector(".log"), form = root.querySelector("form"), input = root.querySelector("input"), ideas = root.querySelector(".ideas"), face = root.querySelector(".miu-face");
  let history = [], busy = false, run = 0;

  const bottom = () => { log.scrollTop = log.scrollHeight; };
  const bubble = (who) => { const b = el("div", `msg ${who}`); log.append(b); return b; };
  const hello = () => {
    log.textContent = "";
    history = [];
    render(bubble("miu"), "Hi! I'm **Miu**, Megha's twin AI. Ask me about her projects, skills, studies or hobbies. If I don't know something, I'll say so.", [], () => {});
  };
  for (const q of SUGGESTED) { const b = el("button", "idea", q); b.type = "button"; b.addEventListener("click", () => send(q)); ideas.append(b); }

  async function send(raw) {
    const q = raw.trim().slice(0, 300);
    if (!q || busy) return;
    busy = true;
    const mine = ++run;
    input.value = "";
    bubble("you").textContent = q;
    const b = bubble("miu");
    b.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
    face.classList.add("thinking");
    bottom();
    try {
      const [{ ask }] = await Promise.all([load(), wait(520)]);
      const a = await ask(q, history);
      if (mine !== run) return;
      const text = tidy(a.text);
      const show = (s) => { let box = b.querySelector(".source"); if (!box) { box = el("div", "source"); b.append(box); } box.textContent = ""; box.append(el("b", "", `${s.title}: ${s.heading}`), el("span", "", s.snippet)); bottom(); };
      const words = text.split(/(?<=\s)/);
      face.classList.replace("thinking", "speaking");
      for (let i = 3; i < words.length; i += 3) { render(b, words.slice(0, i).join("").replace(/\*\*[^*]*$|\[\d*$/, ""), [], show); bottom(); await wait(26); if (mine !== run) return; }
      render(b, text, a.sources, show);
      if (a.sources.length) { const from = el("p", "from", `From: ${[...new Set(a.sources.map((s) => (s.source === "github" ? `${s.title} README` : s.title)))].join(", ")}`); b.append(from); }
      if (a.projects.length) {
        const row = el("div", "chips");
        for (const p of a.projects) { const c = el("button", "chip", `Open ${p.name}`); c.type = "button"; c.addEventListener("click", () => onProject?.(p.slug)); row.append(c); }
        b.append(row);
      }
      if (a.unanswered) { const m = el("a", "chip solid", "Email Megha this question"); m.href = `mailto:${MAIL}?subject=${encodeURIComponent("A question from your portfolio")}&body=${encodeURIComponent(q)}`; b.append(m); }
      history = [...history, { role: "user", text: q }, { role: "twin", text }].slice(-6);
    } catch {
      if (mine === run) render(b, `Sorry, I couldn't load my notes. Please email ${MAIL} instead.`, [], () => {});
    } finally {
      if (mine === run) { busy = false; face.classList.remove("thinking", "speaking"); bottom(); }
    }
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); send(input.value); });
  root.querySelector(".reset").addEventListener("click", () => { run++; busy = false; face.classList.remove("thinking", "speaking"); hello(); input.focus({ preventScroll: true }); });
  hello();
  return { send, focus: () => input.focus({ preventScroll: true }), warm: () => load().catch(() => {}) };
}
