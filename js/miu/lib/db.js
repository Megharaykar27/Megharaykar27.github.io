// Browser stand-in for MyTwin's database: the same few questions, answered from data.js
import { chunks, projects } from "../data.js";

export function all(sql, param) {
  if (sql.includes("FROM projects")) return projects.map((p) => ({ ...p, aliases: JSON.stringify(p.aliases || []) }));
  if (sql.includes("d.source = 'resume'")) return chunks.filter((c) => c.source === "resume");
  if (sql.includes("d.project = ?")) return chunks.filter((c) => c.project === param).slice(0, 1);
  return chunks;
}
