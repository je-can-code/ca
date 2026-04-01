/**
 * Expands Chef Adventure SDP grid to 10 panels per monster sub-line (500) + TUT/ENC/FGT (22),
 * renames stubbed panels with creative copy, and reorders families to match Enemies.json (ids 101–600).
 *
 * Run from repo root: node chef-adventure/tools/sdp-grid-finalize.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const enemiesPath = path.join(root, 'data', 'Enemies.json');
const configPath = path.join(root, 'data', 'config.sdp.json');

const enemies = JSON.parse(fs.readFileSync(enemiesPath, 'utf8'));
let cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const LEAD = ['TUT', 'ENC', 'FGT'];
const MONSTER_TARGET = 10;
const LEAD_TARGETS = { TUT: 2, ENC: 10, FGT: 10 };

function familyPrefix(key) {
  return key.split('_')[0];
}

function numSuffix(key) {
  const m = key.match(/_(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
}

function isHeaderRow(p) {
  const n = p.name;
  return n.startsWith('==') || n.startsWith('--') || n.startsWith('__');
}

function hash32(str, salt = 0) {
  let h = salt >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function isStubPanel(p) {
  if (isHeaderRow(p)) return false;
  const d = p.description || '';
  const f = p.topFlavorText || '';
  const nm = p.name || '';
  if (d.includes('Enemy grid alignment stub')) return true;
  if (d.includes('Draft panel for the')) return true;
  if (f.includes('Stub; tune')) return true;
  if (nm === 'TODO' || nm === 'Scaffold Node') return true;
  if (/^(Firstfold|Second Vein|Third Mark|Fourth Seal|Fifth Crown|Mark \d+) /.test(nm)) return true;
  return false;
}

const TINT = {
  GHO: 'Ghosty',
  REB: 'Reborn',
  WIL: 'Wisp',
  BON: 'Bone',
  NEC: 'Necro',
  SNK: 'Snake',
  DRG: 'Dragon',
  DCO: 'Drake',
  HYD: 'Hydra',
  SAL: 'Salamander',
  KAP: 'Kappa',
  FRG: 'Frog',
  CRB: 'Crab',
  FSH: 'Fish',
  CPH: 'Cephalo',
  SLI: 'Slime',
  TNT: 'Tentacle',
  JEL: 'Jelly',
  AER: 'Aerial',
  CUB: 'Cube',
  TRP: 'Trap',
  FUN: 'Fungus',
  FAE: 'Fae',
  TRE: 'Treant',
  FLW: 'Bloom',
  HBR: 'Hybrid',
  WNG: 'Wing',
  BEK: 'Bird',
  ROD: 'Rodent',
  QUA: 'Quad',
  HIV: 'Hive',
  WRM: 'Worm',
  LON: 'Stray',
  JMP: 'Spring',
  PAR: 'Parry',
  BUL: 'Beast',
  ORC: 'Orc',
  THF: 'Rogue',
  WLK: 'Stroll',
  CLN: 'Clean',
  GOL: 'Colossus',
  HAZ: 'Hazard',
  RBT: 'Robot',
  HOM: 'Hearth',
  RUN: 'Rune',
  ELE: 'Element',
  SIN: 'Sin',
  ASP: 'Aspect',
  SOV: 'Sovereign',
  COV: 'Covenant',
};

const ADJ = [
  'audacious', 'bleary', 'chaotic', 'delinquent', 'esoteric', 'feral', 'giddy', 'hushed',
  'indignant', 'jumbo', 'knackered', 'luminous', 'murky', 'nervy', 'obstinate', 'peppy',
  'querulous', 'rambunctious', 'skittish', 'tentative', 'unhinged', 'vivid', 'wobbly',
  'zealous', 'brined', 'caramelized', 'deep-fried', 'flash-seared', 'overproof', 'pickled',
  'smoked', 'twice-baked', 'under-salted', 'velvety', 'whipped', 'zested',
];

const NOUN = [
  'spatula', 'sous-chef', 'reduction', 'julienne', 'roux', 'mandoline', 'bain-marie',
  'proofing drawer', 'walk-in', 'expedite ticket', 'health inspector', 'mise en place',
  'pastry bag', 'brigade', 'line cook', 'dish pit', 'thermometer', 'tasting spoon',
  'prep table', 'garde manger', 'sommelier', 'pantry ghost', 'recipe card', 'oven spring',
  'steam table', 'deep cut', 'side quest', 'loot goblin', 'crit table', 'save slot',
  'patch note', 'texture pop', 'hitbox', 'aggro radius', 'cooldown', 'proc rate',
];

const HOOK_SNIPPETS = [
  'whispers inventory jokes',
  'files taxes in triplicate',
  'knows your save scum shame',
  'smells like victory and onions',
  'negotiates with gravity',
  'counts coup on your to-do list',
  'writes fanfic about your build',
  'queues behind your regrets',
  'tips the dungeon scale',
  'invoices the afterlife',
];

const LORE_A = [
  'The {name} node hums like a guilty microwave.|Still better than the tutorial chest.',
  '{name} insists it is canon.|Chef Adventure shrugs and updates the tooltip.',
  'You did not ask for {name}.|It arrived anyway with a garnish.',
  '{name} is absolutely overqualified for this biome.|Respect the hustle.',
  'Legally distinct from the thing you thought it was.|{name} prefers it that way.',
  '{name} learned everything from a pamphlet.|The pamphlet was on fire.',
  'Every rank in {name} adds one (1) dramatic pause.|Use responsibly.',
  '{name} once filed a bug report against gravity.|Partially successful.',
];

function titleCasePhrase(s) {
  if (!s || typeof s !== 'string') {
    return 'Mystery';
  }
  return s
    .split(' ')
    .map(w => (w.length ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');
}

function sinCopy(n) {
  const rows = {
    3: {
      name: "Envy's Dogma",
      desc:
        'The dogma of Envy is held above all else: "thou must covet thy neighbor\'s loot table."|Accounting already lost to Wrath; this line just files the appeal.',
      flavor: 'Resentment is just ambition wearing a bad disguise.',
    },
    4: {
      name: "Pride's Dogma",
      desc:
        'The dogma of Pride is held above all else: "thou art the main character of this patch."|The patch notes agree. The changelog is just shy.',
      flavor: 'The UI bends around your ego. Slightly.',
    },
    5: {
      name: "Sloth's Dogma",
      desc:
        'The dogma of Sloth is held above all else: "thou may press skip on thine own motivation."|Balance can wait. The couch cannot.',
      flavor: 'Momentum is optional. Snacks are not.',
    },
    6: {
      name: "Greed's Dogma",
      desc:
        'The dogma of Greed is held above all else: "thou shalt roll need on everything."|Gold-star hoarder energy for the SDP grid.',
      flavor: 'Your inventory has opinions. They are all "more."',
    },
    7: {
      name: "Lust's Dogma",
      desc:
        'The dogma of Lust is held above all else: "thou must desire the shiny number go up."|Chef Adventure keeps it PG and very greedy.',
      flavor: 'Crave the crit. Negotiate with the RNG.',
    },
    8: {
      name: "Vanity's Dogma",
      desc:
        'The dogma of Vanity is held above all else: "thou shalt look incredible while wiping."|Fashion souls meets spreadsheet souls.',
      flavor: 'If the particle effect is loud enough, the mistake never happened.',
    },
    9: {
      name: "Despair's Dogma",
      desc:
        'The dogma of Despair is held above all else: "thou expected the drop and still got hurt."|Endgame mood panel for grown-ups.',
      flavor: 'The loot table stares back. It blinks first. Barely.',
    },
    10: {
      name: "Irony's Dogma",
      desc:
        'The dogma of Irony is held above all else: "thou min-maxed sincerity and crit anyway."|Meta-sin for the post-tutorial hangover.',
      flavor: 'You optimized the joke. The joke optimized you back.',
    },
  };
  return rows[n] || null;
}

function eleCopy(n) {
  const rows = {
    2: {
      name: 'Thermal Backtalk',
      desc:
        'Heat argues with cold until the kitchen files a noise complaint.|Thermodynamics holds a grudge; bring mitts.',
      flavor: 'Radiators text back in all caps.',
    },
    3: {
      name: 'Tidal Bureaucracy',
      desc:
        'The ocean issues permits for every splash you make.|Water-line paperwork for people who forgot their floaties.',
      flavor: 'Low tide is just off-hours for the reef HR department.',
    },
    4: {
      name: 'Terrace Fault',
      desc:
        'Stone keeps receipts for every footstep you denied it.|Standing your ground voids the warranty on your ankles.',
      flavor: 'Tectonic plates share a group chat. You are @mentioned.',
    },
    5: {
      name: 'Aether Spam Folder',
      desc:
        'The fifth element is mostly newsletters you forgot to unsubscribe from.|Unsubscribe links are a myth invented by calm people.',
      flavor: 'Your inbox ascends. The junk folder becomes sky.',
    },
    6: {
      name: 'Voltish Etiquette',
      desc:
        'Lightning apologizes before it strikes. Politely.|Resist tables are suggestions; volts are executive decisions.',
      flavor: 'Static cling is just affection with poor boundaries.',
    },
    7: {
      name: 'Crystalline Receipt',
      desc:
        'Gems itemize your sins in facets.|Ice-crystal line for people who like their loot faceted.',
      flavor: 'Every refraction is a line item.',
    },
    8: {
      name: 'Umbra Catering',
      desc:
        'Shadow serves hors d\'oeuvres you cannot pronounce.|Midnight brunch is valid if the dungeon agrees.',
      flavor: 'The void pairs well with a dry red and denial.',
    },
    9: {
      name: 'Plasma Complaint Desk',
      desc:
        'Ionized air files grievances in neon.|If you glow, file form 7-B: Incident—Luminous Regret.',
      flavor: 'The arc is just customer service with better lighting.',
    },
    10: {
      name: 'Chorus of Allergies',
      desc:
        'Ten elements sneeze at once. You take resist damage.|Carry antihistamines and a second save slot.',
      flavor: 'Histamines are a damage type now. Build around it.',
    },
  };
  return rows[n] || null;
}

function generatedName(pref, n, usedInFamily) {
  const tint = TINT[pref] || pref;
  const adjLen = ADJ.length;
  const nounLen = NOUN.length;
  for (let salt = 0; salt < 400; salt++) {
    const h = hash32(`${pref}_${n}`, salt * 977) >>> 0;
    const a = ADJ[h % adjLen];
    const b = NOUN[(h >> 7) % nounLen];
    const c = NOUN[(h >> 13) % nounLen];
    const pats = [
      () => `${titleCasePhrase(a)} ${titleCasePhrase(b)}`,
      () => `${titleCasePhrase(b)} ${titleCasePhrase(a)}`,
      () => `${titleCasePhrase(tint)} ${titleCasePhrase(b)}`,
      () => `The ${titleCasePhrase(b)} of ${titleCasePhrase(a)} ${titleCasePhrase(tint)}`,
      () => `${titleCasePhrase(a)} ${titleCasePhrase(tint)} ${titleCasePhrase(c)}`,
      () => `${titleCasePhrase(b)} (${titleCasePhrase(tint)})`,
    ];
    const name = pats[h % pats.length]();
    if (!usedInFamily.has(name)) {
      usedInFamily.add(name);
      return name;
    }
  }
  const fallback = `${tint} Stratum ${n}`;
  usedInFamily.add(fallback);
  return fallback;
}

function generatedLore(pref, n, name) {
  const h = hash32(`${pref}|${n}|${name}`, 0xbeef);
  const template = LORE_A[h % LORE_A.length] || LORE_A[0];
  const line = template.replace(/\{name\}/g, name);
  const hi = (h >>> 5) % HOOK_SNIPPETS.length;
  const hook = HOOK_SNIPPETS[hi] || 'hums with misplaced confidence';
  const parts = line.split('|');
  const d1 = parts[0] || line;
  const d2 = parts[1] || 'The tooltip team sends regards.';
  return { desc: `${d1}|${d2}`, flavor: hook.charAt(0).toUpperCase() + hook.slice(1) + '.' };
}

function applyCreativeCopy(pref, n, panel, usedNames) {
  if (pref === 'SIN' && n >= 3) {
    const s = sinCopy(n);
    if (s) {
      panel.name = s.name;
      panel.description = s.desc;
      panel.topFlavorText = s.flavor;
      usedNames.add(s.name);
      return;
    }
  }
  if (pref === 'ELE' && n >= 2) {
    const e = eleCopy(n);
    if (e) {
      panel.name = e.name;
      panel.description = e.desc;
      panel.topFlavorText = e.flavor;
      usedNames.add(e.name);
      return;
    }
  }
  const name = generatedName(pref, n, usedNames);
  const { desc, flavor } = generatedLore(pref, n, name);
  panel.name = name;
  panel.description = desc;
  panel.topFlavorText = flavor;
}

function monsterFamilyOrder() {
  const order = [];
  const seen = new Set();
  for (let id = 101; id <= 600; id++) {
    const e = enemies[id];
    if (!e || !e.note) continue;
    const m = e.note.match(/<sdpDropData:\s*\[([A-Z0-9_]+),/i);
    if (!m) continue;
    const pref = m[1].split('_')[0];
    if (seen.has(pref)) continue;
    seen.add(pref);
    order.push(pref);
  }
  return order;
}

function targetForPrefix(pref) {
  if (LEAD_TARGETS[pref] !== undefined) {
    return LEAD_TARGETS[pref];
  }
  return MONSTER_TARGET;
}

function pickTemplate(pref, n, byKey) {
  for (let k = n - 1; k >= 1; k--) {
    const key = `${pref}_${k}`;
    if (byKey.has(key)) {
      return JSON.parse(JSON.stringify(byKey.get(key)));
    }
  }
  return null;
}

function stripRewards(panel) {
  panel.panelRewards = [];
}

function scaleStub(panel, templateKeyN, n) {
  const baseN = templateKeyN;
  const tierDelta = Math.max(0, n - baseN);
  const scale = 1 + tierDelta * 0.1;
  panel.baseCost = Math.max(10, Math.round(panel.baseCost * scale));
  panel.flatGrowthCost = Math.max(10, Math.round(panel.flatGrowthCost * scale));
  if (typeof panel.multGrowthCost === 'number') {
    panel.multGrowthCost = Math.round((panel.multGrowthCost + tierDelta * 0.02) * 100) / 100;
  }
  if (panel.panelParameters && panel.panelParameters.length) {
    panel.panelParameters = panel.panelParameters.map(param => {
      const next = { ...param };
      if (typeof next.perRank === 'number') {
        const sign = next.perRank < 0 ? -1 : 1;
        const mag = Math.abs(next.perRank);
        next.perRank = sign * Math.round(mag * (1 + tierDelta * 0.05) * 100) / 100;
      }
      return next;
    });
  }
}

// --- Build byKey and byPref from current config ---
const byKey = new Map();
for (const p of cfg.sdps) {
  byKey.set(p.key, p);
}

const byPref = new Map();
for (const p of cfg.sdps) {
  const pref = familyPrefix(p.key);
  if (!byPref.has(pref)) byPref.set(pref, []);
  byPref.get(pref).push(p);
}

const monsterOrder = monsterFamilyOrder();
const allPrefsInCfg = [...byPref.keys()];

for (const pref of allPrefsInCfg) {
  const target = targetForPrefix(pref);
  const usedNames = new Set();

  for (let n = 1; n <= target; n++) {
    const key = `${pref}_${n}`;
    let panel = byKey.get(key);
    if (!panel) {
      const tmpl = pickTemplate(pref, n, byKey);
      if (!tmpl) {
        console.error(`No template for new panel ${key}`);
        process.exit(1);
      }
      const templateNum = numSuffix(tmpl.key);
      panel = tmpl;
      panel.key = key;
      stripRewards(panel);
      scaleStub(panel, templateNum, n);
      cfg.sdps.push(panel);
      byKey.set(key, panel);
      byPref.get(pref).push(panel);
      applyCreativeCopy(pref, n, panel, usedNames);
    }
    else if (isStubPanel(panel)) {
      applyCreativeCopy(pref, n, panel, usedNames);
    }
    else {
      usedNames.add(panel.name);
    }
  }
}

// Second pass: any stub we missed (edge cases)
for (const p of cfg.sdps) {
  if (isHeaderRow(p)) continue;
  const m = p.key.match(/^([A-Z]+)_(\d+)$/);
  if (!m) continue;
  const pref = m[1];
  const n = parseInt(m[2], 10);
  if (isStubPanel(p)) {
    const used = new Set();
    const fam = cfg.sdps.filter(x => familyPrefix(x.key) === pref && /^[A-Z]+_\d+$/.test(x.key));
    for (const x of fam) {
      if (!isStubPanel(x)) used.add(x.name);
    }
    applyCreativeCopy(pref, n, p, used);
  }
}

// --- Rebuild sdps in canonical order ---
function numericPanelsForPref(items) {
  return items.filter(p => /^[A-Z]+_\d+$/.test(p.key)).sort((a, b) => numSuffix(a.key) - numSuffix(b.key));
}

const orderedPrefixes = [];
for (const p of LEAD) {
  if (byPref.has(p)) orderedPrefixes.push(p);
}
for (const p of monsterOrder) {
  if (byPref.has(p) && !LEAD.includes(p)) orderedPrefixes.push(p);
}
for (const p of [...allPrefsInCfg].sort()) {
  if (!orderedPrefixes.includes(p)) orderedPrefixes.push(p);
}

const newSdps = [];
for (const pref of orderedPrefixes) {
  const items = byPref.get(pref);
  const headers = items.filter(p => isHeaderRow(p) || p.key.endsWith('___'));
  const nums = numericPanelsForPref(items);
  const headerSorted = [...headers].sort((a, b) => {
    const ah = a.name.startsWith('==') ? 0 : 1;
    const bh = b.name.startsWith('==') ? 0 : 1;
    if (ah !== bh) return ah - bh;
    return a.key.localeCompare(b.key);
  });
  newSdps.push(...headerSorted, ...nums);
}

cfg.sdps = newSdps;

const keys = cfg.sdps.map(p => p.key);
const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
if (dup.length) {
  console.error('Duplicate keys:', dup);
  process.exit(1);
}

let numeric = 0;
for (const p of cfg.sdps) {
  if (/^[A-Z]+_\d+$/.test(p.key)) numeric++;
}

fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
console.log('Wrote', configPath);
console.log('Numeric panels:', numeric, '(expected 522)');
console.log('Total rows:', cfg.sdps.length);
