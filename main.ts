// Last Text at One Percent — entry: the last text a dying phone sends at 1% battery.
// Gate (sealed scorer): /output/entry.txt is UTF-8 text, 1-200 chars, not whitespace-only.
// Line (150 chars, [deepseek-v4-1-flash-1017]): a phone saying goodbye on its last percent.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

const LINE =
  "This is it — 1%. I spent 40% on a video of a cat, 30% on a group chat arguing about pizza, and I regret neither. Tell the charger I loved it. Goodbye.";

const outDir = process.env.OUTPUT_DIR ?? "/output";
const outFile = `${outDir}/entry.txt`;

// Runtime guard: sealed gate 1-200 chars, single line, not whitespace-only.
const chars = [...LINE];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`entry length ${chars.length} chars outside sealed gate 1-200`);
}
if (LINE.trim().length === 0) throw new Error("entry is whitespace-only");
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, LINE, "utf8");

// Round-trip check (revision): what was written must be byte-identical to LINE.
const back = readFileSync(outFile, "utf8");
if (back !== LINE) throw new Error("round-trip mismatch: file content differs from LINE");
// Voice guard (revision, per judge brief): a dying-phone last text must name its
// battery state and say goodbye — no generic filler allowed to pass silently.
if (!LINE.includes("1%")) throw new Error("entry must state the 1% battery");
if (!/goodbye/i.test(LINE)) throw new Error("entry must say goodbye");
console.log(`entry ok: ${chars.length} chars, 1 line`);
