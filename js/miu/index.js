// Miu, in the browser
import { profile } from "./data.js";
import { rebuildIndex } from "./lib/retrieve.js";
import { answer } from "./lib/twin.js";

rebuildIndex();
export { profile };
export const ask = (question, history = []) => answer({ question, history, profile });
