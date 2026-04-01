/**
 * Overwrites name/description/flavor for generator-created SDP rows:
 * - Tiers 6–10 for every family in sdp-thematic-data.js (excludes TUT/ENC/FGT/SIN/ELE).
 * - Tiers 1–5 when copy matches procedural generator fingerprints.
 *
 * Run: node chef-adventure/tools/sdp-apply-thematic.js
 */
const fs = require('fs');
const path = require('path');

const { THEMES, TINT } = require('./sdp-thematic-data');

const root = path.join(__dirname, '..');
const configPath = path.join(root, 'data', 'config.sdp.json');

const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const SKIP_PREFIX = new Set(['TUT', 'ENC', 'FGT', 'SIN', 'ELE']);

const ADJ_TITLE = new Set(
  [
    'Audacious', 'Bleary', 'Chaotic', 'Delinquent', 'Esoteric', 'Feral', 'Giddy', 'Hushed',
    'Indignant', 'Jumbo', 'Knackered', 'Luminous', 'Murky', 'Nervy', 'Obstinate', 'Peppy',
    'Querulous', 'Rambunctious', 'Skittish', 'Tentative', 'Unhinged', 'Vivid', 'Wobbly',
    'Zealous', 'Brined', 'Caramelized', 'Deep-fried', 'Flash-seared', 'Overproof', 'Pickled',
    'Smoked', 'Twice-baked', 'Under-salted', 'Velvety', 'Whipped', 'Zested',
  ],
);

const HOOK_FLAVORS = new Set([
  'Whispers inventory jokes.',
  'Files taxes in triplicate.',
  'Knows your save scum shame.',
  'Smells like victory and onions.',
  'Negotiates with gravity.',
  'Counts coup on your to-do list.',
  'Writes fanfic about your build.',
  'Queues behind your regrets.',
  'Tips the dungeon scale.',
  'Invoices the afterlife.',
]);

const LORE_TAIL_SNIPPETS = [
  'Still better than the tutorial chest.',
  'Chef Adventure shrugs and updates the tooltip.',
  'It arrived anyway with a garnish.',
  'Respect the hustle.',
  'prefers it that way.',
  'The pamphlet was on fire.',
  'Use responsibly.',
  'Partially successful.',
];

function isProceduralCopy(panel) {
  const d = panel.description || '';
  const f = panel.topFlavorText || '';
  const nm = panel.name || '';
  if (HOOK_FLAVORS.has(f)) return true;
  if (LORE_TAIL_SNIPPETS.some(s => d.includes(s))) return true;
  if (/node hums like a guilty microwave/.test(d)) return true;
  if (/Every rank in .+ adds one \(1\) dramatic pause/.test(d)) return true;
  if (/Legally distinct from/.test(d)) return true;
  if (/insists it is canon/.test(d)) return true;
  if (/once filed a bug report against gravity/.test(d)) return true;
  const first = nm.split(' ')[0];
  if (ADJ_TITLE.has(first)) return true;
  if (/\([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\)$/.test(nm) && /\((Ghosty|Reborn|Wisp|Bone|Necro|Snake|Dragon|Drake|Hydra|Salamander|Kappa|Frog|Crab|Fish|Kraken|Slime|Tentacle|Jelly|Aerial|Cube|Trap|Fungus|Fae|Treant|Bloom|Hybrid|Wing|Bird|Rodent|Quad|Hive|Worm|Stray|Spring|Parry|Beast|Orc|Rogue|Stroll|Clean|Colossus|Hazard|Robot|Hearth|Rune|Aspect|Sovereign|Covenant)\)$/.test(nm)) {
    return true;
  }
  if (/^The .+ of .+/.test(nm) && nm.includes('Covenant')) return true;
  return false;
}

const LOW_ROLES = ['Probationary', 'Junior', 'Field', 'Swing-shift', 'Acting'];

function buildLowFromHigh() {
  const LOW = {};
  for (const [pref, rows] of Object.entries(THEMES)) {
    const tint = TINT[pref] || pref;
    LOW[pref] = rows.map((hi, i) => {
      const tail = hi.desc.includes('|') ? hi.desc.split('|')[1].trim() : hi.desc;
      return {
        name: `${LOW_ROLES[i]} ${hi.name}`,
        desc: `Entry-rank node on the ${tint} line—same mythos as the late tiers, smaller hat.|${tail}`,
        flavor: hi.flavor,
      };
    });
  }
  return LOW;
}

const THEMES_LOW = buildLowFromHigh();

function applyThematic(panel) {
  const m = panel.key.match(/^([A-Z]+)_(\d+)$/);
  if (!m) return false;
  const pref = m[1];
  const n = parseInt(m[2], 10);
  if (SKIP_PREFIX.has(pref)) return false;
  if (!THEMES[pref]) return false;

  if (n >= 6 && n <= 10) {
    const row = THEMES[pref][n - 6];
    panel.name = row.name;
    panel.description = row.desc;
    panel.topFlavorText = row.flavor;
    return true;
  }

  if (n >= 1 && n <= 5 && isProceduralCopy(panel)) {
    const row = THEMES_LOW[pref][n - 1];
    panel.name = row.name;
    panel.description = row.desc;
    panel.topFlavorText = row.flavor;
    return true;
  }

  return false;
}

let count = 0;
for (const p of cfg.sdps) {
  if (applyThematic(p)) count++;
}

fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
console.log(`Updated ${count} panels in ${configPath}`);
