// One-off balance script: rescales the shared mhp/mmp/mtp base curve tiers across all 24 classes.
//
// Every class's mhpGrowthCurve / mmpGrowthCurve / mtpBuffPlus tag follows the shape
//   <XxxGrowthCurve:[(BASE+SLOPE*(a.level-1))*MULT]>
// where BASE/SLOPE come from one of three shared tiers (currently 100/25, 80/20, 60/20 - note
// mtpBuffPlus's Group-A-only 80/22 formula collapses into the 180-tier below, picking up slope 30
// instead of keeping its old unique slope 22). MULT is per-class and untouched by this script.
//
// mhp/mmp additionally have a baked params[] table (levels 1-99; index 0 is the unused RMMZ
// placeholder, always 1) that is the actual runtime source of truth for levels 1-99 - the note tag
// only matters beyond level 99. This script regenerates that table to match. mtp has no such table;
// it's tag-driven at every level, so only the note tag needs updating.
//
// Run with `bun rescale-resource-curves.js` for a dry run (no writes, just a report).
// Run with `bun rescale-resource-curves.js --apply` to actually write the file.

const fs = require("fs");
const path = "./Classes.json";

// old base -> new {base, slope}
const TIER_MAP = {
  100: { base: 220, slope: 40 },
  80: { base: 180, slope: 30 },
  60: { base: 140, slope: 25 },
};

const TAGS = [
  { name: "mhpGrowthCurve", paramIdx: 0 },
  { name: "mmpGrowthCurve", paramIdx: 1 },
  { name: "mtpBuffPlus", paramIdx: null }, // no table - tag only
];

function parseDataLine(line) {
  const trimmed = line.trim();
  if (trimmed === "[" || trimmed === "]" || trimmed === "null," || trimmed === "") return null;
  const hasTrailingComma = trimmed.endsWith(",");
  const jsonPart = hasTrailingComma ? trimmed.slice(0, -1) : trimmed;
  try {
    return JSON.parse(jsonPart);
  } catch {
    return null;
  }
}

const isApply = process.argv.includes("--apply");
const raw = fs.readFileSync(path, "utf8");
const lines = raw.split("\n");

let touchedClasses = 0;
const report = [];

const outLines = lines.map((line) => {
  const trimmed = line.trim();
  if (trimmed === "[" || trimmed === "]" || trimmed === "null," || trimmed === "") return line;

  const hasTrailingComma = trimmed.endsWith(",");
  const jsonPart = hasTrailingComma ? trimmed.slice(0, -1) : trimmed;

  let obj;
  try {
    obj = JSON.parse(jsonPart);
  } catch {
    return line;
  }

  if (!obj || typeof obj !== "object") return line;

  let note = obj.note;
  let classTouched = false;
  const classReport = { id: obj.id, name: obj.name, changes: [] };

  for (const { name, paramIdx } of TAGS) {
    const tagRe = new RegExp(`<${name}:\\[\\((\\d+)\\+([0-9.]+)\\*\\(a\\.level-1\\)\\)\\*([0-9.]+)\\]>`);
    const match = note.match(tagRe);
    if (!match) continue; // this class doesn't carry this tag at all

    const oldBase = parseInt(match[1]);
    const oldSlope = parseFloat(match[2]);
    const mult = parseFloat(match[3]);

    const tier = TIER_MAP[oldBase];
    if (!tier) throw new Error(`Class ${obj.id} ${name}: unrecognized base ${oldBase}, no tier mapping`);

    const { base: newBase, slope: newSlope } = tier;

    if (newBase === oldBase && newSlope === oldSlope) continue; // already matches (idempotency)

    note = note.replace(tagRe, `<${name}:[(${newBase}+${newSlope}*(a.level-1))*${mult}]>`);
    classTouched = true;

    let tableNote = "";
    if (paramIdx !== null) {
      const table = obj.params[paramIdx];
      for (let level = 1; level < table.length; level++) {
        table[level] = Math.round((newBase + newSlope * (level - 1)) * mult);
      }
      tableNote = ` [table regen'd 1-${table.length - 1}]`;
    }

    classReport.changes.push(
      `${name}: (${oldBase}+${oldSlope}*..)*${mult} -> (${newBase}+${newSlope}*..)*${mult}${tableNote}`);
  }

  if (classTouched) {
    touchedClasses++;
    obj.note = note;
    report.push(classReport);
  }

  return JSON.stringify(obj) + (hasTrailingComma ? "," : "");
});

console.log(`Mode: ${isApply ? "APPLY (writing file)" : "DRY RUN (no writes)"}`);
console.log(`Classes touched: ${touchedClasses}`);
console.log("\nChanges:");
for (const r of report) {
  console.log(`  [${r.id}] ${r.name}`);
  for (const c of r.changes) console.log(`    ${c}`);
}

if (isApply) {
  fs.writeFileSync(path, outLines.join("\n"), "utf8");
  console.log(`\nWrote ${path}`);
} else {
  console.log("\nDry run only - no file written. Re-run with --apply to write.");
}
