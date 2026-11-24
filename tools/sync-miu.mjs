// Copies Miu's brain from the MyTwin project into this site, so Miu can answer in the browser with no server.
// Run it after changing MyTwin:  node tools/sync-miu.mjs [path to MyTwin]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const TWIN = path.resolve(process.argv[2] || path.join(here, "..", "..", "MyTwin"));
const OUT = path.join(here, "..", "js", "miu");
const read = (p) => fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const write = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };

// The same engine files MyTwin uses, unchanged
for (const f of ["text.js", "retrieve.js", "skills.js", "twin.js"]) write(path.join(OUT, "lib", f), read(path.join(TWIN, "server", "lib", f)));

const { chunk, redactPhones } = await import(pathToFileURL(path.join(TWIN, "server", "lib", "text.js")));
// Not shown on the portfolio, so Miu doesn't bring it up here either
const SKIP = ["skincart"];
const seed = path.join(TWIN, "server", "seed");
const profile = JSON.parse(read(path.join(seed, "profile.json")));
const projects = [
  { slug: "mytwin", name: "MyTwin", tagline: "Miu, a twin AI that answers recruiters from real facts", tech: ["React", "Node.js", "Express", "SQLite", "Gemini"], repo: "https://github.com/Megharaykar27/MyTwin", aliases: ["my twin", "ai twin"] },
  ...JSON.parse(read(path.join(seed, "projects.json"))).filter((p) => !SKIP.includes(p.slug)),
].map((p, i) => ({ demo: null, cover: null, ...p, featured: true, sort: i }));

const docs = [{ id: "resume", source: "resume", title: "Resume", url: null, project: null, body: read(path.join(seed, "resume.md")).replace(/## Project: SkinCart[\s\S]*?(?=\n## )/, "") }];
for (const p of projects) {
  const f = p.slug === "mytwin" ? path.join(TWIN, "README.md") : path.join(seed, "readmes", `${p.name}.md`);
  if (fs.existsSync(f)) docs.push({ id: `gh-${p.slug}`, source: "github", title: p.name, url: p.repo, project: p.slug, body: read(f) });
}
let id = 0;
const chunks = docs.flatMap((d) => chunk(redactPhones(d.body), d.title).map((c) => ({ id: ++id, heading: c.heading, text: c.text, doc_id: d.id, title: d.title, source: d.source, url: d.url, project: d.project })));
write(path.join(OUT, "data.js"), `// Made by tools/sync-miu.mjs. Don't edit by hand.\nexport const profile = ${JSON.stringify(profile, null, 1)};\nexport const projects = ${JSON.stringify(projects, null, 1)};\nexport const chunks = ${JSON.stringify(chunks, null, 1)};\n`);

// Small browser stand-ins for the parts that need a server in MyTwin
write(path.join(OUT, "lib", "db.js"), `// Browser stand-in for MyTwin's database: the same few questions, answered from data.js
import { chunks, projects } from "../data.js";

export function all(sql, param) {
  if (sql.includes("FROM projects")) return projects.map((p) => ({ ...p, aliases: JSON.stringify(p.aliases || []) }));
  if (sql.includes("d.source = 'resume'")) return chunks.filter((c) => c.source === "resume");
  if (sql.includes("d.project = ?")) return chunks.filter((c) => c.project === param).slice(0, 1);
  return chunks;
}
`);
write(path.join(OUT, "lib", "knowledge.js"), `import { projects } from "../data.js";\n\nexport const listProjects = () => projects;\n`);
write(path.join(OUT, "providers", "gemini.js"), `// No AI key in the browser: Miu answers straight from the facts (basic mode)\nexport const geminiOn = false;\nexport const explainGeminiError = () => "";\nexport async function* stream() {}\n`);
write(path.join(OUT, "index.js"), `// Miu, in the browser
import { profile } from "./data.js";
import { rebuildIndex } from "./lib/retrieve.js";
import { answer } from "./lib/twin.js";

rebuildIndex();
export { profile };
export const ask = (question, history = []) => answer({ question, history, profile });
`);
console.log(`Miu knows ${docs.length} documents in ${chunks.length} pieces.`);
