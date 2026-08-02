// One-off balance script: scales enemy atk/mat/agi ("offense") and def/mdf/luk ("defense")
// base params, while keeping the design formula honest:
//   params[stat] == 4 * <statBuffPlus> per-level coefficient
//
// Always derives "before" values from Enemies.backup.json (the untouched original), never from
// the current (possibly already-scaled) Enemies.json. This makes re-runs idempotent instead of
// compounding - re-running with the same multiplier twice produces the same result both times,
// and targeting a subgroup a second time with a different multiplier corrects it cleanly rather
// than stacking on top of the first pass.
//
// Enemies outside ID_RANGE are left completely untouched (copied through as-is).
//
// Run with `bun reduce-enemy-params.js` for a dry run (no writes, just a report).
// Run with `bun reduce-enemy-params.js --apply` to actually write the file.

const fs = require("fs");
const path = "./Enemies.json";
const backupPath = "./Enemies.backup.json";

// --- tune per-stat multipliers directly; any value works, the coefficient is rounded to the ---
// --- nearest 0.25 after scaling, which is what actually keeps params integer. ---
// --- ONLY stats listed here are touched at all - anything omitted is left completely alone ---
// --- at its current (possibly already-scaled) value, never reset back toward the original. ---
const MULTIPLIERS = {
  atk: 0.5,
  def: 0.5,
};

// inclusive id range to target - set to a single decade (e.g. a monster family's GHO_1..GHO_10
// spans ids 101-110) or widen back to 101-600 to touch everything again.
const ID_RANGE = { start: 141, end: 150 };
// ---------------------------------------------------------------

const STATS = {
  atk: { paramIdx: 2 },
  def: { paramIdx: 3 },
  mat: { paramIdx: 4 },
  mdf: { paramIdx: 5 },
  agi: { paramIdx: 6 },
  luk: { paramIdx: 7 },
};


// rounds a coefficient to the nearest 0.25 so params[stat] = 4*coeff always lands on an integer
function roundToQuarter(value) {
  return Math.round(value / 0.25) * 0.25;
}

function formatCoefficient(value) {
  return String(value);
}

function inRange(id) {
  return id >= ID_RANGE.start && id <= ID_RANGE.end;
}

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

// build id -> original enemy object lookup from the untouched backup
const backupLines = fs.readFileSync(backupPath, "utf8").split("\n");
const backupById = new Map();
for (const line of backupLines) {
  const obj = parseDataLine(line);
  if (obj && typeof obj === "object" && obj.id != null) backupById.set(obj.id, obj);
}

const isApply = process.argv.includes("--apply");
const raw = fs.readFileSync(path, "utf8");
const lines = raw.split("\n");

let touchedEnemies = 0;
let touchedStats = 0;
let flatStatEnemies = 0;
const sampleReport = [];

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

  if (!obj || typeof obj !== "object" || !inRange(obj.id)) return line;

  const backupObj = backupById.get(obj.id);
  if (!backupObj) return line; // no original on record, leave alone rather than guess

  let note = obj.note;
  let enemyTouched = false;
  const enemyReport = { id: obj.id, name: obj.name, changes: [] };

  for (const [stat, mult] of Object.entries(MULTIPLIERS)) {
    const { paramIdx } = STATS[stat];
    const tagRe = new RegExp(`<${stat}BuffPlus:\\[\\(a\\.level \\* ([0-9.]+)\\)\\]>`);
    const currentMatch = note.match(tagRe);
    const backupMatch = backupObj.note.match(tagRe);

    if (backupMatch) {
      // formula-driven stat: scale the ORIGINAL coefficient, round to nearest 0.25, rederive the param
      const originalCoeff = parseFloat(backupMatch[1]);
      const newCoeff = roundToQuarter(originalCoeff * mult);
      const originalParam = backupObj.params[paramIdx];
      const currentParam = obj.params[paramIdx];
      const newParam = Math.round(newCoeff * 4);

      if (newParam !== currentParam || !currentMatch) {
        note = note.replace(tagRe, `<${stat}BuffPlus:[(a.level * ${formatCoefficient(newCoeff)})]>`);
        obj.params[paramIdx] = newParam;
        enemyTouched = true;
        touchedStats++;
        enemyReport.changes.push(
          `${stat}: coeff ${originalCoeff}->${newCoeff}, param ${originalParam}(orig)/${currentParam}(current)->${newParam}`);
      }
    } else {
      // flat stat, no growth tag - scale the ORIGINAL param directly
      const originalParam = backupObj.params[paramIdx];
      const currentParam = obj.params[paramIdx];
      const newParam = Math.round(originalParam * mult);
      if (newParam !== currentParam) {
        obj.params[paramIdx] = newParam;
        enemyTouched = true;
        touchedStats++;
        flatStatEnemies++;
        enemyReport.changes.push(`${stat} (flat, no tag): param ${originalParam}(orig)/${currentParam}(current)->${newParam}`);
      }
    }
  }

  if (enemyTouched) {
    touchedEnemies++;
    obj.note = note;
    sampleReport.push(enemyReport);
  }

  return JSON.stringify(obj) + (hasTrailingComma ? "," : "");
});

console.log(`Mode: ${isApply ? "APPLY (writing file)" : "DRY RUN (no writes)"}`);
console.log(`Target id range: ${ID_RANGE.start}-${ID_RANGE.end}`);
console.log(`Multipliers: ${JSON.stringify(MULTIPLIERS)}`);
console.log(`Enemies touched: ${touchedEnemies}`);
console.log(`Stat values touched: ${touchedStats}`);
console.log(`Of those, flat-stat (no growth tag) adjustments: ${flatStatEnemies}`);
console.log("\nChanges:");
for (const r of sampleReport) {
  console.log(`  [${r.id}] ${r.name}`);
  for (const c of r.changes) console.log(`    ${c}`);
}

if (isApply) {
  fs.writeFileSync(path, outLines.join("\n"), "utf8");
  console.log(`\nWrote ${path}`);
} else {
  console.log("\nDry run only - no file written. Re-run with --apply to write.");
}
